
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const TransactionLogs = () => {
  const [activeTimeframe, setActiveTimeframe] = useState('Day');

  const timeframes = ['Day', 'Week', 'Month'];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Transaction Logs</h1>
      
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Transaction Summary</h2>
        <div className="flex gap-2">
          <Button variant="outline">Export Log</Button>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">💰 Financial Report</Button>
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
            <div className="text-2xl font-bold text-green-600 mb-1">₱20560.00</div>
            <div className="text-sm text-green-700">Cash Payments</div>
          </CardContent>
        </Card>
        
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">₱0.00</div>
            <div className="text-sm text-blue-700">E-Cash Payments</div>
          </CardContent>
        </Card>
        
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">₱5370.00</div>
            <div className="text-sm text-purple-700">Credit Card</div>
          </CardContent>
        </Card>
        
        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600 mb-1">₱8000.00</div>
            <div className="text-sm text-orange-700">Bank Transfer</div>
          </CardContent>
        </Card>
        
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600 mb-1">₱0.00</div>
            <div className="text-sm text-red-700">Expenses</div>
          </CardContent>
        </Card>
        
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600 mb-1">₱33930.00</div>
            <div className="text-sm text-orange-700">Total Sales</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Transactions</h3>
        <Card>
          <CardContent className="p-0">
            <div className="overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">OR Number</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sales Agent</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Mode</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">TRX-1001</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">250516-7421</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Abner Escano</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Mel</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Non-Coated Lenses (ORD)</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₱120.00</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">GCash</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">4/16/2025 8:45:12 AM</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className="bg-green-100 text-green-800">Completed</Badge>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">TRX-1000</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">250516-3891</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Maria Santos</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Ace</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Frame Adjustment</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₱25.00</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Cash</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">4/16/2025 8:30:45 AM</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">TRX-999</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">250515-4278</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">John Doe</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Eric</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Eye Exam + Glasses</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₱250.00</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Maya</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">4/15/2025 4:12:33 PM</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className="bg-green-100 text-green-800">Completed</Badge>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TransactionLogs;
