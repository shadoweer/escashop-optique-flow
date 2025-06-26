
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, AlertTriangle } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'sales_employee' | 'cashier';
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, userProfile, loading, hasRole } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Access Denied</h2>
            <p className="text-gray-600">Please log in to access this page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (requiredRole && !hasRole(requiredRole)) {
    const getRoleDisplayName = (role: string) => {
      switch (role) {
        case 'admin': return 'Administrator';
        case 'sales_employee': return 'Sales Employee';
        case 'cashier': return 'Cashier';
        default: return role;
      }
    };

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Insufficient Permissions</h2>
            <p className="text-gray-600">
              You need {getRoleDisplayName(requiredRole)} role to access this page.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Current role: {getRoleDisplayName(userProfile?.role || 'Unknown')}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
