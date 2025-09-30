/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { Card, CardContent } from "@components/ui/card";
import { Button } from "@components/ui/button";
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
import { Label } from "@components/ui/label";
import { Input } from "@components/ui/input";
import { toast } from "sonner";
import PropertyMap from "@components/maps/PropertyMap";

interface PropertyData {
  address: string;
  bathrooms: string | number;
  bedrooms: string | number;
  description: string;
  price: string;
  price_type: "purchase" | "rent";
  rent_period?: "monthly" | "yearly";
  property_type?: string;
  investmentStrategy?: number;
  investment_goal?: string;
  renovation_budget?: number;
  expected_monthly_rental?: number;
  mortgage_rate?: number;
}

interface PropertyPreviewProps {
  propertyData: PropertyData;
  onAnalyze: (payload: any) => void;
}

const PropertyPreview: React.FC<PropertyPreviewProps> = ({
  propertyData,
  onAnalyze,
}) => {
  const rentingStrategy = propertyData.price_type === "rent";

  const [investmentStrategy, setInvestmentStrategy] =
    React.useState<string>("");

  React.useEffect(() => {
    if (rentingStrategy) {
      setInvestmentStrategy("Rent-To-Rent");
    }
  }, [rentingStrategy]);

  // Optional inputs state
  const [renovationBudget, setRenovationBudget] = React.useState<number>(0);
  const [expectedMonthlyRental, setExpectedMonthlyRental] =
    React.useState<number>(0);
  const [mortgageRate, setMortgageRate] = React.useState<number>(0);
  const [investmentGoal, setInvestmentGoal] = React.useState<string>("");

  const handleAnalyze = () => {
    if (!investmentStrategy) {
      toast.error("Please select an investment strategy");
      return;
    }

    const payload = {
      ...propertyData,
      investmentStrategy: investmentStrategy,
      investment_goal: investmentGoal || null,
      renovation_budget: renovationBudget || null,
      expected_monthly_rental: expectedMonthlyRental || null,
      mortgage_rate: mortgageRate || null,
    };

    onAnalyze(payload);
  };

  return (
    <div className="space-y-8">
      <Card className="overflow-hidden border-purple-200">
        <div className="aspect-video w-full overflow-hidden">
          {/* Map replaces the template image */}
          <PropertyMap address={propertyData.address} />
        </div>

        <CardContent className="p-6">
          <h3 className="text-2xl font-semibold mb-2">
            {propertyData.address}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-500">Price</p>
              <p className="font-semibold">{propertyData.price}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Bedrooms</p>
              <p className="font-semibold">{propertyData.bedrooms}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Bathrooms</p>
              <p className="font-semibold">{propertyData.bathrooms}</p>
            </div>
          </div>

          {propertyData.description && (
            <div className="mb-6">
              <p className="text-sm text-gray-500">Description</p>
              <p className="text-gray-700">{propertyData.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="bg-white rounded-xl border border-purple-200 p-4 sm:p-6 space-y-6">
        <div>
          <h3 className="text-xl font-semibold mb-4">
            Select Your Investment Strategy
          </h3>
          <Select
            onValueChange={setInvestmentStrategy}
            value={rentingStrategy ? "Rent-To-Rent" : investmentStrategy}
            disabled={rentingStrategy} // lock it when renting
          >
            <SelectTrigger className="border-purple-200 focus:border-purple-500">
              <SelectValue placeholder="Choose a strategy" />
            </SelectTrigger>
            <SelectContent>
              {rentingStrategy ? (
                <SelectItem value="Rent-To-Rent">Rent-To-Rent</SelectItem>
              ) : (
                <>
                  <SelectItem value="Buy-To-Let">Buy-to-Let</SelectItem>
                  <SelectItem value="Buy-Refurbish-Refinance">
                    Buy-Refurbish-Refinance
                  </SelectItem>
                  <SelectItem value="Serviced Accommodation">
                    Serviced Accommodation / Airbnb
                  </SelectItem>
                  <SelectItem value="Flips">Flips</SelectItem>
                  <SelectItem value="HMO">
                    HMO (House in Multiple Occupation)
                  </SelectItem>
                  <SelectItem value="Rent-To-Rent">Rent-To-Rent</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>

          {investmentStrategy && (
            <div className="mt-4 rounded-lg border border-purple-200 p-4">
              <h4 className="font-medium text-purple-700">
                {investmentStrategy === "Buy-To-Let" && "Buy-to-Let Strategy"}
                {investmentStrategy === "Buy-Refurbish-Refinance" &&
                  "Buy-Refurbish-Refinance Strategy"}
                {investmentStrategy === "Serviced Accommodation" &&
                  "Serviced Accommodation Strategy"}
                {investmentStrategy === "HMO" && "HMO Strategy"}
                {investmentStrategy === "Flips" && "Flips Strategy"}
                {investmentStrategy === "Rent-To-Rent" &&
                  "Rent-To-Rent Strategy"}
              </h4>
              <p className="mt-2 text-sm text-gray-600">
                {investmentStrategy === "Buy-To-Let" &&
                  "Purchase a property with the primary aim of renting it out to tenants for regular monthly income."}
                {investmentStrategy === "Buy-Refurbish-Refinance" &&
                  "Buy a property below market value, renovate to increase its value, then refinance to pull out capital for your next investment."}
                {investmentStrategy === "Services Accommodation" &&
                  "Offer short-term, fully furnished accommodation to guests, typically at higher rates than standard rentals."}
                {investmentStrategy === "HMO" &&
                  "Rent individual rooms to multiple tenants who share common facilities like kitchens and bathrooms."}
                {investmentStrategy === "Flips" &&
                  "Buy properties with the intention of renovating and reselling them quickly for a profit."}
                {investmentStrategy === "Rent-To-Rent" &&
                  "You lease a property legally on a commercial agreement and re-rent via Airbnb/short-term lets."}
              </p>
            </div>
          )}
        </div>

        <Accordion type="single" collapsible>
          <AccordionItem value="optional-inputs">
            <AccordionTrigger>
              Additional Investment Details (Optional)
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div>
                  <Label htmlFor="renovation-budget">
                    Renovation Budget (£)
                  </Label>
                  <Input
                    onChange={(e) =>
                      setRenovationBudget(Number(e.target.value))
                    }
                    id="renovation-budget"
                    placeholder="e.g. 15000"
                    type="number"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="monthly-rental">
                    Expected Monthly Rental (£)
                  </Label>
                  <Input
                    onChange={(e) =>
                      setExpectedMonthlyRental(Number(e.target.value))
                    }
                    id="monthly-rental"
                    placeholder="e.g. 1200"
                    type="number"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="mortgage-rate">
                    Mortgage Interest Rate (%)
                  </Label>
                  <Input
                    onChange={(e) => setMortgageRate(Number(e.target.value))}
                    id="mortgage-rate"
                    placeholder="e.g. 4.5"
                    type="number"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="investment-goal">
                    Primary Investment Goal
                  </Label>
                  <Select onValueChange={setInvestmentGoal}>
                    <SelectTrigger id="investment-goal" className="mt-1">
                      <SelectValue placeholder="Select your main goal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cashflow">
                        Monthly Cash Flow
                      </SelectItem>
                      <SelectItem value="capital-growth">
                        Capital Growth
                      </SelectItem>
                      <SelectItem value="balanced">
                        Balanced Approach
                      </SelectItem>
                      <SelectItem value="quick-resale">
                        Quick Flip/Resale
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="pt-4">
          <Button onClick={handleAnalyze} className="w-full" size="lg">
            Generate Investment Report
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PropertyPreview;
