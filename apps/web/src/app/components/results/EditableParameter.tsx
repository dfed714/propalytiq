/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@components/ui/accordion";
import { RefreshCw, Edit3 } from "lucide-react";

interface PropertyData {
  address: string;
  price: string;
  bedrooms: string | number;
  bathrooms: string | number;
  description: string;
  property_type?: string;
  image?: string;
  renovation_budget?: string | number;
  expected_monthly_rental?: string | number;
  mortgage_interest_rate?: string | number;
  investment_goal?: string;
  investment_strategy: string;
}

interface EditableParametersProps {
  propertyData: PropertyData;
}

const EditableParameters: React.FC<EditableParametersProps> = ({
  propertyData,
}) => {
  const router = useRouter();
  const [currentStrategy, setCurrentStrategy] = useState("");
  const [renovationBudget, setRenovationBudget] = useState("");
  const [expectedMonthlyRental, setExpectedMonthlyRental] = useState("");
  const [mortgageInterestRate, setMortgageInterestRate] = useState("");
  const [investmentGoal, setInvestmentGoal] = useState("");

  // Initialize state with propertyData values when component mounts or propertyData changes
  useEffect(() => {
    setCurrentStrategy(propertyData.investment_strategy);
    setRenovationBudget(propertyData.renovation_budget?.toString() || ""); // Use price as fallback for renovation budget if available
    setExpectedMonthlyRental(
      propertyData.expected_monthly_rental?.toString() || ""
    );
    setMortgageInterestRate(
      propertyData.mortgage_interest_rate?.toString() || ""
    );
    setInvestmentGoal(propertyData.investment_goal || "");
  }, [propertyData]);

  const handleRegenerate = () => {
    // Update propertyData with new values
    const updatedPropertyData = {
      ...propertyData,
      renovation_budget: renovationBudget || undefined,
      expected_monthly_rental: expectedMonthlyRental || undefined,
      mortgage_interest_rate: mortgageInterestRate || undefined,
      investment_goal: investmentGoal || undefined,
      investment_strategy: selectedStrategyName(currentStrategy), // Update strategy
    };

    // Save to sessionStorage and redirect
    try {
      sessionStorage.setItem(
        "propertyData",
        JSON.stringify(updatedPropertyData)
      );
    } catch {
      // Ignore storage errors (e.g., private mode)
    }
    router.push("/processing");
  };

  const selectedStrategy = (strategy: string) => {
    switch (strategy) {
      case "Buy-To-Let":
        return "btl";
      case "Buy-Refurbish-Refinance":
        return "brr";
      case "Serviced Accommodation / Airbnb":
        return "sa";
      case "HMO (House in Multiple Occupation)":
        return "hmo";
      default:
        return "";
    }
  };

  const selectedStrategyName = (strategy: string) => {
    switch (strategy) {
      case "btl":
        return "Buy-To-Let";
      case "brr":
        return "Buy-Refurbish-Refinance";
      case "sa":
        return "Serviced Accommodation / Airbnb";
      case "hmo":
        return "HMO (House in Multiple Occupation)";
      default:
        return "";
    }
  };

  return (
    <Accordion type="single" collapsible className="mb-8">
      <AccordionItem value="parameters" className="border rounded-lg">
        <AccordionTrigger className="px-6 py-4 hover:no-underline">
          <div className="flex items-center">
            <Edit3 className="h-5 w-5 mr-2" />
            <span className="font-medium">Edit Your Report</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-6 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="strategy">Investment Strategy</Label>
              <Select
                value={selectedStrategy(currentStrategy)}
                onValueChange={setCurrentStrategy}
              >
                <SelectTrigger id="strategy" className="mt-1">
                  <SelectValue placeholder="Select strategy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="btl">Buy-to-Let</SelectItem>
                  <SelectItem value="brr">Buy-Refurbish-Refinance</SelectItem>
                  <SelectItem value="sa">
                    Serviced Accommodation / Airbnb
                  </SelectItem>
                  <SelectItem value="hmo">
                    HMO (House in Multiple Occupation)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="renovation-budget">Renovation Budget (£)</Label>
              <Input
                id="renovation-budget"
                placeholder="e.g. 15000"
                value={renovationBudget}
                onChange={(e) => setRenovationBudget(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="monthly-rental">
                Expected Monthly Rental (£)
              </Label>
              <Input
                id="monthly-rental"
                placeholder="e.g. 1200"
                value={expectedMonthlyRental}
                onChange={(e) => setExpectedMonthlyRental(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="mortgage-rate">Mortgage Interest Rate (%)</Label>
              <Input
                id="mortgage-rate"
                placeholder="e.g. 4.5"
                value={mortgageInterestRate}
                onChange={(e) => setMortgageInterestRate(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="investment-goal">Primary Investment Goal</Label>
              <Select value={investmentGoal} onValueChange={setInvestmentGoal}>
                <SelectTrigger id="investment-goal" className="mt-1">
                  <SelectValue placeholder="Select your main goal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cashflow">Monthly Cash Flow</SelectItem>
                  <SelectItem value="capital-growth">Capital Growth</SelectItem>
                  <SelectItem value="mixed">Balanced Approach</SelectItem>
                  <SelectItem value="flip">Quick Flip/Resale</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                onClick={handleRegenerate}
                className="w-full"
                variant="outline"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Regenerate Report
              </Button>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default EditableParameters;
