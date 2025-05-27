
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const QueueManagement = () => {
  const [activeSubTab, setActiveSubTab] = useState('queue');

  const subTabs = [
    { id: 'queue', label: 'Queue Management' },
    { id: 'register', label: 'Customer Registration' },
    { id: 'customers', label: 'Registered Customers' }
  ];

  const renderContent = () => {
    switch (activeSubTab) {
      case 'queue':
        return (
          <div className="space-y-6">
            {/* Queue Statistics Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">Queue Statistics</h2>
              <div className="flex gap-2">
                <Button variant="outline" className="text-red-500 border-red-500 hover:bg-red-50">
                  Reset Queue
                </Button>
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                  Call Next
                </Button>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-4 gap-4">
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">0</div>
                  <div className="text-sm text-blue-700">Customers Waiting</div>
                </CardContent>
              </Card>
              
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">0</div>
                  <div className="text-sm text-green-700">Currently Serving</div>
                </CardContent>
              </Card>
              
              <Card className="bg-yellow-50 border-yellow-200">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-yellow-600 mb-2">0</div>
                  <div className="text-sm text-yellow-700">Priority Customers</div>
                </CardContent>
              </Card>
              
              <Card className="bg-purple-50 border-purple-200">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">0</div>
                  <div className="text-sm text-purple-700">Avg. Wait (mins)</div>
                </CardContent>
              </Card>
            </div>

            {/* Customer Queue List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">Customer Queue List</h3>
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                  Call Next
                </Button>
              </div>
              
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="text-gray-500">
                    No customers in queue. Register customers to see them here.
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case 'register':
        return <div>Customer Registration Form will go here</div>;
      case 'customers':
        return <div>Registered Customers Table will go here</div>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
      
      {/* Sub Navigation */}
      <div className="flex bg-gray-50 rounded-lg p-1">
        {subTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeSubTab === tab.id
                ? 'bg-white text-gray-800 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {renderContent()}
    </div>
  );
};

export default QueueManagement;
