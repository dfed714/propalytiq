/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ReportService } from './service';
import type { ReportInfoDto } from '@dtos';

@Controller('report')
export class ReportController {
  constructor(private readonly service: ReportService) {}

  @Get('all')
  async getAllReports(
    @Query('user_id') user_id: string,
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 8,
  ): Promise<ReportInfoDto[] | []> {
    return await this.service.getAllReports(user_id, offset, limit);
  }

  @Post('create')
  async createReport(
    @Body() body: { report: ReportInfoDto; user_id: string },
  ): Promise<ReportInfoDto> {
    console.log(body.report);

    return await this.service.createReport(body.report, body.user_id);
  }
}
