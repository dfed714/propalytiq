import { Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { StripeService } from '../payments/stripe.service';
import Stripe from 'stripe';

//
// 4. Billing service
//
type NormalizedCardInfo = {
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
};

@Injectable()
export class BillingService {
  constructor(
    private readonly userService: UserService,
    private readonly stripeService: StripeService,
  ) {}

async getBillingData(clerkId: string) {
  const user = await this.userService.getUserByClerkId(clerkId);
  if (!user) throw new NotFoundException('User not found');

  const stripeId = user.subscription?.stripeId;
  if (!stripeId) throw new NotFoundException('Stripe subscription not found');

  // Get subscription from Stripe
  const stripeSubscription = await this.stripeService.getSubscription(stripeId);
  if (!stripeSubscription) {
    throw new NotFoundException('Subscription not found in Stripe');
  }

  // Get customer ID from subscription object
  const customerId =
    typeof stripeSubscription.customer === 'string'
      ? stripeSubscription.customer
      : stripeSubscription.customer.id;

  // Fetch Stripe customer
  const customerRes = await this.stripeService.getCustomer(customerId);

  // Type narrowing: Deleted customer check
  if ((customerRes as Stripe.DeletedCustomer).deleted) {
    throw new NotFoundException('Stripe customer account has been deleted');
  }

  const activeCustomer = customerRes as Stripe.Customer;

  let cardInfo: NormalizedCardInfo | null = null;
  let paymentMethodType: string | null = null;

  // Try PaymentMethods API
  if (activeCustomer.invoice_settings?.default_payment_method) {
    const pm = await this.stripeService.getPaymentMethod(
      activeCustomer.invoice_settings.default_payment_method as string,
    );
    if (pm.type === 'card' && pm.card) {
      cardInfo = {
        brand: pm.card.brand,
        last4: pm.card.last4,
        expMonth: pm.card.exp_month,
        expYear: pm.card.exp_year,
      };
      paymentMethodType = `${pm.card.brand} ending in ${pm.card.last4}`;
    }
  }

  // Fallback: default_source
  if (!cardInfo && activeCustomer.default_source) {
    const source = await this.stripeService.getSource(
      activeCustomer.id,
      activeCustomer.default_source as string,
    );
    if (source && (source as Stripe.Card).object === 'card') {
      const cardSource = source as Stripe.Card;
      cardInfo = {
        brand: cardSource.brand,
        last4: cardSource.last4,
        expMonth: cardSource.exp_month!,
        expYear: cardSource.exp_year!,
      };
    }
  }

  // Get current plan price info
  const subscriptionItem = stripeSubscription.items.data[0];
  const priceAmount = subscriptionItem?.price?.unit_amount ?? 0;
  const priceCurrency = subscriptionItem?.price?.currency ?? 'usd';
  const priceInterval =
    subscriptionItem?.price?.recurring?.interval ?? 'month';

  // Billing history
  const invoices = await this.stripeService.listInvoices(customerId, 3);

  return {
    plan: user.subscription.plan,
    planPrice: {
      amount: priceAmount,
      currency: priceCurrency,
      interval: priceInterval,
    },
    currentPeriodEnd: user.subscription.currentPeriodEnd,
    customerName: activeCustomer.name || `${user.first_name} ${user.last_name}`,
    customerEmail: activeCustomer.email || user.email,
    card: cardInfo,
    billingHistory: invoices.data.map((inv) => ({
      id: inv.id,
      number: inv.number,
      amountPaid: inv.amount_paid,
      currency: inv.currency,
      status: inv.status,
      date: new Date(inv.created * 1000),
      invoicePdf: inv.invoice_pdf,
    })),
  };
}

}
