
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Users, Clock, Shield, BarChart3 } from 'lucide-react';
import UserProfile from '@/components/UserProfile';

const Index = () => {
  const { user, userProfile, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <img 
              src="/lovable-uploads/fc3992ba-920e-4e7e-b17e-1cf44eff1537.png" 
              alt="Esca Shop Premium Eyewear" 
              className="h-24 w-24 rounded-full object-cover"
            />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            <span className="text-orange-500">ESCA</span> <span className="text-gray-700">SHOP</span>
          </h1>
          <p className="text-gray-600 text-lg">Premium Eyewear Queue Management System</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* System Features */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">System Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-orange-500" />
                    Customer Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Register customers, manage queue priorities, and track service progress in real-time.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-500" />
                    Real-time Queue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Monitor wait times, call customers to counters, and optimize service efficiency.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-500" />
                    Role-based Access
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Secure authentication with admin, staff, and viewer roles for controlled access.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-purple-500" />
                    Analytics & Reports
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Track performance metrics, generate reports, and monitor system activity.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* User Section */}
          <div>
            {user && userProfile ? (
              <div className="space-y-4">
                <UserProfile />
                <Button 
                  onClick={() => navigate('/dashboard')}
                  className="w-full bg-orange-500 hover:bg-orange-600"
                >
                  Go to Dashboard
                </Button>
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Staff Access</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">
                    Sign in to access the queue management system.
                  </p>
                  <div className="space-y-2">
                    <Button 
                      onClick={() => navigate('/auth')}
                      className="w-full bg-orange-500 hover:bg-orange-600"
                    >
                      Staff Sign In
                    </Button>
                    <p className="text-xs text-gray-500 text-center">
                      For authorized staff members only
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-500">
            © 2025 Esca Optical - Queue Management System
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
