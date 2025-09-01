// apps/backend/src/modules/account/service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import {
  getAccountRow,
  updateEmailPrefs,
  updateProfileRow,
} from './repository';
import { UpdateProfileDto } from './dto/update-profile.dto';

export type AccountResponse = {
  user: {
    userId: string;
    firstName: string | null;
    lastName: string | null;
    accountCreatedAt: Date;
  };
  // emailPreferences: {
  //   reports: boolean;
  //   marketUpdates: boolean;
  //   productUpdates: boolean;
  //   securityUpdates: boolean;
  // };
  // subscription: {
  //   stripeSubscriptionId: string | null;
  //   stripeCustomerId: string | null;
  //   status: string | null;
  //   plan: string | null;
  //   currentPeriodEnd: Date | null;
  //   createdAt: Date | null;
  //   reportsAllowed: number | null;
  //   reportsUsed: number | null;
  // };
};

@Injectable()
export class AccountService {
  async getForUser(userId: string): Promise<AccountResponse> {
    const row = await getAccountRow(userId);
    if (!row) throw new NotFoundException('User not found');

    return {
      user: {
        userId: row.user_id,
        firstName: row.first_name,
        lastName: row.last_name,
        accountCreatedAt: row.account_created_at,
      },
      // emailPreferences: {
      //   reports: row.email_reports,
      //   marketUpdates: row.email_market_updates,
      //   productUpdates: row.email_product_updates,
      //   securityUpdates: row.email_security_updates,
      // },
      // subscription: {
      //   stripeSubscriptionId: row.stripe_subscription_id,
      //   stripeCustomerId: row.stripe_customer_id,
      //   status: row.status,
      //   plan: row.plan,
      //   currentPeriodEnd: row.current_period_end,
      //   createdAt: row.subscription_created_at,
      //   reportsAllowed: row.reports_allowed,
      //   reportsUsed: row.reports_used,
      // },
    };
  }

  async updateEmailPreferences(
    userId: string,
    prefs: {
      email_reports?: boolean;
      email_market_updates?: boolean;
      email_product_updates?: boolean;
      email_security_updates?: boolean;
    },
  ) {
    await updateEmailPrefs(userId, prefs);
    const fresh = await getAccountRow(userId);
    if (!fresh) throw new NotFoundException('User not found');
    return { ok: true };
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    await updateProfileRow(userId, {
      firstName: dto.firstName,
      lastName: dto.lastName,
    });
    const fresh = await getAccountRow(userId);
    if (!fresh) throw new NotFoundException('User not found');
    return { ok: true };
  }
}
