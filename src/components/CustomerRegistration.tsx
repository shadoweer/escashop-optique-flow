
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

const CustomerRegistration = () => {
  const [formData, setFormData] = useState({
    name: '',
    contactNumber: '',
    email: '',
    age: '',
    address: '',
    occupation: '',
    distribution: '',
    prescription: {
      od: '',
      os: '',
      ou: '',
      pd: '',
      add: ''
    },
    gradeType: '',
    lensType: '',
    frameCode: '',
    estimatedTime: '',
    paymentInfo: {
      mode: '',
      amount: ''
    },
    remarks: '',
    priority: {
      seniorCitizen: false,
      pregnant: false,
      pwd: false
    }
  });

  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const requiredFields = ['name', 'contactNumber', 'email', 'age', 'address'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Missing Required Fields",
        description: `Please fill in: ${missingFields.join(', ')}`,
        variant: "destructive"
      });
      return;
    }

    // TODO: Submit to backend
    const orNumber = `OR-${Date.now()}`;
    toast({
      title: "Customer Registered Successfully",
      description: `OR Number: ${orNumber}. Token will be printed.`
    });
    
    // Reset form
    setFormData({
      name: '',
      contactNumber: '',
      email: '',
      age: '',
      address: '',
      occupation: '',
      distribution: '',
      prescription: { od: '', os: '', ou: '', pd: '', add: '' },
      gradeType: '',
      lensType: '',
      frameCode: '',
      estimatedTime: '',
      paymentInfo: { mode: '', amount: '' },
      remarks: '',
      priority: { seniorCitizen: false, pregnant: false, pwd: false }
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Customer Registration</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter customer name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contactNumber">Contact Number *</Label>
                <Input
                  id="contactNumber"
                  value={formData.contactNumber}
                  onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
                  placeholder="Enter contact number"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="Enter email address"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="age">Age *</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                  placeholder="Enter age"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                placeholder="Enter complete address"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="occupation">Occupation</Label>
                <Input
                  id="occupation"
                  value={formData.occupation}
                  onChange={(e) => setFormData({...formData, occupation: e.target.value})}
                  placeholder="Enter occupation (optional)"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="distribution">Distribution Method</Label>
                <Select value={formData.distribution} onValueChange={(value) => setFormData({...formData, distribution: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select distribution method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pickup">Pick Up</SelectItem>
                    <SelectItem value="lalamove">Lalamove</SelectItem>
                    <SelectItem value="lbc">LBC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Priority Queue */}
            <div className="space-y-3">
              <Label>Priority Queue (if applicable)</Label>
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="seniorCitizen"
                    checked={formData.priority.seniorCitizen}
                    onCheckedChange={(checked) => 
                      setFormData({
                        ...formData, 
                        priority: {...formData.priority, seniorCitizen: !!checked}
                      })
                    }
                  />
                  <Label htmlFor="seniorCitizen">Senior Citizen</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="pregnant"
                    checked={formData.priority.pregnant}
                    onCheckedChange={(checked) => 
                      setFormData({
                        ...formData, 
                        priority: {...formData.priority, pregnant: !!checked}
                      })
                    }
                  />
                  <Label htmlFor="pregnant">Pregnant</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="pwd"
                    checked={formData.priority.pwd}
                    onCheckedChange={(checked) => 
                      setFormData({
                        ...formData, 
                        priority: {...formData.priority, pwd: !!checked}
                      })
                    }
                  />
                  <Label htmlFor="pwd">PWD</Label>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="button" variant="outline" className="flex-1">
                Save as Draft
              </Button>
              <Button type="submit" className="flex-1">
                Register Customer & Print Token
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerRegistration;
