// apps/frontend/app/page.tsx
import MainLayout from "@components/layout/MainLayout";
import { getAuth } from "@lib/auth";
import { getAccount } from "lib/api/account";
import PrivacyClient from "./PrivacyClient";

export default async function PrivacyPage() {
  const { user } = await getAuth(); // verified user
  const account = user ? await getAccount() : null;

  return (
    <MainLayout
      isAuthenticated={!!user}
      firstName={account?.user.first_name ?? undefined}
    >
      <PrivacyClient />
    </MainLayout>
  );
}
