"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui/table";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import {
  Search,
  X,
  Filter,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Download,
  Eye,
} from "lucide-react";
import type { ReportList, ReportInfoDto, Property, Analysis } from "@dtos";
import generatePropertyReport from "@lib/generatePropertyReport";

// Types
type SortField = "address" | "strategy" | "roi";
type SortDirection = "asc" | "desc" | null;

type UIRow = {
  address: string;
  strategy: string;
  roi: number | null;
  property: Property;
  analysis: Analysis;
  created_at: Date;
};

type ReportTableClientProps = {
  initialData: ReportList;
  fetchAllReports: (
    offset: number,
    limit: number
  ) => Promise<ReportList | null>;
};

const PAGE_SIZE = 8;

// Map ReportInfoDto to UIRow
function mapReport(r: ReportInfoDto): UIRow {
  return {
    address: r.property_address || r.property.address || "—",
    strategy: r.strategy || r.property.investment_strategy || "—",
    roi: Number(r.roi) ? Number(r.roi) : null,
    property: r.property,
    analysis: r.analysis,
    created_at: r.created_at,
  };
}

// Client Component
const ReportTableClient: React.FC<ReportTableClientProps> = ({
  initialData,
  fetchAllReports,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [strategyFilter, setStrategyFilter] = useState("all");
  const [sortField, setSortField] = useState<SortField>("roi");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const [rows, setRows] = useState<UIRow[]>(initialData.map(mapReport));
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialData.length === PAGE_SIZE);
  const [loading, setLoading] = useState(false);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  async function fetchPage(next: number) {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const data = await fetchAllReports((next - 1) * PAGE_SIZE, PAGE_SIZE);
      if (!data || data.length === 0) {
        setHasMore(false);
        return;
      }
      const mapped = data.map(mapReport);
      setRows((prev) => (next === 1 ? mapped : [...prev, ...mapped]));
      setPage(next);
      setHasMore(data.length === PAGE_SIZE);
    } catch (error) {
      toast.error("Network error while loading reports");
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const root = scrollRef.current || undefined;
    const target = sentinelRef.current;
    if (!target) return;

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && hasMore && !loading) fetchPage(page + 1);
      },
      { root, rootMargin: "100px" }
    );

    io.observe(target);
    return () => io.disconnect();
  }, [hasMore, loading, page]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      const next =
        sortDirection === "asc"
          ? "desc"
          : sortDirection === "desc"
          ? null
          : "asc";
      setSortDirection(next);
      if (next === null) setSortField("roi"); // Reset to default
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field)
      return <ArrowUpDown className="h-4 w-4 opacity-50" />;
    if (sortDirection === "asc") return <ArrowUp className="h-4 w-4" />;
    if (sortDirection === "desc") return <ArrowDown className="h-4 w-4" />;
    return <ArrowUpDown className="h-4 w-4 opacity-50" />;
  };

  const filteredAndSorted = useMemo(() => {
    let filtered = rows.filter((r) => {
      const matchesSearch = r.address
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStrategy =
        strategyFilter === "all" || r.strategy === strategyFilter;
      return matchesSearch && matchesStrategy;
    });

    if (sortDirection && sortField) {
      filtered.sort((a, b) => {
        let av: any = (a as any)[sortField];
        let bv: any = (b as any)[sortField];
        if (av == null && bv == null) return 0;
        if (av == null) return 1;
        if (bv == null) return -1;
        if (av < bv) return sortDirection === "asc" ? -1 : 1;
        if (av > bv) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }
    return filtered;
  }, [rows, searchTerm, strategyFilter, sortField, sortDirection]);

  const handleViewReport = (propertyData: Property, analysisData: Analysis) => {
    sessionStorage.setItem("propertyData", JSON.stringify(propertyData));
    sessionStorage.setItem("analysisData", JSON.stringify(analysisData));
    window.open("/results", "_blank");
  };

  const handleExportPDF = (propertyData: Property, analysisData: Analysis) => {
    try {
      generatePropertyReport({ propertyData, analysisData });
      toast.success(
        "Report export functionality will be available in the full version"
      );
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF. Please try again.");
    }
  };

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by address..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchTerm(e.target.value)
            }
            className="pl-9 pr-9"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <Select
              value={strategyFilter}
              onValueChange={(v: string) => setStrategyFilter(v)}
            >
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Strategy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Strategies</SelectItem>
                <SelectItem value="Buy-Refurbish-Refinance">
                  Buy-Refurbish-Refinance
                </SelectItem>
                <SelectItem value="HMO">HMO</SelectItem>
                <SelectItem value="Serviced Accommodation">
                  Serviced Accommodation
                </SelectItem>
                <SelectItem value="Buy-to-Let">Buy-to-Let</SelectItem>
                <SelectItem value="—">Unknown</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div
        ref={scrollRef}
        className="rounded-md border overflow-auto max-h-[60vh]"
      >
        <Table>
          <TableHeader className="sticky top-0 bg-background z-10">
            <TableRow>
              <TableHead className="w-[300px]">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("address")}
                  className="font-medium px-2 py-1 h-auto"
                >
                  Property Address {getSortIcon("address")}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("strategy")}
                  className="font-medium px-2 py-1 h-auto"
                >
                  Strategy {getSortIcon("strategy")}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("roi")}
                  className="font-medium px-2 py-1 h-auto"
                >
                  ROI % {getSortIcon("roi")}
                </Button>
              </TableHead>
              <TableHead className="text-left">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSorted.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-8 text-muted-foreground"
                >
                  No reports found
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSorted.map((report, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {report.address}
                  </TableCell>
                  <TableCell>{report.strategy}</TableCell>
                  <TableCell>
                    <span
                      className={`font-semibold ${
                        (report.roi ?? 0) >= 7.5
                          ? "text-green-600"
                          : (report.roi ?? 0) >= 2.5
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {report.roi != null ? report.roi.toFixed(1) : "—"}%
                    </span>
                  </TableCell>
                  <TableCell className="text-left px-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Download Report"
                      onClick={() =>
                        handleExportPDF(report.property, report.analysis)
                      }
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      title="View Report"
                      onClick={() =>
                        handleViewReport(report.property, report.analysis)
                      } // Pass property and analysis
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <div ref={sentinelRef} />
        <div className="p-3 text-center text-sm text-muted-foreground">
          {loading ? "Loading…" : hasMore ? "" : "End of results"}
        </div>
      </div>
    </div>
  );
};

export default ReportTableClient;
