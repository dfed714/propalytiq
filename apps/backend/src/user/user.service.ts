import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { StripeService } from '../payments/stripe.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly stripeService: StripeService,
  ) {}

  async getUserByClerkId(clerkUserId: string) {
    const user = await this.userRepo.getUserByClerkId(clerkUserId);

    if (!user) throw new NotFoundException('User not found');

    return {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      createdAt: user.createdAt,
      clerkUserId: user.clerkUserId,
      reports: user.reports,
      subscription: user.subscription,
    };
  }
}
