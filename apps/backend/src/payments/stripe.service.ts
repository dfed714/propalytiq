import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import type { Request } from 'express';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2025-07-30.basil',
    });
  }

  createSubscription = async (customerId: string, priceId: string) => {
    return await this.stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
    });
  };

  async updateSubscription(subscriptionId: string, priceId: string) {
    // Update subscription item(s) with new price
    const subscription =
      await this.stripe.subscriptions.retrieve(subscriptionId);

    if (!subscription.items.data.length) {
      throw new Error('Subscription has no items to update');
    }

    const subscriptionItemId = subscription.items.data[0].id;

    return await this.stripe.subscriptions.update(subscriptionId, {
      items: [
        {
          id: subscriptionItemId,
          price: priceId,
        },
      ],
    });
  }

  async cancelSubscription(
    subscriptionId: string,
    cancelAtPeriodEnd: boolean = true,
  ) {
    return await this.stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: cancelAtPeriodEnd,
    });
  }

  async getSubscription(subscriptionId: string) {
    return await this.stripe.subscriptions.retrieve(subscriptionId, {
      expand: ['items.data.plan.product'],
    });
  }

  async getProduct(productId: string) {
    return await this.stripe.products.retrieve(productId);
  }

  constructEvent(req: Request): Stripe.Event {
    const signature = req.headers['stripe-signature'];

    if (!signature || typeof signature !== 'string') {
      throw new Error('Missing or invalid Stripe signature');
    }

    // IMPORTANT: req.body must be the raw buffer for webhook signature verification to work
    const rawBody = (req as any).rawBody;

    if (!rawBody) {
      throw new Error(
        'Raw body is missing. Make sure to use raw body parser on webhook route.',
      );
    }

    return this.stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  }
}
