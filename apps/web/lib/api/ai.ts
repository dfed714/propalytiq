/* eslint-disable @typescript-eslint/no-explicit-any */
import { serverApiJson } from "@lib/server-api";
import type { AnalysisRequestDto, GetPropertyInfoDto } from "@dtos";

export async function getPropertyInfo(propertyInfo: GetPropertyInfoDto) {
  return serverApiJson<{
    id: string;
    model: string;
    text: string | null;
    usage: any | null;
  }>("/ai/property-info", {
    method: "POST",
    body: JSON.stringify(propertyInfo),
  });
}

export async function analysis(data: AnalysisRequestDto) {
  return serverApiJson<{
    id: string;
    model: string;
    text: string | null;
    usage: any | null;
  }>("/ai/analysis", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
