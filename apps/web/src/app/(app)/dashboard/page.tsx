// app/(app)/dashboard/page.tsx
import { redirect } from "next/navigation";
import MainLayout from "@components/layout/MainLayout";
import { getAuth } from "@/lib/auth";
import { serverApiJson } from "lib/server-api";
import { getAccount, getMetrics } from "lib/api/account";
import DashboardTable from "./DashboardTable";
import { getAllReports } from "@lib/api/report";

export default async function DashboardPage() {
  const { user } = await getAuth();
  if (!user) redirect("/login");
  const account = user ? await getAccount() : null;

  if (!account) {
    // This should not happen if user is authenticated, but just in case
    redirect("/login");
  }

  // Server Action: can be passed to client components
  async function fetchMetrics(offset = 0, limit = 8) {
    "use server";
    if (user == null) redirect("/login");
    // You can add auth/tenant checks here if needed
    const data = await getMetrics();
    return data; // must be serializable
  }

  async function fetchReports(offset = 0, limit = 8) {
    "use server";
    if (user == null) redirect("/login");
    // You can add auth/tenant checks here if needed
    const data = await getAllReports(user?.id, offset, 3);
    return data; // must be serializable
  }

  const firstName = account.user.first_name;

  return (
    <MainLayout isAuthenticated={!!user} firstName={firstName}>
      <DashboardTable
        firstName={firstName}
        fetchMetrics={fetchMetrics}
        fetchReports={fetchReports}
      />
    </MainLayout>
  );
}
