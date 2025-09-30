// dtos.ts
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export type Strategy =
  | 'Buy-Refurbish-Refinance'
  | 'Buy-To-Let'
  | 'Serviced Accommodation'
  | 'Flips'
  | 'HMO'
  | 'Rent-To-Rent';

export class AnalysisRequestDto {
  @IsString()
  @IsOptional()
  property_address?: string | null;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  purchase_price?: number | null;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  rental_price_per_month?: number | null;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  number_of_bedrooms?: number | null;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  number_of_bathrooms?: number | null;

  @IsString()
  @IsOptional()
  property_type?: string | null;

  @IsString()
  @IsOptional()
  property_description?: string | null;

  @IsString()
  @IsOptional()
  investment_strategy: string;

  @IsOptional()
  budget?: number | null;
  @IsOptional()
  desired_monthly_income?: number | null;
  @IsOptional()
  mortgage_interest_rate?: number | null;
  @IsOptional()
  primary_investment_goal?: string | null;
}

export type AnalysisResponse = {
  investment_strategy: string;
  top_stats: Record<string, number>;
  projection: {
    x_label: string;
    y_label: string;
    points: Array<{
      x: number | string;
      y?: number;
      costs?: number;
      expected_sale_price?: number;
    }>;
  };
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
};
