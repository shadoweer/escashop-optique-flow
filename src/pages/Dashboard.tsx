
import React, { useState } from 'react';
import Header from '@/components/Header';
import QueueManagement from '@/components/QueueManagement';
import DisplayMonitor from '@/components/DisplayMonitor';
import NotificationSystem from '@/components/NotificationSystem';
import TransactionLogs from '@/components/TransactionLogs';
import ActivityLog from '@/components/ActivityLog';
import UserManagement from '@/components/UserManagement';
import NotificationCenter from '@/components/NotificationCenter';
import { CustomerProvider } from '@/contexts/CustomerContext';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('admin');
  const { userProfile } = useAuth();

  const renderMainContent = () => {
    switch (activeTab) {
      case 'admin':
        return <QueueManagement />;
      case 'users':
        return <UserManagement />;
      case 'notifications-center':
        return <NotificationCenter />;
      case 'display':
        return <DisplayMonitor />;
      case 'notifications':
        return <NotificationSystem />;
      case 'transactions':
        return <TransactionLogs />;
      case 'activity':
        return <ActivityLog />;
      default:
        return <QueueManagement />;
    }
  };

  return (
    <CustomerProvider>
      <div className="min-h-screen bg-gray-50">
        <Header 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          userRole={userProfile?.role || 'viewer'} 
        />
        
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            {renderMainContent()}
          </div>
        </main>
        
        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 p-4">
          <div className="max-w-7xl mx-auto text-center text-sm text-gray-500">
            © 2025 Esca Optical - Queue Management System | {userProfile?.role?.toUpperCase()} Access
          </div>
        </footer>
      </div>
    </CustomerProvider>
  );
};

export default Dashboard;
