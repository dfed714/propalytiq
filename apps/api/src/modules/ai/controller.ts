/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Body, Controller, Post } from '@nestjs/common';
import { AiService } from './service';
import type {
  AnalysisRequestDto,
  AnalysisResponseDto,
  GetPropertyInfoDto,
} from '@dtos';

@Controller('ai')
export class AiController {
  constructor(private readonly ai: AiService) {}

  @Post('analysis')
  async analysis(
    @Body() body: AnalysisRequestDto,
  ): Promise<AnalysisResponseDto> {
    return this.ai.analysis(body); // delegate everything
  }

  @Post('property-info')
  // controller.ts
  async getPropertyInfo(@Body() body: GetPropertyInfoDto) {
    const u = new URL(body.url); // throws if invalid
    return this.ai.getPropertyInfo(u.toString());
  }
}
