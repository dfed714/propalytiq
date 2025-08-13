import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { StripeService } from '../payments/stripe.service';

@Module({
  controllers: [UserController],
  providers: [UserService, StripeService],
})
export class UserModule {}
