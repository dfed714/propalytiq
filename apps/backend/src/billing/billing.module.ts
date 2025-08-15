import { Module } from '@nestjs/common';
import { BillingController } from './billing.controller';
import { BillingService } from './billing.service';
import { UserModule } from '../user/user.module';
import { PaymentsModule } from '../payments/payments.module';

@Module({
  imports: [UserModule, PaymentsModule],
  controllers: [BillingController],
  providers: [BillingService],
})
export class BillingModule {}
