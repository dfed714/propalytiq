// lib/api/account.ts
import { serverApiJson } from "@lib/server-api";

export type EmailPreferences = {
  reports: boolean;
  marketUpdates: boolean;
  productUpdates: boolean;
  securityUpdates: boolean;
};

export type AccountResponse = {
  user: {
    userId: string;
    firstName: string;
    lastName: string;
    accountCreatedAt: string; // ISO
  };
  // emailPreferences: EmailPreferences; // <-- new
  // subscription: {
  //   stripeSubscriptionId: string | null;
  //   stripeCustomerId: string | null;
  //   status: string | null;
  //   plan: string | null;
  //   currentPeriodEnd: string | null; // ISO
  //   createdAt: string | null; // ISO
  //   reportsAllowed: number | null;
  //   reportsUsed: number | null;
  // };
};

export async function getAccount() {
  return serverApiJson<AccountResponse>("/account");
}
