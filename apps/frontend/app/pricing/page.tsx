"use client";

import React, { useState } from 'react';
import MainLayout from '@components/Layout/MainLayout';
import { Button } from '@components/ui/button';
import { Check } from 'lucide-react';
import Link from "next/link";
import { Switch } from '@components/ui/switch';

const PricingPage = () => {
  const [billingAnnual, setBillingAnnual] = useState(false);
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);
  
  // Pricing calculation based on billing cycle
  const getPrice = (monthly: number) => {
    if (billingAnnual) {
      const annualPrice = monthly * 10; // 2 months free
      return `£${annualPrice.toFixed(2)}`;
    }
    return `£${monthly.toFixed(2)}`;
  };

  const getPeriod = () => billingAnnual ? '/ year' : '/ month';

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto py-12 px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Transparent Pricing</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Choose the plan that fits your investment needs
          </p>
          
          <div className="flex items-center justify-center mt-8 mb-12">
            <span className={`mr-3 ${!billingAnnual ? 'font-semibold' : 'text-gray-500 dark:text-gray-400'}`}>Monthly</span>
            <Switch 
              checked={billingAnnual}
              onCheckedChange={setBillingAnnual}
              aria-label="Toggle billing cycle"
            />
            <span className={`ml-3 ${billingAnnual ? 'font-semibold' : 'text-gray-500 dark:text-gray-400'}`}>
              Annual <span className="text-sm text-green-600 dark:text-green-400">(Save 17%)</span>
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Basic Plan */}
          <div 
            className={`bg-white dark:bg-gray-800 rounded-xl overflow-hidden transition-all duration-200
              ${hoveredPlan === 'basic' ? 'shadow-lg border-2 border-propalytiq-blue transform -translate-y-1' : 'border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg'}`}
            onMouseEnter={() => setHoveredPlan('basic')}
            onMouseLeave={() => setHoveredPlan(null)}
          >
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Basic</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold">{getPrice(9.99)}</span>
                <span className="text-gray-600 dark:text-gray-400 ml-2">{getPeriod()}</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Perfect for beginner property investors</p>
              
              <div className="py-4 px-6 bg-gray-50 dark:bg-gray-700 rounded-lg mb-6">
                <p className="text-sm font-medium text-center">Includes 1 free comprehensive report</p>
              </div>
              
              <ul className="space-y-3 mb-8">
                <PricingFeature>10 property analyses per month</PricingFeature>
                <PricingFeature>Basic investment metrics</PricingFeature>
                <PricingFeature>Standard report export</PricingFeature>
                <PricingFeature>Email support</PricingFeature>
                <PricingFeatureDisabled>Advanced ROI calculations</PricingFeatureDisabled>
                <PricingFeatureDisabled>Area market analysis</PricingFeatureDisabled>
              </ul>
              
              <Button asChild className="w-full">
                <Link href="/analysis">Start Free Trial</Link>
              </Button>
            </div>
          </div>
          
          {/* Pro Plan */}
          <div 
            className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 ${hoveredPlan === 'pro' ? 'border-propalytiq-blue transform -translate-y-1' : 'border-propalytiq-blue'} overflow-hidden relative transition-all duration-200`}
            onMouseEnter={() => setHoveredPlan('pro')}
            onMouseLeave={() => setHoveredPlan(null)}
          >
            <div className="absolute top-0 right-0 bg-propalytiq-blue text-white px-4 py-1 text-sm font-medium">
              POPULAR
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Pro</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold">{getPrice(29.99)}</span>
                <span className="text-gray-600 dark:text-gray-400 ml-2">{getPeriod()}</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">For active property investors</p>
              
              <div className="py-4 px-6 bg-gray-50 dark:bg-gray-700 rounded-lg mb-6">
                <p className="text-sm font-medium text-center">Includes 2 free comprehensive reports</p>
              </div>
              
              <ul className="space-y-3 mb-8">
                <PricingFeature>Unlimited property analyses</PricingFeature>
                <PricingFeature>Advanced investment metrics</PricingFeature>
                <PricingFeature>PDF & Excel report exports</PricingFeature>
                <PricingFeature>Area comparable analysis</PricingFeature>
                <PricingFeature>Priority email support</PricingFeature>
                <PricingFeatureDisabled>Portfolio optimisation</PricingFeatureDisabled>
              </ul>
              
              <Button asChild className="w-full">
                <Link href="/analysis">Start Free Trial</Link>
              </Button>
            </div>
          </div>
          
          {/* Enterprise Plan */}
          <div 
            className={`bg-white dark:bg-gray-800 rounded-xl overflow-hidden transition-all duration-200
              ${hoveredPlan === 'enterprise' ? 'shadow-lg border-2 border-propalytiq-blue transform -translate-y-1' : 'border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg'}`}
            onMouseEnter={() => setHoveredPlan('enterprise')}
            onMouseLeave={() => setHoveredPlan(null)}
          >
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Enterprise</h3>
              <div className="mb-4">
                <span className="text-2xl font-bold">Custom Pricing</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">For property investment firms</p>
              
              <div className="py-4 px-6 bg-gray-50 dark:bg-gray-700 rounded-lg mb-6">
                <p className="text-sm font-medium text-center">Custom tailored package</p>
              </div>
              
              <ul className="space-y-3 mb-8">
                <PricingFeature>Everything in Pro</PricingFeature>
                <PricingFeature>Team member access</PricingFeature>
                <PricingFeature>Advanced portfolio analytics</PricingFeature>
                <PricingFeature>API access</PricingFeature>
                <PricingFeature>Custom data integration</PricingFeature>
                <PricingFeature>Dedicated account manager</PricingFeature>
              </ul>
              
              <Button asChild variant="outline" className="w-full">
                <Link href="/contact">Contact Sales</Link>
              </Button>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
            
            <div className="grid md:grid-cols-2 gap-8 text-left mt-8">
              <div>
                <h3 className="font-semibold mb-2">Can I cancel my subscription?</h3>
                <p className="text-gray-600 dark:text-gray-400">Yes, you can cancel your subscription at any time with no cancellation fees.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">How accurate are the property analyses?</h3>
                <p className="text-gray-600 dark:text-gray-400">Our AI models are trained on extensive property data and provide estimates with typical accuracy within 5-10% of real-world outcomes.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Do you offer refunds?</h3>
                <p className="text-gray-600 dark:text-gray-400">We offer a 14-day money-back guarantee if you're not satisfied with our service.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
                <p className="text-gray-600 dark:text-gray-400">We accept all major credit cards, PayPal, and direct bank transfers for annual plans.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

const PricingFeature = ({ children }: { children: React.ReactNode }) => (
  <li className="flex items-center">
    <Check className="h-5 w-5 mr-2 text-propalytiq-blue flex-shrink-0" />
    <span className="text-gray-800 dark:text-gray-200">{children}</span>
  </li>
);

const PricingFeatureDisabled = ({ children }: { children: React.ReactNode }) => (
  <li className="flex items-center opacity-50">
    <Check className="h-5 w-5 mr-2 text-gray-400 flex-shrink-0" />
    <span className="text-gray-500 dark:text-gray-400 line-through">{children}</span>
  </li>
);

export default PricingPage;
