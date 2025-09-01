"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function ProcessSection() {
  const steps = [
    {
      number: "01",
      title: "Paste a property link or fill in details",
      description:
        "Simply paste a Rightmove or Zoopla link, or manually enter property details to begin your analysis.",
    },
    {
      number: "02",
      title: "Select your investment strategy",
      description:
        "Choose from Buy-to-Let, Buy-Refurbish-Refinance (BRR), Serviced Accommodation, or HMO strategies.",
    },
    {
      number: "03",
      title: "Receive smart analysis and insights",
      description:
        "Get comprehensive investment breakdowns with ROI projections, risk assessment, and tailored recommendations.",
    },
  ];

  return (
    <section className="py-16 px-6 sm:px-8 lg:px-12 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">How Propalytiq Works</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get actionable investment insights in three simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative p-8 rounded-xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md"
            >
              <span className="absolute -top-5 left-8 bg-propalytiq-blue text-white text-lg font-bold px-4 py-2 rounded-lg">
                {step.number}
              </span>
              <h3 className="text-xl font-semibold mt-6 mb-4">
                {step.title}
              </h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/analysis"
            className="inline-flex items-center text-propalytiq-blue hover:text-propalytiq-teal font-medium"
          >
            Start your property analysis now <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
