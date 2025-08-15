'use client';

import React, { useState, useMemo } from 'react';
import MainLayout from '@components/Layout/MainLayout';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@components/ui/card";
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import { Badge } from '@components/ui/badge';
import { 
  Download, 
  Search, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown,
  Calendar,
  Filter
} from 'lucide-react';
import generatePropertyReport from '@utils/pdfGenerator';

// Extended mock data for reports
const mockReports = [
  {
    id: 1,
    address: '123 Investment Avenue, London',
    date: '2025-05-12',
    strategy: 'Buy-to-Let',
    roi: 6.2,
    investment: 450000,
    monthlyRental: 2100,
    status: 'Completed'
  },
  {
    id: 2,
    address: '45 Profit Street, Manchester',
    date: '2025-05-08',
    strategy: 'HMO',
    roi: 9.6,
    investment: 320000,
    monthlyRental: 2800,
    status: 'Completed'
  },
  {
    id: 3,
    address: '78 Capital Road, Birmingham',
    date: '2025-05-02',
    strategy: 'Serviced Accommodation',
    roi: 10.8,
    investment: 280000,
    monthlyRental: 2400,
    status: 'Completed'
  },
  {
    id: 4,
    address: '156 Yield Close, Leeds',
    date: '2025-04-28',
    strategy: 'Buy-to-Let',
    roi: 5.8,
    investment: 380000,
    monthlyRental: 1850,
    status: 'Completed'
  },
  {
    id: 5,
    address: '92 Return Gardens, Liverpool',
    date: '2025-04-22',
    strategy: 'HMO',
    roi: 8.4,
    investment: 295000,
    monthlyRental: 2200,
    status: 'In Progress'
  },
  {
    id: 6,
    address: '34 Portfolio Street, Bristol',
    date: '2025-04-18',
    strategy: 'Serviced Accommodation',
    roi: 11.2,
    investment: 310000,
    monthlyRental: 2650,
    status: 'Completed'
  },
  {
    id: 7,
    address: '67 Income Drive, Newcastle',
    date: '2025-04-15',
    strategy: 'Buy-to-Let',
    roi: 6.9,
    investment: 235000,
    monthlyRental: 1425,
    status: 'Completed'
  },
  {
    id: 8,
    address: '89 Cash Flow Avenue, Sheffield',
    date: '2025-04-10',
    strategy: 'HMO',
    roi: 9.1,
    investment: 275000,
    monthlyRental: 2150,
    status: 'Completed'
  }
];

type SortField = 'date' | 'address' | 'strategy' | 'roi' | 'investment' | 'monthlyRental';
type SortDirection = 'asc' | 'desc' | null;

const ReportsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [strategyFilter, setStrategyFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleDownloadReport = (reportId: number) => {
    generatePropertyReport();
    toast.success("Report downloaded successfully!");
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : sortDirection === 'desc' ? null : 'asc');
      if (sortDirection === 'desc') {
        setSortField('date'); // Reset to default
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4 opacity-50" />;
    if (sortDirection === 'asc') return <ArrowUp className="h-4 w-4" />;
    if (sortDirection === 'desc') return <ArrowDown className="h-4 w-4" />;
    return <ArrowUpDown className="h-4 w-4 opacity-50" />;
  };

  const filteredAndSortedReports = useMemo(() => {
    let filtered = mockReports.filter(report => {
      const matchesSearch = report.address.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStrategy = strategyFilter === 'all' || report.strategy === strategyFilter;
      const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
      return matchesSearch && matchesStrategy && matchesStatus;
    });

    if (sortDirection && sortField) {
      filtered.sort((a, b) => {
        let aValue = a[sortField];
        let bValue = b[sortField];
        
        if (sortField === 'date') {
          aValue = new Date(aValue as string).getTime();
          bValue = new Date(bValue as string).getTime();
        }
        
        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [searchTerm, strategyFilter, statusFilter, sortField, sortDirection]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'default';
      case 'In Progress':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <MainLayout>
      <div className="container py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
            <p className="text-muted-foreground">Manage and download your property analysis reports</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Property Analysis Reports</CardTitle>
            <CardDescription>
              View, filter, and download all your property investment analysis reports
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by address..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={strategyFilter} onValueChange={setStrategyFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Strategy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Strategies</SelectItem>
                  <SelectItem value="Buy-to-Let">Buy-to-Let</SelectItem>
                  <SelectItem value="HMO">HMO</SelectItem>
                  <SelectItem value="Serviced Accommodation">Serviced Accommodation</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">
                      <Button 
                        variant="ghost" 
                        onClick={() => handleSort('address')}
                        className="font-medium px-2 py-1 h-auto"
                      >
                        Property Address
                        {getSortIcon('address')}
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button 
                        variant="ghost" 
                        onClick={() => handleSort('date')}
                        className="font-medium px-2 py-1 h-auto"
                      >
                        <Calendar className="h-4 w-4 mr-1" />
                        Date
                        {getSortIcon('date')}
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button 
                        variant="ghost" 
                        onClick={() => handleSort('strategy')}
                        className="font-medium px-2 py-1 h-auto"
                      >
                        Strategy
                        {getSortIcon('strategy')}
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button 
                        variant="ghost" 
                        onClick={() => handleSort('roi')}
                        className="font-medium px-2 py-1 h-auto"
                      >
                        ROI %
                        {getSortIcon('roi')}
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button 
                        variant="ghost" 
                        onClick={() => handleSort('investment')}
                        className="font-medium px-2 py-1 h-auto"
                      >
                        Investment
                        {getSortIcon('investment')}
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button 
                        variant="ghost" 
                        onClick={() => handleSort('monthlyRental')}
                        className="font-medium px-2 py-1 h-auto"
                      >
                        Monthly Rental
                        {getSortIcon('monthlyRental')}
                      </Button>
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedReports.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        No reports found matching your criteria
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAndSortedReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">{report.address}</TableCell>
                        <TableCell>{formatDate(report.date)}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{report.strategy}</Badge>
                        </TableCell>
                        <TableCell>
                          <span className={`font-semibold ${report.roi >= 8 ? 'text-green-600' : report.roi >= 6 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {report.roi.toFixed(1)}%
                          </span>
                        </TableCell>
                        <TableCell>{formatCurrency(report.investment)}</TableCell>
                        <TableCell>{formatCurrency(report.monthlyRental)}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(report.status)}>
                            {report.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDownloadReport(report.id)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Summary */}
            <div className="mt-6 flex justify-between items-center text-sm text-muted-foreground">
              <span>
                Showing {filteredAndSortedReports.length} of {mockReports.length} reports
              </span>
              <span>
                Average ROI: {filteredAndSortedReports.length > 0 
                  ? (filteredAndSortedReports.reduce((sum, report) => sum + report.roi, 0) / filteredAndSortedReports.length).toFixed(1)
                  : '0'}%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default ReportsPage;
