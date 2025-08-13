import { SignIn } from "@clerk/nextjs";
import MainLayout from "@components/Layout/MainLayout";

export default function SignInPage() {
  return (
    <MainLayout>
      <div className="container py-16">
        <div className="max-w-md mx-auto">
          <SignIn
            appearance={{
              layout: {
                logoImageUrl: "/images/proplytiq-logo.png",
                logoLinkUrl: "/home",
                socialButtonsPlacement: "bottom",
              },
            }}
            signUpUrl="/sign-up"
          />
        </div>
      </div>
    </MainLayout>
  );
}
