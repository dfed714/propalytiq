import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import type { ReportList } from "@dtos";
import ReportTableClient from "./ReportTableClient";

type ReportsTableProps = {
  fetchAllReports: (
    offset: number,
    limit: number
  ) => Promise<ReportList | null>;
};

const PAGE_SIZE = 8;

const ReportsTable: React.FC<ReportsTableProps> = async ({
  fetchAllReports,
}) => {
  const data = (await fetchAllReports(0, PAGE_SIZE)) ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Property Analysis Reports</CardTitle>
      </CardHeader>
      <CardContent>
        <ReportTableClient
          initialData={data}
          fetchAllReports={fetchAllReports}
        />
      </CardContent>
    </Card>
  );
};

export default ReportsTable;
