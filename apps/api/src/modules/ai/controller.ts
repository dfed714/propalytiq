import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { AiService } from './service';
import type { AnalysisRequestDto, AnalysisResponse } from './dtos/analysis.dto';
import { GetPropertyInfoDto } from './dtos/property-info.dto';

@Controller('ai')
export class AiController {
  constructor(private readonly ai: AiService) {}

  @Post('analysis')
  analysis(@Body() body: AnalysisRequestDto): AnalysisResponse {
    if (!body?.strategy) {
      throw new BadRequestException('strategy is required');
    }

    // Business rule preserved from your original code:
    // Rent-To-Rent is locked if a rental_price_per_month was provided.
    if (
      body.strategy === 'Rent-To-Rent' &&
      body.rental_price_per_month !== null
    ) {
      throw new BadRequestException(
        'Rent-To-Rent is locked if rental price was selected.',
      );
    }

    switch (body.strategy) {
      case 'Buy-To-Let':
        return {
          strategy: 'Buy-to-Let',
          top_stats: {
            'ROI (%)': null,
            'Rental Yield (%)': null,
            'Monthly Income (£)': null,
            'Monthly Cashflow (£)': null,
          },
          projection: {
            x_label: 'Years (1–25)',
            y_label: 'Net Cashflow (£)',
            points: [],
          },
          strengths: [],
          weaknesses: [],
        };

      case 'Serviced Accommodation':
        return {
          strategy: 'Serviced Accommodation / Holiday Let',
          top_stats: {
            'Average Nightly Rate (£)': null,
            'Occupancy Rate (%)': null,
            'Monthly Gross Income (£)': null,
            'Monthly Net Cashflow (£)': null,
          },
          projection: {
            x_label: 'Months (1–12)',
            y_label: 'Monthly Net Cashflow (£)',
            points: [],
          },
          strengths: [],
          weaknesses: [],
        };

      case 'Buy-Refurbish-Refinance':
        return {
          strategy: 'Buy-Refurbish-Refinance (BRRR)',
          top_stats: {
            'Initial Investment (£)': null,
            'Refinance Value (£)': null,
            'Cash Pulled Out (%)': null,
            'Post-Refi ROI (%)': null,
          },
          projection: {
            x_label: 'Stages (Purchase → Renovation → Refinance → Rent)',
            y_label: 'Net Cash Invested (£)',
            points: [],
          },
          strengths: [],
          weaknesses: [],
        };

      case 'Flips':
      case 'Flip':
        return {
          strategy: 'Flip (Buy-to-Sell)',
          top_stats: {
            'Purchase Price (£)': null,
            'Renovation Cost (£)': null,
            'Projected Sale Price (£)': null,
            'Profit Margin (%)': null,
          },
          projection: {
            x_label: 'Timeline (Month 0 → Sale Month)',
            y_label: 'Costs vs Expected Sale Price (£)',
            points: [],
          },
          strengths: [],
          weaknesses: [],
        };

      case 'HMO':
        return {
          strategy: 'HMO (House in Multiple Occupation)',
          top_stats: {
            'Total Monthly Income (£)': null,
            'Net Monthly Cashflow (£)': null,
            'Occupancy Rate (%)': null,
            'ROI (%)': null,
          },
          projection: {
            x_label: 'Months (1–12)',
            y_label: 'Monthly Net Cashflow (£)',
            points: [],
          },
          strengths: [],
          weaknesses: [],
        };

      case 'Rent-To-Rent':
        return {
          strategy: 'Rent-to-Rent (Airbnb / Commercial Lease Model)',
          top_stats: {
            'Lease Cost (£ / month)': null,
            'Average Monthly Income (£)': null,
            'Occupancy Rate (%)': null,
            'Monthly Profit (£)': null,
          },
          projection: {
            x_label: 'Months (1–12)',
            y_label: 'Monthly Net Profit (£)',
            points: [],
          },
          strengths: [],
          weaknesses: [],
        };

      default:
        throw new BadRequestException('Unsupported strategy');
    }
  }

  @Post('property-info')
  async getPropertyInfo(@Body() body: GetPropertyInfoDto) {
    // Basic url normalization / safety
    const url = body.url?.trim();
    if (!url) throw new BadRequestException('url is required');
    if (!/^https?:\/\//i.test(url)) {
      throw new BadRequestException('url must start with http:// or https://');
    }

    const prompt = `Look at this page: ${url},
and return the following details in JSON format:
  - Property Address
  - Purchase Price 
  - Rental Price Per Month 
  - Number of Bedrooms 
  - Number of Bathrooms 
  - Square Footage 
  - Property Type (e.g., Semi-Detached House, Bungalow, etc.) 
  - Property Description (generate a new one)
`;
    const model = process.env.OPENAI_MODEL_FAST || 'gpt-4.1-mini';
    return this.ai.getPropertyInfo(prompt, model);
  }
}
