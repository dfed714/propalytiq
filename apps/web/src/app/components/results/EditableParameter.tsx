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
  propertyType?: string;
  image?: string;
  renovationBudget?: string | number;
  expectedMonthlyRental?: string | number;
  mortgageRate?: string | number;
  investmentGoal?: string;
  investmentStrategy: string;
}

interface EditableParametersProps {
  propertyData: PropertyData;
  onRegenerate: (newStrategy: string, parameters: any) => void;
}

const EditableParameters: React.FC<EditableParametersProps> = ({
  propertyData,
  onRegenerate,
}) => {
  const router = useRouter();
  const [currentStrategy, setCurrentStrategy] = useState("");
  const [renovationBudget, setRenovationBudget] = useState("");
  const [monthlyRental, setMonthlyRental] = useState("");
  const [mortgageRate, setMortgageRate] = useState("");
  const [investmentGoal, setInvestmentGoal] = useState("");

  // Initialize state with propertyData values when component mounts or propertyData changes
  useEffect(() => {
    setCurrentStrategy(propertyData.investmentStrategy);
    setRenovationBudget(propertyData.renovationBudget?.toString() || ""); // Use price as fallback for renovation budget if available
    setMonthlyRental(propertyData.expectedMonthlyRental?.toString() || "");

    console.log(propertyData.expectedMonthlyRental);
    setMortgageRate(propertyData.mortgageRate?.toString() || "");
    setInvestmentGoal(propertyData.investmentGoal || "");
  }, [propertyData]);

  const handleRegenerate = () => {
    const parameters = {
      renovationBudget: renovationBudget || undefined,
      monthlyRental: monthlyRental || undefined,
      mortgageRate: mortgageRate || undefined,
      investmentGoal: investmentGoal || undefined,
    };

    // Update propertyData with new values
    const updatedPropertyData = {
      ...propertyData,
      renovationBudget: renovationBudget || undefined,
      expectedMonthlyRental: monthlyRental || undefined,
      mortgageRate: mortgageRate || undefined,
      investmentGoal: investmentGoal || undefined,
      investmentStrategy: currentStrategy, // Update strategy
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
                value={monthlyRental}
                onChange={(e) => setMonthlyRental(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="mortgage-rate">Mortgage Interest Rate (%)</Label>
              <Input
                id="mortgage-rate"
                placeholder="e.g. 4.5"
                value={mortgageRate}
                onChange={(e) => setMortgageRate(e.target.value)}
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
