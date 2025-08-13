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
import {
  ArrowRight,
  Download,
  Share2,
  Lock,
  Send,
  PlusCircle,
} from "lucide-react";
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
  BarChart,
  Bar,
  Legend,
} from "recharts";

interface PropertyData {
  address: string;
  price: string;
  bedrooms: string | number;
  bathrooms: string | number;
  description: string;
  propertyType?: string;
  image?: string;
}

// ---------------- Strategy Types ----------------

interface BuyToLetStrategy {
  title: string;
  roi: string;
  rentalYield: string;
  monthlyIncome: string;
  cashflow: string;
  pros: string[];
  cons: string[];
  recommendations: string[];
}

interface BRRStrategy {
  title: string;
  roi: string;
  potentialValue: string;
  refinanceAmount: string;
  cashflow: string;
  pros: string[];
  cons: string[];
  recommendations: string[];
}

interface ServicedAccommodationStrategy {
  title: string;
  roi: string;
  occupancyRate: string;
  averageDailyRate: string;
  cashflow: string;
  pros: string[];
  cons: string[];
  recommendations: string[];
}

interface HMOStrategy {
  title: string;
  roi: string;
  rooms: string;
  totalIncome: string;
  cashflow: string;
  pros: string[];
  cons: string[];
  recommendations: string[];
}

type InvestmentStrategy =
  | BuyToLetStrategy
  | BRRStrategy
  | ServicedAccommodationStrategy
  | HMOStrategy;

// Allowed keys for strategies
const STRATEGY_KEYS = ["btl", "brr", "sa", "hmo"] as const;
type StrategyKey = (typeof STRATEGY_KEYS)[number];
const isStrategyKey = (v: string): v is StrategyKey =>
  (STRATEGY_KEYS as readonly string[]).includes(v);

// ---------------- Subscription ----------------

type UserTier = "free" | "basic" | "pro" | "enterprise";

