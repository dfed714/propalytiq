'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SignIn, useUser } from '@clerk/nextjs';

export default function SignInPage() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Use fallbackRedirectUrl or forceRedirectUrl now instead of redirectUrl
  const fallbackRedirectUrl = searchParams.get('redirectUrl') || '/dashboard';

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace(fallbackRedirectUrl);
    }
  }, [isLoaded, isSignedIn, fallbackRedirectUrl, router]);

  return <SignIn path="/sign-in" routing="path" fallbackRedirectUrl={fallbackRedirectUrl} />;
}
