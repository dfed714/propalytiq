import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import type { DashboardMetrics, ReportList } from "@dtos";
import DashboardTableClient from "./DashboardTableClient";
import Link from "@node_modules/next/link";
import { Button } from "@src/app/components/ui/button";
import { report } from "process";

type DashboardsTableProps = {
  firstName: string;
  fetchMetrics: () => Promise<DashboardMetrics>;
  fetchReports: () => Promise<ReportList>;
};

const DashboardsTable: React.FC<DashboardsTableProps> = async ({
  firstName,
  fetchMetrics,
  fetchReports,
}) => {
  const data = await fetchMetrics();

  const reports = await fetchReports();

  return (
    <div className="container p-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-gray-500">
            Welcome back{firstName ? `, ${firstName}` : ""}!
          </p>
        </div>
        <div className="flex gap-4">
          <Link href="/analysis">
            <Button>New Analysis</Button>
          </Link>
        </div>
      </div>

      <DashboardTableClient metrics={data} reports={reports} />
    </div>
  );
};

export default DashboardsTable;
