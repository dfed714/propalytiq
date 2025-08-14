// dashboard.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from '../user/user.service';
// import { ReportService } from '../reports/report.service';
// import { SubscriptionService } from '../subscriptions/subscription.service';
// import { StripeService } from '../payments/stripe.service';

@Injectable()
export class DashboardService {
  constructor(private readonly userService: UserService) {}

  async getDashboardData(clerkId: string) {
    const [user] = await Promise.all([
      this.userService.getUserByClerkId(clerkId),
    ]);

    if (!user) throw new NotFoundException('User not found');

    return {
      user,
    };
  }
}
