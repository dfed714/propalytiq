import { redirect } from "next/navigation";
import MainLayout from "@components/layout/MainLayout";
import { getAuth } from "@/lib/auth";
import { getAccount } from "@lib/api/account";
import ResultsClient from "./ResultsClient";

export default async function ResultsPage() {
  const { user } = await getAuth();
  if (!user) redirect("/login");
  const account = user ? await getAccount() : null;

  return (
    <MainLayout
      isAuthenticated={!!user}
      firstName={account?.user.first_name ?? undefined}
    >
      <ResultsClient />
    </MainLayout>
  );
}
