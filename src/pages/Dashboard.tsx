
import React, { useState } from 'react';
import Header from '@/components/Header';
import QueueManagement from '@/components/QueueManagement';
import DisplayMonitor from '@/components/DisplayMonitor';
import NotificationSystem from '@/components/NotificationSystem';
import TransactionLogs from '@/components/TransactionLogs';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('admin');
  const [userRole] = useState('admin');

  const renderMainContent = () => {
    switch (activeTab) {
      case 'admin':
        return <QueueManagement />;
      case 'display':
        return <DisplayMonitor />;
      case 'notifications':
        return <NotificationSystem />;
      case 'transactions':
        return <TransactionLogs />;
      default:
        return <QueueManagement />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} userRole={userRole} />
      
      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          {renderMainContent()}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 p-4">
        <div className="max-w-7xl mx-auto text-center text-sm text-gray-500">
          © 2025 Esca Optical - Queue Management System | Admin Access
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
