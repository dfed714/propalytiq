"use client";

import React from "react";
import { Button } from "@components/ui/button";
import Link from "next/link";
import { Users, Target, Award } from "lucide-react";

export default function AboutClient() {
  return (
    <div className="max-w-7xl mx-auto py-12 px-6">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-6">About Propalytiq</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          We're transforming property investment with AI-powered analytics
        </p>
      </div>

      {/* Graphics Section */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <FeatureCard
          icon={<Users className="h-8 w-8 text-white" />}
          title="Expert Team"
          description="Property professionals with decades of combined experience"
        />
        <FeatureCard
          icon={<Target className="h-8 w-8 text-white" />}
          title="Precision Analysis"
          description="Advanced algorithms for accurate investment insights"
        />
        <FeatureCard
          icon={<Award className="h-8 w-8 text-white" />}
          title="Trusted Results"
          description="Reliable data you can depend on for major decisions"
        />
      </div>

      {/* Mission Section */}
      <div className="mb-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg text-gray-700 mb-4">
              At Propalytiq, our mission is to democratise property investment
              by making sophisticated analytics accessible to everyone.
            </p>
            <p className="text-lg text-gray-700 mb-6">
              We believe that data-driven decisions should not be limited to
              large property firms with extensive resources. Our AI-powered
              platform delivers institutional-grade analysis for individual
              investors, allowing anyone to make smarter property decisions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg">
                <Link href="/how-it-works">Learn How It Works</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/contact">Contact Our Team</Link>
              </Button>
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-8 h-80 flex items-center justify-center">
            <div className="text-center">
              <span className="propalytiq-gradient text-5xl font-bold">
                Propalytiq
              </span>
              <p className="mt-4 text-gray-600">
                Property Intelligence, Reimagined
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold mb-6 text-center">Our Story</h2>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <p className="text-lg text-gray-700 mb-6">
            Propalytiq was founded in 2023 by a team of property experts and
            technology professionals who saw first-hand how existing investment
            analysis tools were either too complex, too expensive, or too basic
            for most investors.
          </p>
          <p className="text-lg text-gray-700 mb-6">
            After struggling with spreadsheets and basic calculators that
            couldn't capture the nuance of complex investment strategies, our
            founders set out to build something better — a platform that
            combines the power of artificial intelligence with property
            expertise.
          </p>
          <p className="text-lg text-gray-700">
            Today, Propalytiq is helping thousands of investors make more
            informed decisions by providing comprehensive investment analysis in
            seconds, not hours.
          </p>
        </div>
      </div>

      {/* Team Section */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Our Leadership Team
        </h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <TeamMember
            name="Sammy Walker"
            title="Co-founder & Property Expert"
            bio="Extensive experience in commercial property management and sales, bringing deep market knowledge and investment expertise to our platform."
          />
          <TeamMember
            name="Moshe Borr"
            title="Co-founder & Hospitality Specialist"
            bio="Specialist in luxury serviced accommodation and Airbnb management for landlords, with proven expertise in maximising rental yields and property performance."
          />
        </div>
      </div>

      {/* Values Section */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold mb-8 text-center">Our Values</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ValueCard
            title="Accessibility"
            description="Making professional-grade investment analysis accessible to everyone, regardless of experience level or resources."
          />
          <ValueCard
            title="Transparency"
            description="Providing clear explanations for all recommendations and calculations, so you always understand the 'why' behind the numbers."
          />
          <ValueCard
            title="Innovation"
            description="Continuously improving our AI models and adding new features based on user feedback and market changes."
          />
          <ValueCard
            title="Accuracy"
            description="Committed to delivering reliable data and analysis you can trust when making important investment decisions."
          />
          <ValueCard
            title="Education"
            description="Helping users become better investors through insights, guidance, and educational resources."
          />
          <ValueCard
            title="User-Centricity"
            description="Designing every feature with our users' needs and goals as the top priority."
          />
        </div>
      </div>

      {/* CTA Section */}
      <div className="purple-gradient-bg text-white rounded-xl p-10 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Ready to start your property analysis?
        </h2>
        <p className="text-xl mb-8 max-w-xl mx-auto">
          Join thousands of investors who are making smarter property decisions
          with Propalytiq.
        </p>
        <Button
          asChild
          size="lg"
          variant="outline"
          className="bg-white text-purple-600 hover:bg-gray-100"
        >
          <Link href="/analysis">Start Your Analysis</Link>
        </Button>
      </div>
    </div>
  );
}

/* Reusable Components */
const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-purple-100">
    <div className="w-16 h-16 purple-gradient-bg rounded-full flex items-center justify-center mx-auto mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const TeamMember = ({
  name,
  title,
  bio,
}: {
  name: string;
  title: string;
  bio: string;
}) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col items-center text-center">
    <div className="w-24 h-24 purple-gradient-bg rounded-full mb-4 flex items-center justify-center">
      <span className="text-white text-2xl font-bold">
        {name
          .split(" ")
          .map((n) => n[0])
          .join("")}
      </span>
    </div>
    <h3 className="font-bold text-lg">{name}</h3>
    <p className="text-purple-600 font-medium mb-3">{title}</p>
    <p className="text-gray-600">{bio}</p>
  </div>
);

const ValueCard = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <h3 className="font-bold text-lg mb-3">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);
