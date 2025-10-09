export type DashboardMetrics = {
  total_reports: number;
  average_roi: number;
  reports_this_month: number;
  current_subscription_month: number | null;
  subscription_status: string;
  reports_allowed_per_month: number;
  next_billing_date: Date | null;
  is_cancelled: boolean;
};
