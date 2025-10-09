// apps/frontend/app/page.tsx
import MainLayout from "@components/layout/MainLayout";
import { getAuth } from "@lib/auth";
import { getAccount } from "lib/api/account";
import LegalClient from "./LegalClient";

export default async function LegalPage() {
  const { user } = await getAuth(); // verified user
  const account = user ? await getAccount() : null;

  return (
    <MainLayout
      isAuthenticated={!!user}
      firstName={account?.user.first_name ?? undefined}
    >
      <LegalClient />
    </MainLayout>
  );
}
