// ProcessingPage.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import { redirect } from "next/navigation";
import MainLayout from "@components/layout/MainLayout";
import { getAuth } from "@/lib/auth";
import { getAccount } from "@lib/api/account";
import ProcessingClient from "./ProcessingClient";
import { analysis } from "@/lib/api/ai";

export default async function ProcessingPage() {
  const { user } = await getAuth();
  if (!user) redirect("/login");
  const account = user ? await getAccount() : null;

  // Server Action
  async function fetchPropertyAnalysis(propertyData: string) {
    "use server";
    console.log("FETCHING PROPERTY ANALYSIS");
    try {
      const parsedData = JSON.parse(propertyData);
      console.log("Parsed Info:", parsedData);

      // Map to match DTO snake_case
      const dtoData = {
        property_address: parsedData.address,
        purchase_price: parsedData.price
          ? parseFloat(parsedData.price.replace(/£|,/g, ""))
          : null,
        rental_price_per_month: parsedData.expected_monthly_rental,
        number_of_bedrooms: parsedData.bedrooms,
        number_of_bathrooms: parsedData.bathrooms,
        property_type: parsedData.propertyType,
        property_description: parsedData.description,
        investment_strategy: parsedData.investmentStrategy,
        budget: parsedData.renovation_budget,
        desired_monthly_income: parsedData.expected_monthly_rental,
        mortgage_interest_rate: parsedData.mortgage_rate,
        primary_investment_goal: parsedData.investment_goal,
      };

      console.log("DTO Data to be sent:", dtoData);

      const data = await analysis(dtoData as any);
      return data;
    } catch (error) {
      console.error("Error in fetchPropertyAnalysis:", error);
      throw new Error("Failed to process property analysis");
    }
  }

  return (
    <MainLayout
      isAuthenticated={!!user}
      firstName={account?.user.firstName ?? undefined}
    >
      <ProcessingClient fetchPropertyAnalysis={fetchPropertyAnalysis} />
    </MainLayout>
  );
}
