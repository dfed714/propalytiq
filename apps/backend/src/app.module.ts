import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ClerkController } from './auth/ClerkController';
import { PaymentsController } from './payments/payments.controller';
import { StripeService } from './payments/stripe.service';
import { DashboardService } from './dashboard/dashboard.service';
import { DashboardController } from './dashboard/dashboard.controller';
import { PaymentsModule } from './payments/payments.module';
import { PrismaModule } from 'prisma/prisma.module';
import { SettingsController } from './settings/settings.controller';
import { SettingsService } from './settings/settings.service';
import { BillingController } from './billing/billing.controller';
import { BillingService } from './billing/billing.service';

@Module({
  imports: [UserModule, PaymentsModule, PrismaModule],
  controllers: [ClerkController, PaymentsController, DashboardController, SettingsController, BillingController],
  providers: [DashboardService, SettingsService, BillingService],
})
export class AppModule {}
