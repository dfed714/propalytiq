import { Module } from '@nestjs/common';
import { StripeService } from '../payments/stripe.service';

@Module({
  providers: [StripeService],
  exports: [StripeService],
})
export class PaymentsModule {}
