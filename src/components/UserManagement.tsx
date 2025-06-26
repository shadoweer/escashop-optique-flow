
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { User, UserPlus, Mail, Shield } from 'lucide-react';

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'sales_employee' | 'cashier';
  created_at: string;
}

const UserManagement = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    fullName: '',
    role: 'sales_employee' as 'admin' | 'sales_employee' | 'cashier'
  });
  const [isCreating, setIsCreating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  const { hasRole } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: 'admin' | 'sales_employee' | 'cashier') => {
    try {
      // Update profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (profileError) throw profileError;

      // Update user_roles table
      const { error: roleError } = await supabase
        .from('user_roles')
        .update({ role: newRole })
        .eq('user_id', userId);

      if (roleError) throw roleError;

      toast({
        title: "Success",
        description: "User role updated successfully"
      });

      fetchUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive"
      });
    }
  };

  const createUser = async () => {
    if (!newUser.email || !newUser.password || !newUser.fullName) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: newUser.email,
        password: newUser.password,
        options: {
          data: {
            full_name: newUser.fullName,
          },
        },
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "User created successfully!"
      });

      setNewUser({ email: '', password: '', fullName: '', role: 'sales_employee' });
      setDialogOpen(false);
      fetchUsers();
    } catch (error: any) {
      console.error('Error creating user:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'sales_employee': return 'default';
      case 'cashier': return 'secondary';
      default: return 'outline';
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'admin': return 'Admin';
      case 'sales_employee': return 'Sales Employee';
      case 'cashier': return 'Cashier';
      default: return role;
    }
  };

  if (!hasRole('admin')) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-gray-600">Only administrators can access user management.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
          <p className="text-gray-600">Manage user accounts and roles</p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Create User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={newUser.fullName}
                  onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  placeholder="Enter password"
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select value={newUser.role} onValueChange={(value: 'admin' | 'sales_employee' | 'cashier') => setNewUser({ ...newUser, role: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="sales_employee">Sales Employee</SelectItem>
                    <SelectItem value="cashier">Cashier</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={createUser} disabled={isCreating} className="w-full">
                {isCreating ? 'Creating...' : 'Create User'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            System Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
              <p className="text-gray-500 mt-2">Loading users...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.full_name}</TableCell>
                    <TableCell className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      {user.email}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getRoleBadgeVariant(user.role)}>
                        {getRoleDisplayName(user.role)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(user.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={user.role}
                        onValueChange={(newRole: 'admin' | 'sales_employee' | 'cashier') => 
                          updateUserRole(user.id, newRole)
                        }
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="sales_employee">Sales Employee</SelectItem>
                          <SelectItem value="cashier">Cashier</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">Demo Account Credentials</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-semibold text-red-600 mb-2">👑 Admin Account</h4>
              <p className="text-sm"><strong>Email:</strong> admin@escaoptical.com</p>
              <p className="text-sm"><strong>Password:</strong> admin123</p>
              <p className="text-xs text-gray-500 mt-2">Full system access</p>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-semibold text-blue-600 mb-2">👥 Sales Employee</h4>
              <p className="text-sm"><strong>Email:</strong> staff@escaoptical.com</p>
              <p className="text-sm"><strong>Password:</strong> staff123</p>
              <p className="text-xs text-gray-500 mt-2">Customer & queue management</p>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-semibold text-green-600 mb-2">💰 Cashier Account</h4>
              <p className="text-sm"><strong>Email:</strong> viewer@escaoptical.com</p>
              <p className="text-sm"><strong>Password:</strong> viewer123</p>
              <p className="text-xs text-gray-500 mt-2">Transaction processing</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
