import { redirect } from "next/navigation";
import MainLayout from "@components/layout/MainLayout";
import { getAuth } from "@/lib/auth";
import { getAccount } from "@lib/api/account";
import AnalysisClient from "./AnalysisClient";
import { getPropertyInfo } from "@/lib/api/ai";
import { GetPropertyInfoDto } from "@dtos";

export default async function AnalysisPage() {
  const { user } = await getAuth();
  if (!user) redirect("/login");
  const account = user ? await getAccount() : null;

  // Server Action: can be passed to client components
  async function fetchPropertyInfo(url: GetPropertyInfoDto) {
    "use server";
    // You can add auth/tenant checks here if needed
    const data = await getPropertyInfo(url);
    return data; // must be serializable
  }

  return (
    <MainLayout
      isAuthenticated={!!user}
      firstName={account?.user.firstName ?? undefined}
    >
      <AnalysisClient fetchPropertyInfo={fetchPropertyInfo} />
    </MainLayout>
  );
}
