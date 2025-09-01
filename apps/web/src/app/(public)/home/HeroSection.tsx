"use client";

import Link from "next/link";
import { Button } from "../../components/ui/button";
import {
  ArrowRight,
  TrendingUp,
  BarChart3,
  Calculator,
  CheckCircle,
  Star,
  Award,
} from "lucide-react";

export default function HeroSection() {
  return (
    <section className="px-6 py-16 sm:py-24 lg:py-32 bg-gradient-to-br from-white to-purple-50/30 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Trust Indicators */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 sm:space-x-6 text-xs text-gray-600">
            <div className="flex items-center space-x-1">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <span>1000+ investors</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="h-3 w-3 text-yellow-500" />
              <span>4.9/5 rating</span>
            </div>
            <div className="flex items-center space-x-1">
              <Award className="h-3 w-3 text-purple-500" />
              <span>Industry recognised</span>
            </div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6">
            Transform Property Listings Into{" "}
            <span className="propalytiq-gradient">
              Smart Investment Reports
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Our AI analyses property data to give you personalised investment
            insights, risk assessment, and profitability projections in seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              asChild
              className="purple-gradient-bg hover:opacity-90"
            >
              <Link href="/analysis" className="flex items-center">
                Start Analysis <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/how-it-works">Learn More</Link>
            </Button>
          </div>
        </div>

        {/* Feature Graphics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-purple-100 hover:shadow-xl transition-all duration-300">
            <div className="w-16 h-16 purple-gradient-bg rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Market Analysis</h3>
            <p className="text-gray-600">
              AI-powered market trends and comparative analysis
            </p>

            {/* Mini Chart Graphic */}
            <div className="mt-4 h-16 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg flex items-end justify-center space-x-1 p-2">
              <div
                className="w-2 bg-purple-400 rounded-t"
                style={{ height: "60%" }}
              ></div>
              <div
                className="w-2 bg-purple-500 rounded-t"
                style={{ height: "80%" }}
              ></div>
              <div
                className="w-2 bg-purple-600 rounded-t"
                style={{ height: "100%" }}
              ></div>
              <div
                className="w-2 bg-purple-500 rounded-t"
                style={{ height: "75%" }}
              ></div>
              <div
                className="w-2 bg-purple-400 rounded-t"
                style={{ height: "90%" }}
              ></div>
            </div>
          </div>

          <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-purple-100 hover:shadow-xl transition-all duration-300">
            <div className="w-16 h-16 purple-gradient-bg rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <BarChart3 className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Risk Assessment</h3>
            <p className="text-gray-600">
              Comprehensive risk evaluation and scoring
            </p>

            {/* Risk Meter Graphic */}
            <div className="mt-4 h-16 flex items-center justify-center">
              <div className="relative w-24 h-12">
                <div className="absolute inset-0 bg-gradient-to-r from-green-200 via-yellow-200 to-red-200 rounded-full"></div>
                <div className="absolute top-1 left-1 right-1 bottom-1 bg-white rounded-full"></div>
                <div className="absolute top-1/2 left-1/2 w-1 h-6 bg-purple-600 rounded transform -translate-x-1/2 -translate-y-1/2 rotate-12 origin-bottom"></div>
              </div>
            </div>
          </div>

          <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-purple-100 hover:shadow-xl transition-all duration-300">
            <div className="w-16 h-16 purple-gradient-bg rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Calculator className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2">ROI Projections</h3>
            <p className="text-gray-600">
              Detailed profitability and yield calculations
            </p>

            {/* ROI Graphic */}
            <div className="mt-4 h-16 flex items-center justify-center">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
                <div className="absolute inset-0 w-16 h-16 border-4 border-purple-500 rounded-full border-t-transparent"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold text-purple-600">
                    8.5%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
