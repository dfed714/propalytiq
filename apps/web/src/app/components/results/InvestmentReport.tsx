"use client";

import React, { useState } from "react";
import { Button } from "@components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { ArrowRight, Download, Share2, Send, PlusCircle } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Textarea } from "@components/ui/textarea";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface PropertyData {
  address: string;
  price: string;
  bedrooms: string | number;
  bathrooms: string | number;
  description: string;
  propertyType?: string;
  image?: string;
  investmentStrategy?: string;
  top_stats?: Record<string, number>;
  projection?: {
    x_label: string;
    y_label: string;
    points: Array<{ x: number | string; y: number }>;
  };
  strengths?: string[];
  weaknesses?: string[];
}

interface InvestmentReportProps {
  propertyData: PropertyData;
  investmentStrategy: string;
  userTier?: "free" | "basic" | "pro" | "enterprise";
  onUpgradeClick?: () => void;
}

// Define each strategy type to help TypeScript understand the properties
interface BuyToLetStrategy {
  title: string;
  topStats: Record<string, number>;
  pros: string[];
  cons: string[];
  recommendations: string[];
}

interface BRRStrategy {
  title: string;
  topStats: Record<string, number>;
  pros: string[];
  cons: string[];
  recommendations: string[];
}

interface ServicedAccommodationStrategy {
  title: string;
  topStats: Record<string, number>;
  pros: string[];
  cons: string[];
  recommendations: string[];
}

interface HMOStrategy {
  title: string;
  topStats: Record<string, number>;
  pros: string[];
  cons: string[];
  recommendations: string[];
}

// Union type for all strategies
type InvestmentStrategy =
  | BuyToLetStrategy
  | BRRStrategy
  | ServicedAccommodationStrategy
  | HMOStrategy;

// Define a function to determine if a feature is available based on subscription tier
const isFeatureAvailable = (
  feature: "basic" | "pro" | "enterprise",
  userTier?: string
) => {
  if (!userTier) return false;

  switch (feature) {
    case "basic":
      return ["basic", "pro", "enterprise"].includes(userTier);
    case "pro":
      return ["pro", "enterprise"].includes(userTier);
    case "enterprise":
      return userTier === "enterprise";
    default:
      return false;
  }
};

