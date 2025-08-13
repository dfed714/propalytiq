'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@components/Layout/MainLayout';
import ProcessingAnimation from '@components/Analysis/ProcessingAnimation';

const ProcessingPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Simulate processing time
    const timer = setTimeout(() => {
      router.push('/results');
    }, 8000); // 8 seconds processing time
    
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto py-12 px-6">
        <ProcessingAnimation />
      </div>
    </MainLayout>
  );
};

export default ProcessingPage;
