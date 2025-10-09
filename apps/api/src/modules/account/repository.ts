/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
import { pool } from '@db';
import { DashboardMetrics } from '@dtos';

export type AccountRow = {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  account_created_at: Date;

  // email prefs (booleans)
  email_reports: boolean;
  email_market_updates: boolean;
  email_product_updates: boolean;
  email_security_updates: boolean;

  // from latest subscription row
  // stripe_subscription_id: string | null;
  // stripe_customer_id: string | null;
  subscription_status: string;
  current_subscription_month: number | null;
  // plan: string | null;
  updated_at: Date | null;
  current_period_end: Date | null;
  subscription_created_at: Date | null;

  // aggregated
  reports_allowed_per_month: number | null;
};

export async function getAccountRow(
  user_id: string,
): Promise<AccountRow | null> {
  const sql = `
    SELECT *
    FROM public.profiles AS p
    LEFT JOIN public.user_preferences AS up
      ON p.id = up.user_id
    WHERE p.id = $1;

  `;

  const { rows } = await pool.query<AccountRow>(sql, [user_id]);
  return rows[0] ?? null;
}

export async function updateEmailPrefs(
  user_id: string,
  prefs: {
    email_reports?: boolean;
    email_market_updates?: boolean;
    email_product_updates?: boolean;
    email_security_updates?: boolean;
  },
) {
  const sql = `
    UPDATE public.user_preferences
       SET email_reports          = COALESCE($2, email_reports),
           email_market_updates   = COALESCE($3, email_market_updates),
           email_product_updates  = COALESCE($4, email_product_updates),
           email_security_updates = COALESCE($5, email_security_updates)
     WHERE user_id = $1
  `;
  await pool.query(sql, [
    user_id,
    prefs.email_reports ?? null,
    prefs.email_market_updates ?? null,
    prefs.email_product_updates ?? null,
    prefs.email_security_updates ?? null,
  ]);
}

export async function updateProfileRow(
  user_id: string,
  body: { first_name: string; last_name: string },
) {
  const sql = `
    UPDATE public.profiles
       SET first_name = COALESCE($2, first_name),
           last_name  = COALESCE($3, last_name)
     WHERE id = $1
  `;
  await pool.query(sql, [
    user_id,
    body.first_name ?? null,
    body.last_name ?? null,
  ]);
}

export async function getMetrics(
  user_id: string,
): Promise<DashboardMetrics | null> {
  const sql = `
    SELECT *
    FROM public.user_metrics
    WHERE user_id = $1;
  `;

  try {
    const { rows } = await pool.query<DashboardMetrics>(sql, [user_id]);

    return rows[0] ?? null;
  } catch (error) {
    console.error('Error querying user_metrics:', error);
    return null;
  }
}
