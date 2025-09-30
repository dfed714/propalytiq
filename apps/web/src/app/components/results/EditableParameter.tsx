/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
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
}

interface EditableParametersProps {
  propertyData: PropertyData;
  investmentStrategy: string;
  onRegenerate: (newStrategy: string, parameters: any) => void;
}

const EditableParameters: React.FC<EditableParametersProps> = ({
  propertyData,
  investmentStrategy,
  onRegenerate,
}) => {
  const [currentStrategy, setCurrentStrategy] = useState(investmentStrategy);
  const [renovationBudget, setRenovationBudget] = useState("");
  const [monthlyRental, setMonthlyRental] = useState("");
  const [mortgageRate, setMortgageRate] = useState("");
  const [investmentGoal, setInvestmentGoal] = useState("");

  const handleRegenerate = () => {
    const parameters = {
      renovationBudget,
      monthlyRental,
      mortgageRate,
      investmentGoal,
    };
    onRegenerate(currentStrategy, parameters);
  };

  const getStrategyName = (strategy: string) => {
    const names = {
      btl: "Buy-to-Let",
      brr: "Buy-Refurbish-Refinance",
      sa: "Serviced Accommodation / Airbnb",
      hmo: "HMO (House in Multiple Occupation)",
    };
    return strategy in names ? names[strategy as keyof typeof names] : strategy;
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
                value={currentStrategy}
                onValueChange={setCurrentStrategy}
              >
                <SelectTrigger id="strategy" className="mt-1">
                  <SelectValue />
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
                Regenerate (1 Report Use)
              </Button>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default EditableParameters;
