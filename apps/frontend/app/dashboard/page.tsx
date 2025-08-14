// apps/frontend/app/dashboard/page.tsx
import DashboardClient from "./DashboardClient";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const API = process.env.API_URL ?? "http://localhost:4000";
const PREFIX = process.env.API_PREFIX ?? ""; // "/api" if you set a global prefix in Nest

export default async function DashboardPage() {
  // In your Clerk version, auth() returns a Promise — so await it:
  const { userId, getToken } = await auth();
  if (!userId) redirect("/");

  // Mint a short-lived backend JWT (audience must match your Clerk template)
  const token = await getToken({ template: "backend" });

  console.log(token);

  const dashboardRes = await fetch(`${API}${PREFIX}/dashboard`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    cache: "no-store",
  });

  if (!dashboardRes.ok) {
    const text = await dashboardRes.text();
    console.error("Backend error:", dashboardRes.status, text);
    throw new Error(`Backend failed: ${dashboardRes.status}`);
  }

  const dashboard = await dashboardRes.json();

  return (
    <DashboardClient
      first_name={dashboard.first_name}
      currentMonth={dashboard.currentMonth}
      averageRoi={dashboard.averageRoi}
      reportsAllowed={dashboard.subscription.reportsAllowed}
      reportsUsed={dashboard.subscription.reportsUsed}
      recentReports={dashboard.recentReports}
      currentPeriodEnd={dashboard.subscription.currentPeriodEnd}
      plan={dashboard.subscription.plan}
    />
  );
}
