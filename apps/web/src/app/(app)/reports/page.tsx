import { redirect } from "next/navigation";
import MainLayout from "@components/layout/MainLayout";
import { getAuth } from "@/lib/auth";
import ReportsTable from "./ReportsTable";
import { serverApiJson } from "lib/server-api";
import { getAccount } from "lib/api/account";
import type { ReportList } from "@dtos";
import { getAllReports } from "@lib/api/report";
import { off } from "process";

export default async function ReportsPage() {
  const { user } = await getAuth();
  if (!user) redirect("/login");
  const account = user ? await getAccount() : null;

  // Server Action: can be passed to client components
  async function fetchAllReports(offset = 0, limit = 8) {
    "use server";
    if (user == null) redirect("/login");
    // You can add auth/tenant checks here if needed
    const data = await getAllReports(user?.id, offset, limit);
    return data; // must be serializable
  }

  return (
    <MainLayout
      isAuthenticated={!!user}
      firstName={account?.user.first_name ?? undefined}
    >
      <ReportsTable fetchAllReports={fetchAllReports} />
    </MainLayout>
  );
}
