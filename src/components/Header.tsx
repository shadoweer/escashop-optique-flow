
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Users, Monitor, Bell, FileText, Activity, UserCheck, BellRing, LogOut, Home } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: string;
}

const Header = ({ activeTab, setActiveTab, userRole }: HeaderProps) => {
  const { signOut, userProfile } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navItems = [
    { id: 'admin', label: 'Admin Dashboard', icon: Home, roles: ['admin', 'sales_employee', 'cashier'] },
    { id: 'users', label: 'Users', icon: UserCheck, roles: ['admin'] },
    { id: 'notifications-center', label: 'Notification Center', icon: BellRing, roles: ['admin', 'sales_employee'] },
    { id: 'display', label: 'Display Monitor', icon: Monitor, roles: ['admin', 'sales_employee', 'cashier'] },
    { id: 'notifications', label: 'Notifications Log', icon: Bell, roles: ['admin', 'sales_employee'] },
    { id: 'transactions', label: 'Transaction Logs', icon: FileText, roles: ['admin', 'sales_employee'] },
    { id: 'activity', label: 'Activity Log', icon: Activity, roles: ['admin', 'sales_employee'] },
  ];

  const visibleNavItems = navItems.filter(item => item.roles.includes(userRole));

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'admin': return '🔧 System Administrator';
      case 'sales_employee': return '👤 Sales Employee';
      case 'cashier': return '💰 Cashier';
      default: return '👁️ User';
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/cbedd510-5670-4550-8b1b-bf1a1a3bf793.png" 
                alt="Esca Optical" 
                className="h-10 w-auto"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  <span className="text-orange-500">ESCA</span> <span className="text-gray-700">SHOP</span>
                </h1>
                <p className="text-xs text-gray-500">PREMIUM EYEWEAR</p>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="text-xs">
              Internal Use Only
            </Badge>
            <Badge className="bg-green-500 text-white text-xs">
              System Online
            </Badge>
          </div>

          {/* User Info */}
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-800">
                {getRoleDisplayName(userProfile?.role || '')}
              </p>
              <p className="text-xs text-gray-500">Staff</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-4">
          <div className="flex space-x-1">
            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 ${
                    activeTab === item.id 
                      ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Button>
              );
            })}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
