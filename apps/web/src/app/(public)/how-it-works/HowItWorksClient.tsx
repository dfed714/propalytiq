"use client";

import { Button } from "@components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import React from "react";

export default function HowItWorksClient() {
  return (
    <div className="max-w-7xl mx-auto py-12 px-6">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">How Propalytiq Works</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Transforming property listings into smart investment insights
        </p>
      </div>

      {/* AI Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20 items-center">
        <div>
          <h2 className="text-2xl font-bold mb-4">Powered by Advanced AI</h2>
          <p className="text-lg text-gray-700 mb-4">
            Propalytiq uses cutting-edge artificial intelligence to analyze
            property listings, market data, and investment strategies to provide
            you with personalized recommendations.
          </p>
          <p className="text-lg text-gray-700">
            Our technology evaluates thousands of data points to give you
            accurate insights into potential returns, risks, and opportunities
            for each property.
          </p>
        </div>
        <div className="rounded-xl overflow-hidden shadow-lg">
          <img
            src="/images/laptop_01.jpeg"
            alt="AI property analysis"
            className="w-full h-auto object-cover"
          />
        </div>
      </div>

      {/* Steps Section */}
      <div className="bg-gray-50 rounded-2xl p-8 md:p-12 mb-20">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Simple Three-Step Process
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <StepCard
            number={1}
            title="Input Property Details"
            description="Paste a property URL from Rightmove or Zoopla, or manually enter property details."
          />
          <StepCard
            number={2}
            title="Select Investment Strategy"
            description="Choose from Buy-to-Let, BRR, Serviced Accommodation or HMO strategies."
          />
          <StepCard
            number={3}
            title="Get Your Smart Report"
            description="Receive a comprehensive analysis with ROI projections, recommendations, and risk assessment."
          />
        </div>
      </div>

      {/* Strategies Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 items-center">
        <div className="order-2 lg:order-1 rounded-xl overflow-hidden shadow-lg">
          <img
            src="/images/laptop_02.jpeg"
            alt="Investment strategy visualization"
            className="w-full h-auto object-cover"
          />
        </div>
        <div className="order-1 lg:order-2">
          <h2 className="text-2xl font-bold mb-4">
            Tailored Investment Strategies
          </h2>
          <p className="text-lg text-gray-700 mb-4">
            Every property has unique potential depending on your investment
            goals. Propalytiq evaluates each property for different strategies:
          </p>
          <ul className="space-y-3">
            <StrategyItem
              title="Buy-to-Let"
              description="For stable monthly rental income"
            />
            <StrategyItem
              title="Buy-Refurbish-Refinance"
              description="For maximizing returns through strategic renovation"
            />
            <StrategyItem
              title="Serviced Accommodation"
              description="For higher yields through short-term rentals"
            />
            <StrategyItem
              title="HMO"
              description="For maximizing income through multiple occupancy"
            />
          </ul>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-6">
          Ready to analyze your first property?
        </h2>
        <Button size="lg" asChild>
          <Link href="/analysis" className="flex items-center">
            Start Your Analysis <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

/* Reusable Components */
const StepCard = ({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: string;
}) => (
  <div className="flex flex-col items-center text-center">
    <div className="w-16 h-16 bg-propalytiq-blue text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
      {number}
    </div>
    <h3 className="text-xl font-semibold mb-3">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const StrategyItem = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <li className="flex items-start">
    <div className="mr-3 mt-1.5 bg-propalytiq-teal h-2 w-2 rounded-full"></div>
    <span>
      <strong>{title}</strong> - {description}
    </span>
  </li>
);
