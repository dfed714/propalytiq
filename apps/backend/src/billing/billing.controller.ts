import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { BillingService } from './billing.service';
import { ClerkAuthGuard } from '../auth/clerk-auth.guard'; // Your JWT/Clerk auth guard

@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @UseGuards(ClerkAuthGuard)
  @Get()
  async getBilling(@Req() req) {
    const clerkUserId = req.user.sub as string;
    return this.billingService.getBillingData(clerkUserId);
  }
}
