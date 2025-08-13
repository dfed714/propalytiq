import { SignUp } from '@clerk/nextjs';
import MainLayout from '@components/Layout/MainLayout';

export default function SignInPage() {
  return (
    <MainLayout>
      <div className="container py-16">
        <div className="max-w-md mx-auto">
            <SignUp/>
        </div>
      </div>
    </MainLayout>
  );
}
