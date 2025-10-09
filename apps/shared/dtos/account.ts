export type User = {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  created_at: string; // ISO
};

export type EmailPreferences = {
  email_reports: boolean;
  email_market_updates: boolean;
  email_product_updates: boolean;
  email_security_updates: boolean;
};

export type Subscription = {
  // stripe_subscription_id: string | null;
  // stripe_customer_id: string | null;
  subscription_status: string;
  current_subscription_month: number | null;
  // plan: string | null;
  updated_at: Date | null;
  current_period_end: Date | null;
  subscription_created_at: Date | null;
};

export type AccountResponse = {
  user: User;
  email_preferences: EmailPreferences; // <-- new
  subscription: Subscription;
};
