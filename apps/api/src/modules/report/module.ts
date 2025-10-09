import { Module } from '@nestjs/common';
import { ReportController } from './controller';
import { ReportService } from './service';

@Module({
  controllers: [ReportController],
  providers: [ReportService],
  exports: [ReportService],
})
export class ReportModule {}
