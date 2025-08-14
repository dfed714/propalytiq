import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
