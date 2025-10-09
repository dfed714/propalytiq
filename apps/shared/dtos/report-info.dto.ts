// report-info.dto.ts

export type Property = {
  price: string;
  address: string;
  bedrooms: number;
  bathrooms: number;
  price_type: string;
  description: string;
  rent_period: string;
  property_type: string;
  investment_goal?: string | null;
  renovation_budget?: string | null;
  investment_strategy: string;
  mortgage_interest_rate?: string | null;
  expected_monthly_rental?: string | null;
};

export interface Analysis {
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  investment_strategy: string;
  top_stats: Record<string, number>;
  projection: {
    points: { x: number | string; y: number }[];
    x_label: string;
    y_label: string;
    overlay?: { label: string; values: number[] };
  };
}

export interface ReportInfoDto {
  property_address: string;
  strategy: string;
  roi: number;
  property: Property;
  analysis: Analysis;
  created_at: Date;
}

export type ReportList = ReportInfoDto[];
