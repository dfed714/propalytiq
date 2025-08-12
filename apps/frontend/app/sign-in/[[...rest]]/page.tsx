'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SignIn, useUser } from '@clerk/nextjs';
import MainLayout from '@components/Layout/MainLayout';

export default function SignInPage() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();

  const fallbackRedirectUrl = searchParams.get('fallbackRedirectUrl') || '/dashboard';

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace(fallbackRedirectUrl);
    }
  }, [isLoaded, isSignedIn, fallbackRedirectUrl, router]);

  return (
    <MainLayout>
      <div className="container py-16">
        <div className="max-w-md mx-auto">
            <SignIn path="/sign-in" routing="path" fallbackRedirectUrl={fallbackRedirectUrl} />
        </div>
      </div>
    </MainLayout>
  );
}
