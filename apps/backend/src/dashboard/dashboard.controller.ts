import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { ClerkAuthGuard } from '../auth/clerk-auth.guard'; // Your JWT/Clerk auth guard

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @UseGuards(ClerkAuthGuard)
  @Get()
  async getDashboard(@Req() req) {
    const clerkUserId = req.user.sub as string;
    return this.dashboardService.getDashboardData(clerkUserId);
  }
}
