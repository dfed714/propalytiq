import MainLayout from "@components/layout/MainLayout";
import { getAuth } from "@lib/auth";
import { getAccount } from "@lib/api/account";
import AboutClient from "./AboutClient";

export default async function HowItWorksPage() {
  const { user } = await getAuth(); // verified user
  const account = user ? await getAccount() : null;

  return (
    <MainLayout
      isAuthenticated={!!user}
      firstName={account?.user.first_name ?? undefined}
    >
      <AboutClient />
    </MainLayout>
  );
}
