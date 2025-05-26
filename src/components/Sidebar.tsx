
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  userRole: string;
}

const Sidebar = ({ activeView, setActiveView, userRole }: SidebarProps) => {
  const menuItems = [
    { id: 'overview', label: 'Overview', roles: ['admin', 'sales', 'cashier'] },
    { id: 'register', label: 'Register Customer', roles: ['admin', 'sales'] },
    { id: 'queue', label: 'Queue Management', roles: ['admin', 'sales', 'cashier'] },
    { id: 'notifications', label: 'Notifications', roles: ['admin'] },
    { id: 'transactions', label: 'Transactions', roles: ['admin', 'cashier'] },
    { id: 'reports', label: 'Reports', roles: ['admin', 'cashier'] },
    { id: 'activity-log', label: 'Activity Log', roles: ['admin', 'cashier'] },
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(userRole));

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-primary">EscaShop</h2>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant={userRole === 'admin' ? 'default' : 'secondary'}>
            {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
          </Badge>
        </div>
      </div>
      
      <nav className="space-y-2">
        {filteredItems.map((item) => (
          <Button
            key={item.id}
            variant={activeView === item.id ? 'default' : 'ghost'}
            className="w-full justify-start"
            onClick={() => setActiveView(item.id)}
          >
            {item.label}
          </Button>
        ))}
      </nav>
      
      <div className="absolute bottom-4 left-4 right-4">
        <Card className="p-3">
          <div className="text-sm text-center">
            <p className="font-medium">Quick Actions</p>
            <Button variant="outline" size="sm" className="w-full mt-2">
              Emergency Call
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Sidebar;
