import { Body, Controller, Post } from '@nestjs/common';
import { AiService } from './service';

@Controller('ai')
export class AiController {
  constructor(private readonly ai: AiService) {}

  @Post('property-info')
  async getPropertyInfo(@Body() body: { url: string }) {
    const prompt = `Look at this page: ${body.url},
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
    const result = await this.ai.getPropertyInfo(prompt, model);
    return result;
  }
}
