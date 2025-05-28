
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User, Mail, Calendar, Shield } from 'lucide-react';

const UserProfile = () => {
  const { userProfile, signOut } = useAuth();

  if (!userProfile) {
    return null;
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'staff':
        return 'default';
      case 'viewer':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getRoleDescription = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Full system access and user management';
      case 'staff':
        return 'Customer management and queue operations';
      case 'viewer':
        return 'Read-only access to system data';
      default:
        return 'Unknown role';
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          User Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-500" />
            <div>
              <p className="font-medium">{userProfile.full_name}</p>
              <p className="text-sm text-gray-500">Full Name</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-gray-500" />
            <div>
              <p className="font-medium">{userProfile.email}</p>
              <p className="text-sm text-gray-500">Email Address</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-gray-500" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Badge variant={getRoleBadgeVariant(userProfile.role)}>
                  {userProfile.role.toUpperCase()}
                </Badge>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {getRoleDescription(userProfile.role)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <div>
              <p className="font-medium">
                {new Date(userProfile.created_at).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-500">Member Since</p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <Button
            onClick={signOut}
            variant="outline"
            className="w-full flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfile;