// Determine if a feature is available based on subscription tier
const isFeatureAvailable = (
  feature: "basic" | "pro" | "enterprise",
  userTier?: UserTier
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

// ---------------- Props ----------------

interface InvestmentReportProps {
  propertyData: PropertyData;
  investmentStrategy?: StrategyKey; // use the union, not plain string
  userTier?: UserTier;
  onUpgradeClick?: () => void;
}

// ---------------- Component ----------------

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

  // Simulated investment data keyed by StrategyKey
  const strategyData: Record<StrategyKey, InvestmentStrategy> = {
    btl: {
      title: "Buy-to-Let Analysis",
      roi: "6.2%",
      rentalYield: "5.8%",
      monthlyIncome: "£1,250",
      cashflow: "+£350",
      pros: [
        "Stable monthly income",
        "Property prices in this area have risen 15% over 5 years",
        "Low maintenance costs compared to similar properties",
      ],
      cons: [
        "Local rental market is competitive",
        "Property may need minor updates in 2-3 years",
        "Limited capital growth potential",
      ],
      recommendations: [
        "Consider minor kitchen updates to increase rental value",
        "Tenant demand is high for 2-bed properties in this area",
        "Property management services average 10-12% in this location",
        "This property might perform better as a Serviced Accommodation due to its prime location near tourist attractions",
      ],
    },
    brr: {
      title: "Buy-Refurbish-Refinance Analysis",
      roi: "12.4%",
      potentialValue: "£525,000",
      refinanceAmount: "£393,750",
      cashflow: "+£220",
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
        "This property could also work well as a HMO given the size and number of potential rooms",
      ],
    },
    sa: {
      title: "Serviced Accommodation Analysis",
      roi: "10.8%",
      occupancyRate: "68%",
      averageDailyRate: "£125",
      cashflow: "+£750",
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
        "A traditional Buy-to-Let approach could be more stable if consistent income is preferred over higher seasonal returns",
      ],
    },
    hmo: {
      title: "HMO Analysis",
      roi: "9.6%",
      rooms: "5 potential rooms",
      totalIncome: "£3,250",
      cashflow: "+£1,320",
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
        "This property could also work well as a Buy-Refurbish-Refinance project due to its potential for value increase after converting to HMO",
      ],
    },
  };

  // Ensure key is valid at runtime, then get strategy (never undefined)
  const key: StrategyKey = isStrategyKey(investmentStrategy)
    ? investmentStrategy
    : "btl";
  const currentStrategy: InvestmentStrategy = strategyData[key];

  // Type guards for different strategy types
  const isBTL = (strategy: InvestmentStrategy): strategy is BuyToLetStrategy =>
    "rentalYield" in strategy && "monthlyIncome" in strategy;
  const isBRR = (strategy: InvestmentStrategy): strategy is BRRStrategy =>
    "potentialValue" in strategy && "refinanceAmount" in strategy;
  const isSA = (
    strategy: InvestmentStrategy
  ): strategy is ServicedAccommodationStrategy =>
    "occupancyRate" in strategy && "averageDailyRate" in strategy;
  const isHMO = (strategy: InvestmentStrategy): strategy is HMOStrategy =>
    "rooms" in strategy && "totalIncome" in strategy;

  // Simulated chart data
  const cashFlowData = [
    { year: "Year 1", cashFlow: 4200, equity: 15000 },
    { year: "Year 2", cashFlow: 4400, equity: 23000 },
    { year: "Year 3", cashFlow: 4600, equity: 32000 },
    { year: "Year 4", cashFlow: 4900, equity: 42000 },
    { year: "Year 5", cashFlow: 5200, equity: 53000 },
    { year: "Year 6", cashFlow: 5500, equity: 65000 },
    { year: "Year 7", cashFlow: 5800, equity: 78000 },
  ];

  const strategyComparisonData = [
    { name: "BTL", roi: 6.2, risk: 3 },
    { name: "BRR", roi: 12.4, risk: 7 },
    { name: "SA", roi: 10.8, risk: 6 },
    { name: "HMO", roi: 9.6, risk: 5 },
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

  const PremiumContentOverlay = ({
    tierRequired,
    children,
  }: {
    tierRequired: "pro" | "enterprise";
    children: React.ReactNode;
  }) => {
    const available = isFeatureAvailable(tierRequired, userTier);
    if (available) return <>{children}</>;
    return (
      <div className="relative">
        <div className="absolute inset-0 backdrop-blur-sm bg-white/30 dark:bg-gray-800/30 flex flex-col items-center justify-center z-10 rounded-lg">
          <Lock className="h-8 w-8 text-gray-400 mb-2" />
          <p className="text-sm font-medium text-center mb-2">
            {tierRequired === "pro" ? "Pro" : "Enterprise"} Feature
          </p>
          <Button size="sm" onClick={onUpgradeClick}>
            Unlock
          </Button>
        </div>
        <div className="filter blur-sm">{children}</div>
      </div>
    );
  };

  const getAiResponse = (question: string, strategy: InvestmentStrategy) => {
    const q = question.toLowerCase();
    if (q.includes("roi") || q.includes("return")) {
      return `the expected ROI for this property is ${strategy.roi}. This is based on current market conditions and projected rental income.`;
    } else if (q.includes("risk")) {
      return "this investment has a moderate risk profile. The property is in an area with stable demand, but be aware that market conditions can change.";
    } else if (q.includes("recommend") || q.includes("advice")) {
      const pro = strategy.pros?.[0]?.toLowerCase() ?? "the main strength";
      const con = strategy.cons?.[0]?.toLowerCase() ?? "a key weakness";
      return `I would recommend focusing on ${pro} and addressing ${con} to maximize your returns.`;
    } else {
      return "this property shows good potential as an investment. The location has stable demand and the property characteristics align well with current market preferences.";
    }
  };

  const handleAiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuestion.trim()) return;

    const question = aiQuestion.trim();
    setIsAiLoading(true);

    const premiumKeywords = [
      "projections",
      "forecast",
      "alternatives",
      "comparison",
      "advanced",
      "premium",
    ];
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
        const answer = `Based on the analysis of ${propertyData.address}, ${getAiResponse(question, currentStrategy)}`;
        setAiAnswers((prev) => [...prev, { question, answer }]);
      }
      setAiQuestion("");
      setIsAiLoading(false);
    }, 1500);
  };

  const handleAddAnswerToReport = (answer: string) => {
    setAdditionalInsights((prev) => [...prev, answer]);
    toast.success("Answer added to your report!");
  };

  return (
    <div className="space-y-8">
      <div className="bg-propalytiq-blue text-white p-4 sm:p-8 rounded-xl">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4">
          Your Smart Investment Report
        </h1>
        <p className="text-lg sm:text-xl opacity-90">{propertyData.address}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main summary card */}
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
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center">
                <p className="text-gray-500 dark:text-gray-400 text-sm">ROI</p>
                <p className="text-2xl font-bold text-propalytiq-blue dark:text-blue-400">
                  {currentStrategy.roi}
                </p>
              </div>

              {isBTL(currentStrategy) && (
                <>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center">
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      Rental Yield
                    </p>
                    <p className="text-2xl font-bold text-propalytiq-blue dark:text-blue-400">
                      {currentStrategy.rentalYield}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center">
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      Monthly Income
                    </p>
                    <p className="text-2xl font-bold text-propalytiq-teal">
                      {currentStrategy.monthlyIncome}
                    </p>
                  </div>
                </>
              )}

              {isBRR(currentStrategy) && (
                <>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center">
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      After Renovation
                    </p>
                    <p className="text-2xl font-bold text-propalytiq-blue">
                      {currentStrategy.potentialValue}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center">
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      Refinance Amount
                    </p>
                    <p className="text-2xl font-bold text-propalytiq-teal">
                      {currentStrategy.refinanceAmount}
                    </p>
                  </div>
                </>
              )}

              {isSA(currentStrategy) && (
                <>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center">
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      Occupancy Rate
                    </p>
                    <p className="text-2xl font-bold text-propalytiq-blue">
                      {currentStrategy.occupancyRate}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center">
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      Daily Rate
                    </p>
                    <p className="text-2xl font-bold text-propalytiq-teal">
                      {currentStrategy.averageDailyRate}
                    </p>
                  </div>
                </>
              )}

              {isHMO(currentStrategy) && (
                <>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center">
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      Potential Rooms
                    </p>
                    <p className="text-2xl font-bold text-propalytiq-blue">
                      {currentStrategy.rooms}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center">
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      Total Income
                    </p>
                    <p className="text-2xl font-bold text-propalytiq-teal">
                      {currentStrategy.totalIncome}
                    </p>
                  </div>
                </>
              )}

              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center">
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Monthly Cashflow
                </p>
                <p className="text-2xl font-bold text-green-500">
                  {currentStrategy.cashflow}
                </p>
              </div>
            </div>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="projections">Projections</TabsTrigger>
                <TabsTrigger value="alternatives">Alternatives</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-lg mb-2 text-propalytiq-blue dark:text-blue-400">
                      Strengths
                    </h3>
                    <ul className="space-y-2">
                      {currentStrategy.pros.map((pro, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-green-500 mr-2">✓</span>
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-medium text-lg mb-2 text-propalytiq-blue dark:text-blue-400">
                      Weaknesses
                    </h3>
                    <ul className="space-y-2">
                      {currentStrategy.cons.map((con, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-red-500 mr-2">✗</span>
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="projections" className="pt-4">
                <PremiumContentOverlay tierRequired="pro">
                  <h3 className="font-medium text-lg mb-4 text-propalytiq-blue dark:text-blue-400">
                    7-Year Projection
                  </h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={cashFlowData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis />
                        <Tooltip />
                        <Area
                          type="monotone"
                          dataKey="equity"
                          stroke="#1E3A8A"
                          fill="#1E3A8A"
                          fillOpacity={0.2}
                        />
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
                  <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                    <p>
                      Projection based on average market growth and inflation
                      rates
                    </p>
                  </div>
                </PremiumContentOverlay>
              </TabsContent>

              <TabsContent value="alternatives" className="pt-4">
                <PremiumContentOverlay tierRequired="enterprise">
                  <h3 className="font-medium text-lg mb-4 text-propalytiq-blue dark:text-blue-400">
                    Strategy Comparison
                  </h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={strategyComparisonData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="roi" name="ROI %" fill="#1E3A8A" />
                        <Bar dataKey="risk" name="Risk (1-10)" fill="#14B8A6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">
                      Consider Alternative: {key === "btl" ? "BRR" : "BTL"}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {key === "btl"
                        ? "This property has good potential for value increase through renovation. Consider a BRR strategy for higher returns."
                        : "If you prefer lower risk investment, this property would also work well as a standard Buy-to-Let."}
                    </p>
                  </div>
                </PremiumContentOverlay>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Recommendations card with additional insights */}
        <Card>
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
            <CardDescription>Custom advice for this property</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {currentStrategy.recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start">
                  <div className="mr-3 mt-1 bg-propalytiq-teal h-2 w-2 rounded-full"></div>
                  <span>{recommendation}</span>
                </li>
              ))}

              {additionalInsights.length > 0 && (
                <>
                  <li className="pt-4 border-t">
                    <p className="font-medium text-propalytiq-blue mb-2">
                      Additional Insights:
                    </p>
                  </li>
                  {additionalInsights.map((insight, index) => (
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

      {/* AI Chat Input Box */}
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
              {aiAnswers.map((item, index) => (
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
