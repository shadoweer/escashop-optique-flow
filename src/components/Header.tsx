
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: string;
}

const Header = ({ activeTab, setActiveTab, userRole }: HeaderProps) => {
  const { userProfile, signOut } = useAuth();
  
  const tabs = [
    { id: 'admin', label: 'Admin Panel', roles: ['admin'] },
    { id: 'display', label: 'Display Monitor', roles: ['admin', 'staff', 'viewer'] },
    { id: 'notifications', label: 'Notifications Log', roles: ['admin', 'staff'] },
    { id: 'transactions', label: 'Transaction Logs', roles: ['admin', 'staff'] }
  ];

  const filteredTabs = tabs.filter(tab => 
    userProfile ? tab.roles.includes(userProfile.role) : false
  );

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
          
          {userProfile && (
            <div className="flex items-center gap-2">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {userProfile.full_name}
                </p>
                <p className="text-xs text-gray-500 capitalize">{userProfile.role}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={signOut}
                className="text-gray-500 hover:text-gray-700"
                title="Sign Out"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {/* Navigation Tabs */}
      <div className="flex items-center px-6">
        {filteredTabs.map((tab) => (
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
