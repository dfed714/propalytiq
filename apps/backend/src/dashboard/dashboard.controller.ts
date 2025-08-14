// dashboard.controller.ts
import { Controller, Get, Req } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  async getDashboard(@Req() req) {
    const userId = req.user.id; // Provided by auth middleware
    return this.dashboardService.getDashboardData(userId);
  }
}
