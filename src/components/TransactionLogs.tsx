
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import TransactionReport from './TransactionReport';

const TransactionLogs = () => {
  const [activeTimeframe, setActiveTimeframe] = useState('Day');
  const [showReport, setShowReport] = useState(false);

  const timeframes = ['Day', 'Week', 'Month'];

  const transactions = [
    {
      id: 'TRX-1001',
      orNumber: '250516-7421',
      customer: 'Abner Escano',
      salesAgent: 'Mel',
      service: 'Non-Coated Lenses (ORD)',
      amount: 120.00,
      paymentMode: 'GCash',
      date: '4/16/2025 8:45:12 AM',
      status: 'Completed'
    },
    {
      id: 'TRX-1000',
      orNumber: '250516-3891',
      customer: 'Maria Santos',
      salesAgent: 'Ace',
      service: 'Frame Adjustment',
      amount: 25.00,
      paymentMode: 'Cash',
      date: '4/16/2025 8:30:45 AM',
      status: 'Pending'
    },
    {
      id: 'TRX-999',
      orNumber: '250515-4278',
      customer: 'John Doe',
      salesAgent: 'Eric',
      service: 'Eye Exam + Glasses',
      amount: 250.00,
      paymentMode: 'Maya',
      date: '4/15/2025 4:12:33 PM',
      status: 'Completed'
    },
    {
      id: 'TRX-998',
      orNumber: '250515-1234',
      customer: 'Ana Rodriguez',
      salesAgent: 'Jil',
      service: 'Progressive Lenses',
      amount: 4500.00,
      paymentMode: 'Credit Card',
      date: '4/15/2025 2:15:20 PM',
      status: 'Completed'
    },
    {
      id: 'TRX-997',
      orNumber: '250515-5678',
      customer: 'Pedro Garcia',
      salesAgent: 'Shella',
      service: 'Anti-radiation Coating',
      amount: 1800.00,
      paymentMode: 'Bank Transfer',
      date: '4/15/2025 11:30:15 AM',
      status: 'Completed'
    }
  ];

  const summary = {
    cash: 20560.00,
    ecash: 0.00,
    creditCard: 5370.00,
    bankTransfer: 8000.00,
    expenses: 0.00,
    totalSales: 33930.00
  };

  const exportToExcel = () => {
    console.log('Exporting to Excel...');
    // Implementation for Excel export
  };

  const exportToPDF = () => {
    console.log('Exporting to PDF...');
    // Implementation for PDF export
  };

  const exportToGoogleSheets = () => {
    console.log('Exporting to Google Sheets...');
    // Implementation for Google Sheets export
  };

  if (showReport) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={() => setShowReport(false)}
          >
            ← Back to Logs
          </Button>
          <h1 className="text-2xl font-bold text-gray-800">Financial Report</h1>
        </div>
        <TransactionReport />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Transaction Logs</h1>
      
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Transaction Summary</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportToExcel}>Export to Excel</Button>
          <Button variant="outline" onClick={exportToPDF}>Export to PDF</Button>
          <Button variant="outline" onClick={exportToGoogleSheets}>Export to Google Sheets</Button>
          <Button 
            className="bg-orange-500 hover:bg-orange-600 text-white"
            onClick={() => setShowReport(true)}
          >
            💰 Financial Report
          </Button>
          <Button variant="outline">Refresh</Button>
        </div>
      </div>

      {/* Timeframe Selector */}
      <div className="flex bg-gray-50 rounded-lg p-1 max-w-md">
        {timeframes.map((timeframe) => (
          <button
            key={timeframe}
            onClick={() => setActiveTimeframe(timeframe)}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTimeframe === timeframe
                ? 'bg-white text-gray-800 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {timeframe}
          </button>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-6 gap-4">
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">₱{summary.cash.toLocaleString()}</div>
            <div className="text-sm text-green-700">Cash Payments</div>
          </CardContent>
        </Card>
        
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">₱{summary.ecash.toLocaleString()}</div>
            <div className="text-sm text-blue-700">E-Cash Payments</div>
          </CardContent>
        </Card>
        
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">₱{summary.creditCard.toLocaleString()}</div>
            <div className="text-sm text-purple-700">Credit Card</div>
          </CardContent>
        </Card>
        
        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600 mb-1">₱{summary.bankTransfer.toLocaleString()}</div>
            <div className="text-sm text-orange-700">Bank Transfer</div>
          </CardContent>
        </Card>
        
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600 mb-1">₱{summary.expenses.toLocaleString()}</div>
            <div className="text-sm text-red-700">Expenses</div>
          </CardContent>
        </Card>
        
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600 mb-1">₱{summary.totalSales.toLocaleString()}</div>
            <div className="text-sm text-orange-700">Total Sales</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Transactions</h3>
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>OR Number</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Sales Agent</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment Mode</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">{transaction.id}</TableCell>
                    <TableCell>{transaction.orNumber}</TableCell>
                    <TableCell>{transaction.customer}</TableCell>
                    <TableCell>{transaction.salesAgent}</TableCell>
                    <TableCell>{transaction.service}</TableCell>
                    <TableCell>₱{transaction.amount.toLocaleString()}</TableCell>
                    <TableCell>{transaction.paymentMode}</TableCell>
                    <TableCell className="text-sm">{transaction.date}</TableCell>
                    <TableCell>
                      <Badge className={
                        transaction.status === 'Completed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }>
                        {transaction.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TransactionLogs;
