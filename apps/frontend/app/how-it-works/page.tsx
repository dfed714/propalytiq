import React from "react";
import MainLayout from "@components/Layout/MainLayout";
import { Button } from "@components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

const HowItWorksPage = () => {
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto py-12 px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">How Propalytiq Works</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transforming property listings into smart investment insights
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20 items-center">
          <div>
            <h2 className="text-2xl font-bold mb-4">Powered by Advanced AI</h2>
            <p className="text-lg text-gray-700 mb-4">
              Propalytiq uses cutting-edge artificial intelligence to analyze
              property listings, market data, and investment strategies to
              provide you with personalized recommendations.
            </p>
            <p className="text-lg text-gray-700">
              Our technology evaluates thousands of data points to give you
              accurate insights into potential returns, risks, and opportunities
              for each property.
            </p>
          </div>
          <div className="rounded-xl overflow-hidden shadow-lg">
            <Image
              alt="AI property analysis"
              src="/images/laptop_01.jpeg"
              width={1200}
              height={400}
              className="w-full h-auto object-cover"
            />
          </div>
        </div>

        <div className="bg-gray-50 rounded-2xl p-8 md:p-12 mb-20">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Simple Three-Step Process
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-propalytiq-blue text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Input Property Details
              </h3>
              <p className="text-gray-600">
                Paste a property URL from Rightmove or Zoopla, or manually enter
                property details.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-propalytiq-blue text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Select Investment Strategy
              </h3>
              <p className="text-gray-600">
                Choose from Buy-to-Let, BRR, Serviced Accommodation or HMO
                strategies.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-propalytiq-blue text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Get Your Smart Report
              </h3>
              <p className="text-gray-600">
                Receive a comprehensive analysis with ROI projections,
                recommendations, and risk assessment.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 items-center">
          <div className="order-2 lg:order-1 rounded-xl overflow-hidden shadow-lg">
            <Image
              alt="AI property analysis"
              src="/images/laptop_02.jpeg"
              width={1200}
              height={400}
              className="w-full h-auto object-cover"
            />
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="text-2xl font-bold mb-4">
              Tailored Investment Strategies
            </h2>
            <p className="text-lg text-gray-700 mb-4">
              Every property has unique potential depending on your investment
              goals. Propalytiq evaluates each property for different
              strategies:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="mr-3 mt-1.5 bg-propalytiq-teal h-2 w-2 rounded-full"></div>
                <span>
                  <strong>Buy-to-Let</strong> - For stable monthly rental income
                </span>
              </li>
              <li className="flex items-start">
                <div className="mr-3 mt-1.5 bg-propalytiq-teal h-2 w-2 rounded-full"></div>
                <span>
                  <strong>Buy-Refurbish-Refinance</strong> - For maximizing
                  returns through strategic renovation
                </span>
              </li>
              <li className="flex items-start">
                <div className="mr-3 mt-1.5 bg-propalytiq-teal h-2 w-2 rounded-full"></div>
                <span>
                  <strong>Serviced Accommodation</strong> - For higher yields
                  through short-term rentals
                </span>
              </li>
              <li className="flex items-start">
                <div className="mr-3 mt-1.5 bg-propalytiq-teal h-2 w-2 rounded-full"></div>
                <span>
                  <strong>HMO</strong> - For maximizing income through multiple
                  occupancy
                </span>
              </li>
            </ul>
          </div>
        </div>

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
    </MainLayout>
  );
};

export default HowItWorksPage;
