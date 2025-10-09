// lib/api/account.ts
import { serverApiJson } from "@lib/server-api";
import type { ReportInfoDto, ReportList } from "@dtos";

export async function getAllReports(
  user_id: string,
  offset = 0,
  limit = 8
): Promise<ReportList | null> {
  const queryParams = new URLSearchParams({
    user_id,
    offset: offset.toString(),
    limit: limit.toString(),
  });

  return serverApiJson<ReportList>(`/report/all?${queryParams.toString()}`, {
    method: "GET",
  });
}

export async function createReport(
  report: ReportInfoDto,
  user_id: string
): Promise<ReportInfoDto> {
  return serverApiJson<ReportInfoDto>("/report/create", {
    method: "POST",
    body: JSON.stringify({ report, user_id }),
  });
}
