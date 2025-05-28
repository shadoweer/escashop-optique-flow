
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, Download, Filter, Search, Calendar, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useCustomers } from '@/contexts/CustomerContext';

interface Transaction {
  id: string;
  customerId: string;
  customerName: string;
  token: string;
  orNumber: string;
  amount: string;
  paymentMode: string;
  status: 'pending' | 'completed' | 'cancelled';
  timestamp: Date;
  description: string;
}

const TransactionLogs = () => {
  const { customers } = useCustomers();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed' | 'cancelled'>('all');

  // Convert customers to transactions
  const transactions: Transaction[] = customers
    .filter(customer => customer.paymentInfo.amount && customer.paymentInfo.mode)
    .map(customer => ({
      id: customer.id,
      customerId: customer.id,
      customerName: customer.name,
      token: customer.token,
      orNumber: customer.orNumber,
      amount: customer.paymentInfo.amount,
      paymentMode: customer.paymentInfo.mode,
      status: customer.status === 'completed' ? 'completed' : 'pending' as const,
      timestamp: customer.registrationTime,
      description: `Optical services - ${customer.gradeType} ${customer.lensType}`
    }));

  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.token.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.orNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || transaction.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const exportTransactions = () => {
    setLoading(true);
    try {
      // This would generate and download a report
      console.log('Exporting transactions:', filteredTransactions);
      // Simulate export process
      setTimeout(() => {
        setLoading(false);
        console.log('Export completed');
      }, 2000);
    } catch (error) {
      console.error('Export failed:', error);
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateTotals = () => {
    const total = filteredTransactions.reduce((sum, t) => sum + parseFloat(t.amount || '0'), 0);
    const completed = filteredTransactions.filter(t => t.status === 'completed').length;
    const pending = filteredTransactions.filter(t => t.status === 'pending').length;
    
    return { total, completed, pending };
  };

  const { total, completed, pending } = calculateTotals();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Transaction Logs</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportTransactions} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Download className="h-4 w-4 mr-2" />}
            Export Report
          </Button>
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Date Range
          </Button>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">₱{total.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Total Revenue</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{filteredTransactions.length}</div>
            <div className="text-sm text-muted-foreground">Total Transactions</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{completed}</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{pending}</div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by customer name, token, or OR number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              {['all', 'pending', 'completed', 'cancelled'].map((status) => (
                <Button
                  key={status}
                  variant={filterStatus === status ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus(status as any)}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Transaction History ({filteredTransactions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No transactions found</p>
              {searchTerm && (
                <p className="text-sm text-gray-400">Try adjusting your search criteria</p>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Token</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>OR Number</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment Mode</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-mono text-sm">
                      {transaction.timestamp.toLocaleString()}
                    </TableCell>
                    <TableCell className="font-medium">{transaction.token}</TableCell>
                    <TableCell>{transaction.customerName}</TableCell>
                    <TableCell className="font-mono">{transaction.orNumber}</TableCell>
                    <TableCell className="font-semibold">₱{parseFloat(transaction.amount).toLocaleString()}</TableCell>
                    <TableCell>{transaction.paymentMode}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(transaction.status)}>
                        {transaction.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate" title={transaction.description}>
                      {transaction.description}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-blue-800">
            <FileText className="h-4 w-4" />
            <span className="text-sm font-medium">
              Transaction data is automatically generated from customer records and payment information
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionLogs;
