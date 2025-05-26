
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Sidebar from '@/components/Sidebar';
import CustomerRegistration from '@/components/CustomerRegistration';
import QueueDisplay from '@/components/QueueDisplay';
import TransactionReport from '@/components/TransactionReport';

const Dashboard = () => {
  const [activeView, setActiveView] = useState('overview');
  const [userRole] = useState('admin'); // TODO: Get from auth context

  const renderMainContent = () => {
    switch (activeView) {
      case 'register':
        return <CustomerRegistration />;
      case 'queue':
        return <QueueDisplay />;
      case 'transactions':
        return <TransactionReport />;
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Customers Waiting</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">
                  Average wait: 15 minutes
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Currently Serving</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4</div>
                <p className="text-xs text-muted-foreground">
                  Across all counters
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Priority Queue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <div className="flex gap-1 mt-2">
                  <Badge variant="secondary">Senior</Badge>
                  <Badge variant="secondary">PWD</Badge>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₱25,480</div>
                <p className="text-xs text-muted-foreground">
                  +12% from yesterday
                </p>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex w-full">
      <Sidebar activeView={activeView} setActiveView={setActiveView} userRole={userRole} />
      
      <main className="flex-1 p-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight">EscaShop Optical Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your optical store operations efficiently
            </p>
          </div>
          
          {renderMainContent()}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
