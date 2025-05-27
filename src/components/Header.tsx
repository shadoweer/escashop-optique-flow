
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: string;
}

const Header = ({ activeTab, setActiveTab, userRole }: HeaderProps) => {
  const tabs = [
    { id: 'admin', label: 'Admin Panel' },
    { id: 'display', label: 'Display Monitor' },
    { id: 'notifications', label: 'Notifications Log' },
    { id: 'transactions', label: 'Transaction Logs' }
  ];

  return (
    <div className="bg-white border-b border-gray-200">
      {/* Top Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <img 
            src="/lovable-uploads/cbedd510-5670-4550-8b1b-bf1a1a3bf793.png" 
            alt="EscaShop Logo" 
            className="h-8 w-8 object-contain"
          />
          <div>
            <h1 className="text-lg font-bold">
              <span className="text-orange-500">ESCA</span> <span className="text-gray-700">SHOP</span>
            </h1>
            <p className="text-xs text-gray-500">PREMIUM EYEWEAR</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-gray-600">Internal Use Only</Badge>
          <Badge className="bg-green-500 text-white">System Online</Badge>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-700">Admin User</p>
            <p className="text-xs text-gray-500">Admin</p>
          </div>
        </div>
      </div>
      
      {/* Navigation Tabs */}
      <div className="flex items-center px-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-orange-500 text-orange-500'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Header;
