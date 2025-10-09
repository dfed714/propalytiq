/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
import { pool } from '@db';
import { ReportInfoDto } from '@dtos';

export async function getReportRow(
  reportId: number,
): Promise<ReportInfoDto | null> {
  const sql = `
    SELECT * 
    FROM reports
    WHERE id = $1
  `;

  const { rows } = await pool.query<ReportInfoDto>(sql, [reportId]);
  return rows[0] ?? null;
}

export async function getAllReports(
  user_id: string,
  offset: number = 0,
  limit: number = 8,
): Promise<ReportInfoDto[] | []> {
  const sql = `
    SELECT * 
    FROM reports
    WHERE user_id = $1
    OFFSET $2
    LIMIT $3;
  `;

  const { rows } = await pool.query<ReportInfoDto>(sql, [
    user_id,
    offset,
    limit,
  ]);

  return rows.length > 0 ? rows : [];
}

export async function createReport(
  report: ReportInfoDto,
  user_id: string,
): Promise<ReportInfoDto> {
  const sql = `
    INSERT INTO reports (strategy, roi, property, analysis, property_address, user_id, created_at)
    VALUES ($1, $2, $3, $4, $5, $6, NOW())
    RETURNING *;
  `;

  const { rows } = await pool.query<ReportInfoDto>(sql, [
    report.strategy,
    report.roi,
    report.property,
    report.analysis,
    report.property_address,
    user_id,
  ]);
  return rows[0];
}
