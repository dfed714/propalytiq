// apps/backend/src/modules/account/repository.ts
import { pool } from '@db';

export type AccountRow = {
  user_id: string;
  first_name: string;
  last_name: string;
  account_created_at: Date;

  // email prefs (booleans)
  // email_reports: boolean;
  // email_market_updates: boolean;
  // email_product_updates: boolean;
  // email_security_updates: boolean;

  // from latest subscription row
  // stripe_subscription_id: string | null;
  // stripe_customer_id: string | null;
  // status: string | null;
  // plan: string | null;
  // current_period_end: Date | null;
  // subscription_created_at: Date | null;

  // aggregated
  // reports_allowed: number | null;
  // reports_used: number | null;
};

export async function getAccountRow(
  userId: string,
): Promise<AccountRow | null> {
  const sql = `
    SELECT * 
    FROM profiles
    WHERE id = $1
  `;

  const { rows } = await pool.query<AccountRow>(sql, [userId]);
  return rows[0] ?? null;
}

export async function updateEmailPrefs(
  userId: string,
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
    userId,
    prefs.email_reports ?? null,
    prefs.email_market_updates ?? null,
    prefs.email_product_updates ?? null,
    prefs.email_security_updates ?? null,
  ]);
}

export async function updateProfileRow(
  userId: string,
  fields: { firstName?: string; lastName?: string },
) {
  const sql = `
    UPDATE public.profiles
       SET first_name = COALESCE($2, first_name),
           last_name  = COALESCE($3, last_name)
     WHERE user_id = $1
  `;
  await pool.query(sql, [
    userId,
    fields.firstName ?? null,
    fields.lastName ?? null,
  ]);
}
