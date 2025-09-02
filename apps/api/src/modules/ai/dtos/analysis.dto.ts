/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export type Strategy =
  | 'Buy-Refurbish-Refinance'
  | 'Buy-To-Let'
  | 'Serviced Accommodation'
  | 'Flips'
  | 'Flip'
  | 'HMO'
  | 'Rent-To-Rent';

export class AnalysisRequestDto {
  @IsString()
  @IsOptional()
  property_address: string | null;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  purchase_price: number | null;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  rental_price_per_month: number | null;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  number_of_bedrooms: number | null;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  number_of_bathrooms: number | null;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  square_footage: number | null;

  @IsString()
  @IsOptional()
  property_type: string | null;

  @IsString()
  @IsOptional()
  property_description: string | null;

  @IsIn([
    'Buy-Refurbish-Refinance',
    'Buy-To-Let',
    'Serviced Accommodation',
    'Flips',
    'Flip',
    'HMO',
    'Rent-To-Rent',
  ])
  strategy: Strategy;

  @IsOptional()
  additional?: {
    budget?: number | null;
    desired_monthly_income?: number | null;
    mortgage_interest_rate?: number | null;
    primary_investment_goal?: string | null;
  };
}

export type AnalysisResponse = {
  strategy: string;
  top_stats: Record<string, number | null>;
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
};