const InvestmentReport: React.FC<InvestmentReportProps> = ({
  propertyData,
  investmentStrategy = "btl",
  userTier = "basic",
  onUpgradeClick,
}) => {
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiAnswers, setAiAnswers] = useState<
    { question: string; answer: string }[]
  >([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [additionalInsights, setAdditionalInsights] = useState<string[]>([]);

  // Simulated investment data with JSON integration
  const strategyData: Record<string, InvestmentStrategy> = {
    btl: {
      title: "Buy-to-Let Analysis",
      topStats: propertyData.top_stats || {
        "ROI (%)": -3.44,
        "Rental Yield (%)": 3.7,
        "Monthly Income (£)": 1125,
        "Monthly Cashflow (£)": -343.5,
      },
      pros: propertyData.strengths || [
        "Family-sized 4-bedroom layout with strong rental appeal in Middleton/Alkrington.",
        "Clear long-term Buy-To-Let strategy aligned to steady rental demand.",
        "Ability to leverage equity through a mortgage to grow the portfolio.",
        "Location offers access to amenities and transport links, supporting occupancy.",
      ],
      cons: propertyData.weaknesses || [
        "Current financing setup yields negative monthly cashflow under these assumptions.",
        "Cashflow sensitivity to occupancy and maintenance costs; vacancy risk not fully captured.",
        "Interest-rate risk could impact future mortgage payments if rates rise.",
        "Property market illiquidity and transaction costs can hinder rapid exit.",
      ],
      recommendations: [
        "Consider minor kitchen updates to increase rental value",
        "Tenant demand is high for 4-bed properties in this area",
        "Property management services average 10-12% in this location",
      ],
    },
    brr: {
      title: "Buy-Refurbish-Refinance Analysis",
      topStats: {
        "Initial Investment (£)": 100000,
        "Refinance Value (£)": 150000,
        "Cash Pulled Out (%)": 50,
        "Post-Refi ROI (%)": 8,
      },
      pros: [
        "Strong potential for value increase after renovation",
        "Area is undergoing regeneration",
        "Property layout ideal for modernization",
      ],
      cons: [
        "Renovation costs could exceed estimates",
        "Refinance rates may change during project",
        "Planning permission may be required for extensions",
      ],
      recommendations: [
        "Focus renovation on kitchen and bathrooms for maximum value",
        "Consider converting loft space for additional bedroom",
        "Budget £35,000-£45,000 for comprehensive renovations",
      ],
    },
    sa: {
      title: "Serviced Accommodation Analysis",
      topStats: {
        "Average Nightly Rate (£)": 125,
        "Occupancy Rate (%)": 68,
        "Monthly Gross Income (£)": 2500,
        "Monthly Net Cashflow (£)": 750,
      },
      pros: [
        "High tourism in the area drives demand",
        "Property location ideal for short-term rentals",
        "Premium potential during summer months",
      ],
      cons: [
        "Seasonal fluctuations may impact winter income",
        "Higher management requirements than standard BTL",
        "Local regulations may change for short-term rentals",
      ],
      recommendations: [
        "Invest in high-quality furnishings for better reviews",
        "Professional photography will improve booking rates",
        "Consider management service specializing in SA (15-20% fee)",
      ],
    },
    hmo: {
      title: "HMO Analysis",
      topStats: {
        "Total Monthly Income (£)": 3250,
        "Net Monthly Cashflow (£)": 1320,
        "Occupancy Rate (%)": 90,
        "ROI (%)": 9.6,
      },
      pros: [
        "High demand for rooms in this location",
        "Property layout suitable for conversion",
        "University nearby ensures consistent tenant pool",
      ],
      cons: [
        "HMO licensing required (£1,000-£1,500)",
        "Fire safety regulations will require investments",
        "Higher tenant turnover than standard BTL",
      ],
      recommendations: [
        "Budget £15,000-£20,000 for HMO conversion costs",
        "Ensure compliance with minimum room size regulations",
        "Consider dedicated HMO management (12-15% fee)",
      ],
    },
  };

  // Get the correct strategy data
  const currentStrategy = strategyData[investmentStrategy] || strategyData.btl;

  // Transform projection data for Recharts
  interface CashFlowDataPoint {
    year: string;
    cashFlow: number;
  }

  const cashFlowData: CashFlowDataPoint[] = propertyData.projection?.points.map(
    (point) => ({
      year: `Year ${point.x}`,
      cashFlow: point.y || 0,
    })
  ) || [
    { year: "Year 1", cashFlow: -4122 },
    { year: "Year 2", cashFlow: -4122 },
    { year: "Year 3", cashFlow: -4122 },
    { year: "Year 4", cashFlow: -4122 },
    { year: "Year 5", cashFlow: -4122 },
  ];

  const handleExportPDF = () => {
    if (isFeatureAvailable("pro", userTier)) {
      toast.success(
        "Report export functionality will be available in the full version"
      );
    } else {
      if (onUpgradeClick) onUpgradeClick();
      toast.error("This feature requires a Pro or Enterprise subscription");
    }
  };

  const handleShare = () => {
    if (isFeatureAvailable("basic", userTier)) {
      toast.success(
        "Report sharing functionality will be available in the full version"
      );
    } else {
      if (onUpgradeClick) onUpgradeClick();
      toast.error("This feature requires a subscription");
    }
  };

  const handleAiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuestion.trim()) return;

    const question = aiQuestion.trim();
    setIsAiLoading(true);

    const premiumKeywords = ["projections", "forecast", "advanced", "premium"];
    const isPremiumQuestion = premiumKeywords.some((keyword) =>
      question.toLowerCase().includes(keyword)
    );

    setTimeout(() => {
      if (isPremiumQuestion && !isFeatureAvailable("pro", userTier)) {
        setAiAnswers((prev) => [
          ...prev,
          {
            question,
            answer:
              "I'm sorry, but that information requires a Pro or Enterprise subscription. Would you like to upgrade your plan to access advanced analytics and projections?",
          },
        ]);
      } else {
        const answer = `Based on the analysis of ${
          propertyData.address
        }, ${getAiResponse(question, currentStrategy)}`;
        setAiAnswers((prev) => [
          ...prev,
          {
            question,
            answer,
          },
        ]);
      }
      setAiQuestion("");
      setIsAiLoading(false);
    }, 1500);
  };

  const handleAddAnswerToReport = (answer: string) => {
    setAdditionalInsights((prev) => [...prev, answer]);
    toast.success("Answer added to your report!");
  };

  const getAiResponse = (question: string, strategy: InvestmentStrategy) => {
    if (
      question.toLowerCase().includes("roi") ||
      question.toLowerCase().includes("return")
    ) {
      return `the expected ROI for this property is ${
        strategy.topStats["ROI (%)"] || "N/A"
      }%. This is based on current market conditions and projected rental income.`;
    } else if (question.toLowerCase().includes("risk")) {
      return "this investment has a moderate risk profile. The property is in an area with stable demand, but be aware that market conditions can change.";
    } else if (
      question.toLowerCase().includes("recommend") ||
      question.toLowerCase().includes("advice")
    ) {
      return `I would recommend focusing on ${
        strategy.pros[0]?.toLowerCase() ?? "strengths"
      } and addressing ${
        strategy.cons[0]?.toLowerCase() ?? "weaknesses"
      } to maximize your returns.`;
    } else {
      return "this property shows good potential as an investment. The location has stable demand and the property characteristics align well with current market preferences.";
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{currentStrategy.title}</CardTitle>
            <CardDescription>
              Based on {propertyData.bedrooms} bedroom{" "}
              {propertyData.propertyType || "property"}
              priced at {propertyData.price}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {Object.entries(currentStrategy.topStats).map(
                ([key, value]: [string, number]) => (
                  <div
                    key={key}
                    className="bg-gray-50 p-4 rounded-lg text-center"
                  >
                    <p className="text-gray-500 text-sm">{key}</p>
                    <p
                      className={`text-2xl font-bold ${
                        key.includes("Cashflow") && value < 0
                          ? "text-red-500"
                          : "text-propalytiq-blue dark:text-blue-400"
                      }`}
                    >
                      {key.includes("(%)")
                        ? `${value}%`
                        : `£${Math.abs(value).toLocaleString()}`}
                    </p>
                  </div>
                )
              )}
            </div>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="projections">Projections</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-lg mb-2 text-propalytiq-blue dark:text-blue-400">
                      Strengths
                    </h3>
                    <ul className="space-y-2">
                      {currentStrategy.pros.map(
                        (pro: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <span className="text-green-500 mr-2">✓</span>
                            <span>{pro}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-medium text-lg mb-2 text-propalytiq-blue dark:text-blue-400">
                      Weaknesses
                    </h3>
                    <ul className="space-y-2">
                      {currentStrategy.cons.map(
                        (con: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <span className="text-red-500 mr-2">✗</span>
                            <span>{con}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="projections" className="pt-4">
                <h3 className="font-medium text-lg mb-4 text-propalytiq-blue dark:text-blue-400">
                  {propertyData.projection?.x_label || "Cashflow Projection"}
                </h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={cashFlowData}
                      margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="cashFlow"
                        stroke="#14B8A6"
                        fill="#14B8A6"
                        fillOpacity={0.2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 text-sm text-gray-500">
                  <p>
                    Projection based on the provided cashflow data for{" "}
                    {propertyData.address}
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
            <CardDescription>Custom advice for this property</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {currentStrategy.recommendations.map(
                (recommendation: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <div className="mr-3 mt-1 bg-propalytiq-teal h-2 w-2 rounded-full"></div>
                    <span>{recommendation}</span>
                  </li>
                )
              )}

              {additionalInsights.length > 0 && (
                <>
                  <li className="pt-4 border-t">
                    <p className="font-medium text-propalytiq-blue mb-2">
                      Additional Insights:
                    </p>
                  </li>
                  {additionalInsights.map((insight: string, index: number) => (
                    <li key={`insight-${index}`} className="flex items-start">
                      <div className="mr-3 mt-1 bg-propalytiq-teal h-2 w-2 rounded-full"></div>
                      <span>{insight}</span>
                    </li>
                  ))}
                </>
              )}
            </ul>
          </CardContent>
          <CardFooter className="flex-col items-stretch gap-2 border-t p-4">
            <Button
              variant="outline"
              onClick={handleExportPDF}
              className="w-full"
            >
              <Download className="mr-2 h-4 w-4" /> Export as PDF
            </Button>
            <Button variant="outline" onClick={handleShare} className="w-full">
              <Share2 className="mr-2 h-4 w-4" /> Share Report
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="text-xl">Ask Our AI Advisor</CardTitle>
          <CardDescription>
            Get specific insights about this investment property
          </CardDescription>
        </CardHeader>
        <CardContent>
          {aiAnswers.length > 0 && (
            <div className="mb-6 space-y-4 max-h-80 overflow-y-auto">
              {aiAnswers.map((item, index: number) => (
                <div key={index} className="space-y-2">
                  <div className="bg-gray-100 rounded-lg p-3">
                    <p className="font-medium">You asked:</p>
                    <p>{item.question}</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="font-medium">AI Advisor:</p>
                    <p>{item.answer}</p>
                    <div className="flex justify-end mt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs"
                        onClick={() => handleAddAnswerToReport(item.answer)}
                      >
                        <PlusCircle className="h-3 w-3 mr-1" /> Add to Report
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleAiSubmit} className="flex items-end gap-2">
            <div className="flex-1">
              <Textarea
                placeholder="Ask a question about this investment property..."
                value={aiQuestion}
                onChange={(e) => setAiQuestion(e.target.value)}
                className="min-h-[60px] resize-none"
                disabled={isAiLoading}
              />
            </div>
            <Button
              type="submit"
              size="icon"
              disabled={isAiLoading || !aiQuestion.trim()}
              className="h-10 w-10"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
        <Button variant="outline" asChild className="w-full sm:w-auto">
          <Link href="/analysis">Analyze Another Property</Link>
        </Button>
        <Button asChild className="w-full sm:w-auto">
          <Link href="/" className="flex items-center">
            Back to Home <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default InvestmentReport;
