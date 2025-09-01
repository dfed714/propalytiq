// app/page.tsx
import MainLayout from "@components/layout/MainLayout";
import { getSessionOrNull } from "@/lib/auth";
import { getAccount } from "@/lib/api/account";
import HomeClient from "./home/HomeClient";

export default async function HomePage() {
  const { session } = await getSessionOrNull();
  const account = session ? await getAccount() : null;

  return (
    <MainLayout
      isAuthenticated={!!session}
      firstName={account?.user.firstName ?? undefined}
    >
      <HomeClient />
    </MainLayout>
  );
}
