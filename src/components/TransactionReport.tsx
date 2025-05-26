
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const TransactionReport = () => {
  const [pettyCash, setPettyCash] = useState({
    start: '',
    end: ''
  });
  
  const [expenses, setExpenses] = useState([
    { description: '', amount: '' }
  ]);

  const transactions = [
    { orNumber: 'OR-001', customer: 'Maria Santos', amount: 2500, paymentMode: 'Cash', time: '09:30 AM' },
    { orNumber: 'OR-002', customer: 'John Dela Cruz', amount: 3200, paymentMode: 'GCash', time: '10:15 AM' },
    { orNumber: 'OR-003', customer: 'Ana Rodriguez', amount: 1800, paymentMode: 'Maya', time: '11:00 AM' },
    { orNumber: 'OR-004', customer: 'Pedro Garcia', amount: 4500, paymentMode: 'Credit Card', time: '11:45 AM' }
  ];

  const summary = {
    cash: 7300,
    gcash: 5600,
    maya: 2400,
    creditCard: 4500,
    bankTransfer: 1200
  };

  const addExpense = () => {
    setExpenses([...expenses, { description: '', amount: '' }]);
  };

  const updateExpense = (index: number, field: string, value: string) => {
    const newExpenses = [...expenses];
    newExpenses[index] = { ...newExpenses[index], [field]: value };
    setExpenses(newExpenses);
  };

  const calculateCashTurnover = () => {
    const totalIncome = Object.values(summary).reduce((sum, val) => sum + val, 0);
    const totalExpenses = expenses.reduce((sum, expense) => sum + (parseFloat(expense.amount) || 0), 0);
    const startCash = parseFloat(pettyCash.start) || 0;
    const endCash = parseFloat(pettyCash.end) || 0;
    
    return (startCash + totalIncome) - totalExpenses - endCash;
  };

  return (
    <div className="space-y-6">
      {/* Daily Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Transaction Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">₱{summary.cash.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Cash</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">₱{summary.gcash.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">GCash</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">₱{summary.maya.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Maya</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">₱{summary.creditCard.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Credit Card</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">₱{summary.bankTransfer.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Bank Transfer</div>
            </div>
          </div>
          
          <div className="text-center p-4 bg-primary/10 rounded-lg">
            <div className="text-3xl font-bold text-primary">
              ₱{Object.values(summary).reduce((sum, val) => sum + val, 0).toLocaleString()}
            </div>
            <div className="text-muted-foreground">Total Revenue</div>
          </div>
        </CardContent>
      </Card>

      {/* Petty Cash & Expenses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Petty Cash</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pettyCashStart">Starting Amount</Label>
              <Input
                id="pettyCashStart"
                type="number"
                placeholder="0.00"
                value={pettyCash.start}
                onChange={(e) => setPettyCash({...pettyCash, start: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pettyCashEnd">Ending Amount</Label>
              <Input
                id="pettyCashEnd"
                type="number"
                placeholder="0.00"
                value={pettyCash.end}
                onChange={(e) => setPettyCash({...pettyCash, end: e.target.value})}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expenses</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {expenses.map((expense, index) => (
              <div key={index} className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Description"
                  value={expense.description}
                  onChange={(e) => updateExpense(index, 'description', e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Amount"
                  value={expense.amount}
                  onChange={(e) => updateExpense(index, 'amount', e.target.value)}
                />
              </div>
            ))}
            <Button onClick={addExpense} variant="outline" className="w-full">
              Add Expense
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Cash Turnover */}
      <Card>
        <CardHeader>
          <CardTitle>Cash Turnover Calculation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold">₱{calculateCashTurnover().toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">
              (Petty Cash Start + Total Revenue) - Expenses - Petty Cash End
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Table */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>OR Number</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment Mode</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.orNumber}>
                  <TableCell className="font-medium">{transaction.orNumber}</TableCell>
                  <TableCell>{transaction.customer}</TableCell>
                  <TableCell>₱{transaction.amount.toLocaleString()}</TableCell>
                  <TableCell>{transaction.paymentMode}</TableCell>
                  <TableCell>{transaction.time}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          <div className="mt-4 flex gap-2">
            <Button variant="outline">Export to Excel</Button>
            <Button variant="outline">Export to PDF</Button>
            <Button variant="outline">Export to Google Sheets</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionReport;
