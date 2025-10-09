// lib/api/account.ts
import { serverApiJson } from "@lib/server-api";
import { AccountResponse, DashboardMetrics } from "@dtos";

export async function getAccount() {
  return serverApiJson<AccountResponse>("/account");
}

export async function getMetrics() {
  return serverApiJson<DashboardMetrics>("/account/metrics");
}
