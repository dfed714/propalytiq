/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, NotFoundException } from '@nestjs/common';
import {
  getAccountRow,
  getMetrics,
  updateEmailPrefs,
  updateProfileRow,
} from './repository';
import { DashboardMetrics } from '@dtos';

export type AccountResponse = {
  user: {
    user_id: string;
    first_name: string | null;
    last_name: string | null;
    email: string | null;
    account_created_at: Date;
  };
  email_preferences: {
    email_reports: boolean;
    email_market_updates: boolean;
    email_product_updates: boolean;
    email_security_updates: boolean;
  };
  subscription: {
    subscription_status: string | null;
    current_subscription_month: number | null;
    updated_at: Date | null;
    current_period_end: Date | null;
    subscription_created_at: Date | null;
    reports_allowed_per_month: number | null;
  };
};

@Injectable()
export class AccountService {
  async getForUser(user_id: string): Promise<AccountResponse> {
    const row = await getAccountRow(user_id);
    if (!row) throw new NotFoundException('User not found');

    return {
      user: {
        user_id: row.user_id,
        first_name: row.first_name,
        last_name: row.last_name,
        email: row.email,
        account_created_at: row.account_created_at,
      },
      email_preferences: {
        email_reports: row.email_reports,
        email_market_updates: row.email_market_updates,
        email_product_updates: row.email_product_updates,
        email_security_updates: row.email_security_updates,
      },
      subscription: {
        subscription_status: row.subscription_status,
        current_subscription_month: row.current_subscription_month,
        updated_at: row.updated_at,
        current_period_end: row.current_period_end,
        subscription_created_at: row.subscription_created_at,
        reports_allowed_per_month: row.reports_allowed_per_month,
      },
    };
  }

  async updateEmailPreferences(
    user_id: string,
    prefs: {
      email_reports?: boolean;
      email_market_updates?: boolean;
      email_product_updates?: boolean;
      email_security_updates?: boolean;
    },
  ) {
    await updateEmailPrefs(user_id, prefs);
    const fresh = await getAccountRow(user_id);
    if (!fresh) throw new NotFoundException('User not found');
    return { ok: true };
  }

  async updateProfile(
    user_id: string,
    body: {
      first_name: string;
      last_name: string;
    },
  ) {
    await updateProfileRow(user_id, body);
    const fresh = await getAccountRow(user_id);
    if (!fresh) throw new NotFoundException('User not found');
    return { ok: true };
  }

  async getMetrics(user_id: string): Promise<DashboardMetrics> {
    const row = await getMetrics(user_id);
    if (!row) throw new NotFoundException('User not found');

    return {
      total_reports: row.total_reports,
      average_roi: row.average_roi,
      reports_this_month: row.reports_this_month,
      current_subscription_month: row.current_subscription_month,
      subscription_status: row.subscription_status,
      reports_allowed_per_month: row.reports_allowed_per_month,
      next_billing_date: row.next_billing_date,
      is_cancelled: row.is_cancelled,
    };
  }
}
