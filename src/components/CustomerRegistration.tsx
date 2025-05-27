
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
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
    salesAgent: 'Admin User', // ST-204: Auto-assigned based on logged-in user
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

  // ST-206: Grade Type options
  const gradeTypes = [
    'No Grade',
    'Single Grade (SV)',
    'Single Vision-Reading (SV-READING)',
    'Single Vision Hi-Cylinder (SV-HC)',
    'Process Single Vision (PROC-SV)',
    'Progressive (PROG)',
    'Process-Progressive (PROC-PROG)',
    'Doble Vista (KK)',
    'Process Doble Vista (PROC-KK)',
    'Single Vision-Ultra Thin 1.61 (SV-UTH 1.61)',
    'Single Vision-Ultra Thin 1.67 (SV-UTH 1.67)',
    'Flat-Top (F.T)',
    'Process Flat-Top (Proc-F.T)',
    'Ultra-Thin High Cylinder 1.61 (UTH 1.61 HC)',
    'Ultra-Thin High Cylinder 1.67 (UTH 1.67 HC)',
    'Process High Cylinder Ultra Thin 1.61 (PROC-HC-UTH 1.61)',
    'Process High Cylinder Ultra Thin 1.67 (PROC-HC-UTH 1.67)',
    'Other'
  ];

  // ST-207: Lens Type options
  const lensTypes = [
    'Non-coated (ORD)',
    'Anti-radiation (MC)',
    'Photochromic anti-radiation (TRG)',
    'Anti-blue light (BB)',
    'Photochromic anti-blue light (BTS)',
    'Ambermatic tinted (AMB)',
    'Essilor',
    'Hoya'
  ];

  const paymentModes = ['Cash', 'Gcash', 'Maya', 'Bank Transfer', 'Credit Card'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // ST-201: Validation for required fields
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

    // ST-208: Frame Code validation (alphanumeric only)
    if (formData.frameCode && !/^[a-zA-Z0-9]+$/.test(formData.frameCode)) {
      toast({
        title: "Invalid Frame Code",
        description: "Frame Code must contain only letters and numbers",
        variant: "destructive"
      });
      return;
    }

    // ST-213: Auto-generated OR number
    const orNumber = `OR-${Date.now()}`;
    
    // ST-214: Token generation and printing simulation
    const tokenNumber = `T-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    
    toast({
      title: "Customer Registered Successfully",
      description: `OR Number: ${orNumber} | Token: ${tokenNumber} - Token will be printed automatically.`
    });
    
    console.log('Customer Registration Data:', {
      ...formData,
      orNumber,
      tokenNumber,
      registrationTime: new Date().toISOString()
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
      salesAgent: 'Admin User',
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
          <CardTitle className="text-orange-500">Customer Registration</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ST-201: Required Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter customer name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contactNumber">Contact Number *</Label>
                  <Input
                    id="contactNumber"
                    value={formData.contactNumber}
                    onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
                    placeholder="Enter contact number"
                    required
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
                    required
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
                    required
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
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* ST-202: Optional Occupation */}
                <div className="space-y-2">
                  <Label htmlFor="occupation">Occupation</Label>
                  <Input
                    id="occupation"
                    value={formData.occupation}
                    onChange={(e) => setFormData({...formData, occupation: e.target.value})}
                    placeholder="Enter occupation (optional)"
                  />
                </div>
                
                {/* ST-203: Distribution Information */}
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

              {/* ST-204: Sales Agent */}
              <div className="space-y-2">
                <Label htmlFor="salesAgent">Sales Agent</Label>
                <Input
                  id="salesAgent"
                  value={formData.salesAgent}
                  readOnly
                  className="bg-gray-100"
                />
              </div>
            </div>

            {/* ST-205: Prescription Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Prescription Details</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="od">OD (Right Eye)</Label>
                  <Input
                    id="od"
                    value={formData.prescription.od}
                    onChange={(e) => setFormData({...formData, prescription: {...formData.prescription, od: e.target.value}})}
                    placeholder="OD"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="os">OS (Left Eye)</Label>
                  <Input
                    id="os"
                    value={formData.prescription.os}
                    onChange={(e) => setFormData({...formData, prescription: {...formData.prescription, os: e.target.value}})}
                    placeholder="OS"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ou">OU (Both Eyes)</Label>
                  <Input
                    id="ou"
                    value={formData.prescription.ou}
                    onChange={(e) => setFormData({...formData, prescription: {...formData.prescription, ou: e.target.value}})}
                    placeholder="OU"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pd">PD</Label>
                  <Input
                    id="pd"
                    value={formData.prescription.pd}
                    onChange={(e) => setFormData({...formData, prescription: {...formData.prescription, pd: e.target.value}})}
                    placeholder="PD"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="add">ADD</Label>
                  <Input
                    id="add"
                    value={formData.prescription.add}
                    onChange={(e) => setFormData({...formData, prescription: {...formData.prescription, add: e.target.value}})}
                    placeholder="ADD"
                  />
                </div>
              </div>
            </div>

            {/* ST-206 & ST-207: Grade Type and Lens Type */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Lens Specifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gradeType">Grade Type</Label>
                  <Select value={formData.gradeType} onValueChange={(value) => setFormData({...formData, gradeType: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select grade type" />
                    </SelectTrigger>
                    <SelectContent>
                      {gradeTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lensType">Lens Type</Label>
                  <Select value={formData.lensType} onValueChange={(value) => setFormData({...formData, lensType: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select lens type" />
                    </SelectTrigger>
                    <SelectContent>
                      {lensTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* ST-208 & ST-209: Frame Code and Estimated Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="frameCode">Frame Code</Label>
                <Input
                  id="frameCode"
                  value={formData.frameCode}
                  onChange={(e) => setFormData({...formData, frameCode: e.target.value})}
                  placeholder="Alphanumeric only"
                  pattern="[a-zA-Z0-9]*"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="estimatedTime">Estimated Time (minutes)</Label>
                <Input
                  id="estimatedTime"
                  type="number"
                  value={formData.estimatedTime}
                  onChange={(e) => setFormData({...formData, estimatedTime: e.target.value})}
                  placeholder="Enter time in minutes"
                />
              </div>
            </div>

            {/* ST-210: Payment Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Payment Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="paymentMode">Payment Mode</Label>
                  <Select value={formData.paymentInfo.mode} onValueChange={(value) => setFormData({...formData, paymentInfo: {...formData.paymentInfo, mode: value}})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment mode" />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentModes.map((mode) => (
                        <SelectItem key={mode} value={mode}>{mode}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={formData.paymentInfo.amount}
                    onChange={(e) => setFormData({...formData, paymentInfo: {...formData.paymentInfo, amount: e.target.value}})}
                    placeholder="Enter amount"
                  />
                </div>
              </div>
            </div>

            {/* ST-211: Remarks */}
            <div className="space-y-2">
              <Label htmlFor="remarks">Remarks</Label>
              <Textarea
                id="remarks"
                value={formData.remarks}
                onChange={(e) => setFormData({...formData, remarks: e.target.value})}
                placeholder="Enter any additional remarks (optional)"
                rows={3}
              />
            </div>

            {/* ST-212: Priority Queue */}
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
              <Button type="submit" className="flex-1 bg-orange-500 hover:bg-orange-600">
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
