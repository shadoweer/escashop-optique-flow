
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!credentials.email || !credentials.password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Login Successful",
      description: "Welcome to EscaShop Optical Queue Management System!"
    });
    
    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md shadow-lg border">
        <CardHeader className="text-center pb-8">
          <div className="flex justify-center mb-6">
            <img 
              src="/lovable-uploads/cbedd510-5670-4550-8b1b-bf1a1a3bf793.png" 
              alt="EscaShop Logo" 
              className="h-16 w-auto object-contain"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">
            <span className="text-orange-500">ESCA</span> <span className="text-gray-700">SHOP</span>
          </CardTitle>
          <CardDescription className="text-gray-500 text-sm">PREMIUM EYEWEAR</CardDescription>
          <div className="mt-4">
            <h2 className="text-lg font-semibold text-gray-800">Queue Management System</h2>
            <p className="text-gray-500 text-sm">Sign in to access the system</p>
          </div>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={credentials.email}
                onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                className="border-gray-300"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                className="border-gray-300"
              />
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-2 pt-6">
            <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2.5">
              Sign in
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
