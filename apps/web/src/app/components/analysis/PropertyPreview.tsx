/* eslint-disable @typescript-eslint/no-unused-vars */
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
  price: string;
  bedrooms: string | number;
  bathrooms: string | number;
  description: string;
  propertyType?: string;
  image?: string; // keep if you still sometimes show images
}

interface PropertyPreviewProps {
  propertyData: PropertyData;
  onAnalyze: () => void;
}

const PropertyPreview: React.FC<PropertyPreviewProps> = ({
  propertyData,
  onAnalyze,
}) => {
  const [investmentStrategy, setInvestmentStrategy] = React.useState("");

  // Optional inputs state
  const [renovationBudget, setRenovationBudget] = React.useState<string>("");
  const [expectedMonthlyRental, setExpectedMonthlyRental] =
    React.useState<string>("");
  const [mortgageRate, setMortgageRate] = React.useState<string>("");
  const [investmentGoal, setInvestmentGoal] = React.useState<string>("");

  const handleAnalyze = () => {
    if (!investmentStrategy) {
      toast.error("Please select an investment strategy");
      return;
    }

    // Build the combined payload to log
    const payload = {
      ...propertyData,
      investmentStrategy,
      renovationBudget: renovationBudget || null, // strings (or null if empty)
      expectedMonthlyRental: expectedMonthlyRental || null,
      mortgageRate: mortgageRate || null,
      investmentGoal: investmentGoal || null,
    };

    // Log the JSON object
    // (You'll see it in the browser devtools console)
    // If you prefer strict JSON text, you could do: console.log(JSON.stringify(payload));
    console.log(payload);

    // Keep existing behavior (navigate / sessionStorage save upstream)
    onAnalyze();
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
          <Select onValueChange={setInvestmentStrategy}>
            <SelectTrigger className="border-purple-200 focus:border-purple-500">
              <SelectValue placeholder="Choose a strategy" />
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

          {investmentStrategy && (
            <div className="mt-4 rounded-lg border border-purple-200 p-4">
              <h4 className="font-medium text-purple-700">
                {investmentStrategy === "btl" && "Buy-to-Let Strategy"}
                {investmentStrategy === "brr" &&
                  "Buy-Refurbish-Refinance Strategy"}
                {investmentStrategy === "sa" &&
                  "Serviced Accommodation Strategy"}
                {investmentStrategy === "hmo" && "HMO Strategy"}
              </h4>
              <p className="mt-2 text-sm text-gray-600">
                {investmentStrategy === "btl" &&
                  "Purchase a property with the primary aim of renting it out to tenants for regular monthly income."}
                {investmentStrategy === "brr" &&
                  "Buy a property below market value, renovate to increase its value, then refinance to pull out capital for your next investment."}
                {investmentStrategy === "sa" &&
                  "Offer short-term, fully furnished accommodation to guests, typically at higher rates than standard rentals."}
                {investmentStrategy === "hmo" &&
                  "Rent individual rooms to multiple tenants who share common facilities like kitchens and bathrooms."}
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
                    id="renovation-budget"
                    placeholder="e.g. 15000"
                    type="text"
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
                    type="text"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="mortgage-rate">
                    Mortgage Interest Rate (%)
                  </Label>
                  <Input
                    id="mortgage-rate"
                    placeholder="e.g. 4.5"
                    type="text"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="investment-goal">
                    Primary Investment Goal
                  </Label>
                  <Select>
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
                      <SelectItem value="mixed">Balanced Approach</SelectItem>
                      <SelectItem value="flip">Quick Flip/Resale</SelectItem>
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
