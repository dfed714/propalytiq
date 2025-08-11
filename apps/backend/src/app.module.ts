import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ClerkController } from './auth/ClerkController';
import { PaymentsController } from './payments/payments.controller';
import { StripeService } from './payments/stripe.service';

@Module({
  imports: [UserModule],
  controllers: [AppController, ClerkController, PaymentsController],
  providers: [AppService, StripeService],
})
export class AppModule {}
