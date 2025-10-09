// ProcessingPage.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import { redirect } from "next/navigation";
import MainLayout from "@components/layout/MainLayout";
import { getAuth } from "@/lib/auth";
import { getAccount } from "@lib/api/account";
import ProcessingClient from "./ProcessingClient";
import { analysis } from "@/lib/api/ai";
import { Analysis, AnalysisRequestDto, Property, ReportInfoDto } from "@dtos";
import { createReport } from "@lib/api/report";

export default async function ProcessingPage() {
  const { user } = await getAuth();
  if (!user) redirect("/login");
  const account = user ? await getAccount() : null;

  // Server Action
  async function fetchPropertyAnalysis(propertyData: AnalysisRequestDto) {
    "use server";
    try {
      const data = await analysis(propertyData);
      return data;
    } catch (error) {
      console.error("Error in fetchPropertyAnalysis:", error);
      throw new Error("Failed to process property analysis");
    }
  }

  return (
    <MainLayout
      isAuthenticated={!!user}
      firstName={account?.user.first_name ?? undefined}
    >
      <ProcessingClient fetchPropertyAnalysis={fetchPropertyAnalysis} />
    </MainLayout>
  );
}
