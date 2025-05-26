
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
    role: ''
  });
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!credentials.username || !credentials.password || !credentials.role) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }
    
    // TODO: Implement actual authentication
    toast({
      title: "Login Successful",
      description: `Welcome, ${credentials.role}!`
    });
    
    // Redirect to dashboard based on role
    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary via-secondary/90 to-primary/20">
      <Card className="w-full max-w-md shadow-2xl border-0">
        <CardHeader className="text-center pb-8">
          <div className="flex justify-center mb-6">
            <img 
              src="/lovable-uploads/078f4c64-ec17-4abe-bd79-a4a92e22bbfe.png" 
              alt="EscaShop Logo" 
              className="h-24 w-24 object-contain"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-primary">EscaShop Optical</CardTitle>
          <CardDescription className="text-secondary/80 font-medium">Queue Management System</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="role" className="text-secondary font-medium">Role</Label>
              <Select value={credentials.role} onValueChange={(value) => setCredentials({...credentials, role: value})}>
                <SelectTrigger className="border-2 focus:border-primary">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="sales">Sales Employee</SelectItem>
                  <SelectItem value="cashier">Cashier</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="username" className="text-secondary font-medium">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={credentials.username}
                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                className="border-2 focus:border-primary"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-secondary font-medium">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                className="border-2 focus:border-primary"
              />
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-2 pt-6">
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2.5">
              Login
            </Button>
            <Button variant="link" type="button" className="text-primary hover:text-primary/80">
              Forgot Password?
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
