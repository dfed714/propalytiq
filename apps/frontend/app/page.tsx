import React from 'react';
import MainLayout from '@components/Layout/MainLayout';
import HeroSection from '@components/Home/HeroSection';
import ProcessSection from '@components/Home/ProcessSection';
import TestimonialSection from '@components/Home/TestimonialSection';
import CTASection from '@components/Home/CTASection';
import './globals.css';

const Index = () => {
  return (
    <MainLayout>
      <HeroSection />
      <ProcessSection />
      <TestimonialSection />
      <CTASection />
    </MainLayout>
  );
};

export default Index;
