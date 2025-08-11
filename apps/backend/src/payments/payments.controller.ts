import { Controller, Post, Body, Req, Res, HttpCode } from '@nestjs/common';
import type { Request, Response } from 'express';
import { StripeService } from './stripe.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('create-subscription')
  async createSubscription(
    @Body() body: { priceId: string; customerId: string },
  ) {
    const { priceId, customerId } = body;
    const subscription = await this.stripeService.createSubscription(
      customerId,
      priceId,
    );
    return subscription;
  }

  @Post('update-subscription')
  async updateSubscription(
    @Body() body: { subscriptionId: string; priceId: string },
  ) {
    const { subscriptionId, priceId } = body;
    return await this.stripeService.updateSubscription(subscriptionId, priceId);
  }

  @Post('cancel-subscription')
  async cancelSubscription(
    @Body() body: { subscriptionId: string; cancelAtPeriodEnd?: boolean },
  ) {
    const { subscriptionId, cancelAtPeriodEnd = true } = body;
    return await this.stripeService.cancelSubscription(
      subscriptionId,
      cancelAtPeriodEnd,
    );
  }

  @Post('webhook')
  @HttpCode(200)
  handleWebhook(@Req() req: Request, @Res() res: Response) {
    try {
      const event = this.stripeService.constructEvent(req);

      if (event.type === 'invoice.payment_succeeded') {
        // Handle subscription success logic here
        console.log('Payment succeeded:', event.data.object);
      }

      res.send({ received: true });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Webhook Error:', error.message);
        res.status(400).send(`Webhook Error: ${error.message}`);
      } else {
        console.error('Webhook Error:', error);
        res.status(400).send('Webhook Error');
      }
    }
  }
}
