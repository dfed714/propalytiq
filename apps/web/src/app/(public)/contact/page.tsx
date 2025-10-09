import MainLayout from "@components/layout/MainLayout";
import { getAuth } from "@lib/auth";
import { getAccount } from "@lib/api/account";
import ContactForm from "./ContactForm";

export default async function HowItWorksPage() {
  const { user } = await getAuth(); // verified user
  const account = user ? await getAccount() : null;

  return (
    <MainLayout
      isAuthenticated={!!user}
      firstName={account?.user.first_name ?? undefined}
    >
      <ContactForm />
    </MainLayout>
  );
}
