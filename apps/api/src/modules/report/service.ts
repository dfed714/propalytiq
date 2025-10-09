/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
import { Injectable } from '@nestjs/common';
// Import or define ReportInfoDto
import { ReportInfoDto } from '@dtos';
import { createReport, getAllReports } from './repository';

@Injectable()
export class ReportService {
  constructor() {}

  async getAllReports(
    user_id: string,
    offset: number = 0,
    limit: number = 8,
  ): Promise<ReportInfoDto[] | []> {
    return await getAllReports(user_id, offset, limit);
  }

  async createReport(
    report: ReportInfoDto,
    user_id: string,
  ): Promise<ReportInfoDto> {
    return await createReport(report, user_id);
  }
}
