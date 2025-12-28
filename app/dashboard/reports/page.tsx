'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  Download, 
  Calendar,
  Search,
  Filter,
  MoreHorizontal,
  Shield,
  CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// Mock reports data
const mockReports = [
  {
    id: 'STR-2024-001847',
    deal_id: 'STN-2024-001847',
    type: 'vessel_to_tank',
    status: 'verified',
    commodity: 'Diesel',
    volume: 50000,
    buyer: 'EuroFuel Distributors',
    seller: 'Gulf Energy Corp',
    generated_at: '2024-12-28T10:30:00Z',
    value: 43750000,
  },
  {
    id: 'STR-2024-001823',
    deal_id: 'STN-2024-001823',
    type: 'tank_to_vessel',
    status: 'verified',
    commodity: 'Jet Fuel',
    volume: 35000,
    buyer: 'Emirates Aviation Fuel',
    seller: 'Singapore Partners',
    generated_at: '2024-12-25T14:20:00Z',
    value: 31937500,
  },
  {
    id: 'STR-2024-001798',
    deal_id: 'STN-2024-001798',
    type: 'vessel_to_tank',
    status: 'pending',
    commodity: 'Gasoline',
    volume: 75000,
    buyer: 'Nigeria National Petroleum',
    seller: 'Petro Global Trading',
    generated_at: '2024-12-22T09:15:00Z',
    value: 59812500,
  },
];

export default function ReportsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredReports = mockReports.filter(r => 
    r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.commodity.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.buyer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Staunton Reports</h1>
          <p className="text-sm text-muted-foreground mt-1">Blockchain-verified transaction dossiers</p>
        </div>
      </div>

      {/* Info Banner */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Shield size={20} className="text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">Verified Reports</p>
            <p className="text-xs text-muted-foreground">
              All Staunton Reports are cryptographically signed and stored on-chain for immutability.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Search & Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search reports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter size={14} className="mr-2" />
          Filters
        </Button>
      </div>

      {/* Reports Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-medium">Report ID</TableHead>
                <TableHead className="font-medium">Type</TableHead>
                <TableHead className="font-medium">Commodity</TableHead>
                <TableHead className="font-medium">Parties</TableHead>
                <TableHead className="font-medium">Status</TableHead>
                <TableHead className="font-medium text-right">Value</TableHead>
                <TableHead className="font-medium">Date</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>
                    <Link href={`/dashboard/reports/${report.deal_id}`} className="text-primary hover:underline font-mono text-sm">
                      {report.id}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-normal">
                      {report.type.replace(/_/g, ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{report.commodity}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p className="text-foreground">{report.buyer}</p>
                      <p className="text-xs text-muted-foreground">from {report.seller}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={report.status === 'verified' ? 'outline' : 'secondary'} className="font-normal">
                      {report.status === 'verified' && <CheckCircle size={10} className="mr-1 text-green-500" />}
                      {report.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium tabular-nums">
                    {formatCurrency(report.value)}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {formatDate(report.generated_at)}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Download size={14} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}


