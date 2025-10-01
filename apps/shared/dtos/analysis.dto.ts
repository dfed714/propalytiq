export type Strategy =
  | "Buy-Refurbish-Refinance"
  | "Buy-To-Let"
  | "Serviced Accommodation"
  | "Flips"
  | "HMO"
  | "Rent-To-Rent";

export interface AnalysisRequestDto {
  property_address?: string | null;
  purchase_price?: number | null;
  rental_price_per_month?: number | null;
  number_of_bedrooms?: number | null;
  number_of_bathrooms?: number | null;
  property_type?: string | null;
  property_description?: string | null;
  investment_strategy?: string;
  renovation_budget?: number | null;
  expected_monthly_rental?: number | null;
  mortgage_interest_rate?: number | null;
  investment_goal?: string | null;
}

export interface AnalysisResponseDto {
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
}
