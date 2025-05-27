import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Clock, AlertTriangle, ArrowUp, ArrowDown, FileText } from 'lucide-react';
import CustomerRegistration from './CustomerRegistration';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Customer {
  id: string;
  name: string;
  contactNumber: string;
  email: string;
  age: number;
  address: string;
  occupation: string;
  distribution: string;
  salesAgent: string;
  assignedDoctor: string;
  prescription: {
    od: string;
    os: string;
    ou: string;
    pd: string;
    add: string;
  };
  gradeType: string;
  lensType: string;
  frameCode: string;
  paymentInfo: {
    mode: string;
    amount: string;
  };
  remarks: string;
  token: string;
  priority: boolean;
  priorityType?: string;
  waitTime: number;
  status: 'waiting' | 'serving' | 'completed';
  registrationTime: Date;
}

const QueueManagement = () => {
  const [activeView, setActiveView] = useState<'overview' | 'registration' | 'customers'>('overview');
  const [customers, setCustomers] = useState<Customer[]>([
    { 
      id: '1', 
      name: 'Juan Dela Cruz', 
      contactNumber: '+63-912-345-6789',
      email: 'juan.delacruz@email.com',
      age: 65,
      address: 'Quezon City, Metro Manila',
      occupation: 'Retired Teacher',
      distribution: 'pickup',
      salesAgent: 'Mel',
      assignedDoctor: 'Dr. Maria Santos',
      prescription: { od: '-2.00', os: '-1.75', ou: '', pd: '62', add: '+1.50' },
      gradeType: 'Progressive (PROG)',
      lensType: 'Anti-radiation (MC)',
      frameCode: 'FR001',
      paymentInfo: { mode: 'Cash', amount: '2500.00' },
      remarks: 'First time customer, needs extra care',
      token: 'T-001', 
      priority: true, 
      priorityType: 'Senior Citizen', 
      waitTime: 5, 
      status: 'serving', 
      registrationTime: new Date('2025-01-27T09:00:00')
    },
    { 
      id: '2', 
      name: 'Maria Santos', 
      contactNumber: '+63-917-123-4567',
      email: 'maria.santos@email.com',
      age: 32,
      address: 'Makati City, Metro Manila',
      occupation: 'Marketing Manager',
      distribution: 'lalamove',
      salesAgent: 'Ace',
      assignedDoctor: 'Dr. Pedro Garcia',
      prescription: { od: '-1.25', os: '-1.50', ou: '', pd: '58', add: '' },
      gradeType: 'Single Grade (SV)',
      lensType: 'Anti-blue light (BB)',
      frameCode: 'FR002',
      paymentInfo: { mode: 'Gcash', amount: '1800.00' },
      remarks: 'Prefers lightweight frames',
      token: 'T-002', 
      priority: false, 
      waitTime: 12, 
      status: 'waiting', 
      registrationTime: new Date('2025-01-27T09:15:00')
    },
    { 
      id: '3', 
      name: 'Ana Rodriguez', 
      contactNumber: '+63-928-765-4321',
      email: 'ana.rodriguez@email.com',
      age: 28,
      address: 'Pasig City, Metro Manila',
      occupation: 'Nurse',
      distribution: 'pickup',
      salesAgent: 'Yhel',
      assignedDoctor: 'Dr. Rosa Martinez',
      prescription: { od: '-0.75', os: '-1.00', ou: '', pd: '60', add: '' },
      gradeType: 'Single Vision-Reading (SV-READING)',
      lensType: 'Photochromic anti-radiation (TRG)',
      frameCode: 'FR003',
      paymentInfo: { mode: 'Maya', amount: '2200.00' },
      remarks: 'Pregnant, needs priority service',
      token: 'T-003', 
      priority: true, 
      priorityType: 'Pregnant', 
      waitTime: 8, 
      status: 'waiting', 
      registrationTime: new Date('2025-01-27T09:30:00')
    },
    { 
      id: '4', 
      name: 'Pedro Garcia', 
      contactNumber: '+63-915-987-6543',
      email: 'pedro.garcia@email.com',
      age: 45,
      address: 'Taguig City, Metro Manila',
      occupation: 'Engineer',
      distribution: 'lbc',
      salesAgent: 'Jil',
      assignedDoctor: 'Dr. Juan Dela Cruz',
      prescription: { od: '-3.25', os: '-3.00', ou: '', pd: '64', add: '+2.00' },
      gradeType: 'Process-Progressive (PROC-PROG)',
      lensType: 'Ultra-Thin High Cylinder 1.61 (UTH 1.61 HC)',
      frameCode: 'FR004',
      paymentInfo: { mode: 'Credit Card', amount: '4500.00' },
      remarks: 'High prescription, requires special handling',
      token: 'T-004', 
      priority: false, 
      waitTime: 15, 
      status: 'waiting', 
      registrationTime: new Date('2025-01-27T09:45:00')
    },
    { 
      id: '5', 
      name: 'Rosa Martinez', 
      contactNumber: '+63-922-345-6789',
      email: 'rosa.martinez@email.com',
      age: 38,
      address: 'Mandaluyong City, Metro Manila',
      occupation: 'Teacher',
      distribution: 'pickup',
      salesAgent: 'Jeselle',
      assignedDoctor: 'Dr. Ana Rodriguez',
      prescription: { od: '-2.50', os: '-2.25', ou: '', pd: '59', add: '' },
      gradeType: 'Flat-Top (F.T)',
      lensType: 'Photochromic anti-blue light (BTS)',
      frameCode: 'FR005',
      paymentInfo: { mode: 'Bank Transfer', amount: '3200.00' },
      remarks: 'PWD discount applied',
      token: 'T-005', 
      priority: true, 
      priorityType: 'PWD', 
      waitTime: 3, 
      status: 'waiting', 
      registrationTime: new Date('2025-01-27T10:00:00')
    },
  ]);

  // ST-302: Calculate average wait time dynamically
  const averageWaitTime = customers.length > 0 
    ? Math.round(customers.reduce((sum, customer) => sum + customer.waitTime, 0) / customers.length)
    : 0;

  // ST-301: Real-time statistics
  const waitingCustomers = customers.filter(c => c.status === 'waiting').length;
  const currentlyServing = customers.filter(c => c.status === 'serving').length;
  const priorityCustomers = customers.filter(c => c.priority && c.status === 'waiting').length;

  // ST-303: Priority logic - sort customers by priority, then by registration time
  const sortedCustomers = [...customers].sort((a, b) => {
    if (a.priority && !b.priority) return -1;
    if (!a.priority && b.priority) return 1;
    return a.registrationTime.getTime() - b.registrationTime.getTime();
  });

  // ST-304: Manual override capability
  const moveCustomerUp = (customerId: string) => {
    const customerIndex = customers.findIndex(c => c.id === customerId);
    if (customerIndex > 0) {
      const newCustomers = [...customers];
      [newCustomers[customerIndex], newCustomers[customerIndex - 1]] = 
      [newCustomers[customerIndex - 1], newCustomers[customerIndex]];
      setCustomers(newCustomers);
    }
  };

  const moveCustomerDown = (customerId: string) => {
    const customerIndex = customers.findIndex(c => c.id === customerId);
    if (customerIndex < customers.length - 1) {
      const newCustomers = [...customers];
      [newCustomers[customerIndex], newCustomers[customerIndex + 1]] = 
      [newCustomers[customerIndex + 1], newCustomers[customerIndex]];
      setCustomers(newCustomers);
    }
  };

  const callNextCustomer = () => {
    const nextCustomer = sortedCustomers.find(c => c.status === 'waiting');
    if (nextCustomer) {
      setCustomers(prev => prev.map(c => 
        c.id === nextCustomer.id ? { ...c, status: 'serving' } : c
      ));
      // ST-403: Sound effect simulation
      console.log(`🔊 Calling customer: ${nextCustomer.name} - Token: ${nextCustomer.token}`);
    }
  };

  const completeService = (customerId: string) => {
    setCustomers(prev => prev.map(c => 
      c.id === customerId ? { ...c, status: 'completed' } : c
    ));
  };

  const exportCustomerToExcel = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    console.log('Exporting customer to Excel:', customer);
  };

  const exportCustomerToPDF = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    console.log('Exporting customer to PDF:', customer);
  };

  const exportCustomerToGoogleSheets = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    console.log('Exporting customer to Google Sheets:', customer);
  };

  const exportAllCustomersToExcel = () => {
    console.log('Exporting all customers to Excel:', customers);
  };

  const exportAllCustomersToPDF = () => {
    console.log('Exporting all customers to PDF:', customers);
  };

  const exportAllCustomersToGoogleSheets = () => {
    console.log('Exporting all customers to Google Sheets:', customers);
  };

  useEffect(() => {
    // Simulate real-time wait time updates
    const interval = setInterval(() => {
      setCustomers(prev => prev.map(customer => 
        customer.status === 'waiting' 
          ? { ...customer, waitTime: customer.waitTime + 1 }
          : customer
      ));
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const renderOverview = () => (
    <div className="space-y-6">
      {/* ST-301: Real-time statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Customers Waiting</p>
                <p className="text-3xl font-bold text-orange-500">{waitingCustomers}</p>
              </div>
              <Users className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Currently Serving</p>
                <p className="text-3xl font-bold text-blue-600">{currentlyServing}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Priority Customers</p>
                <p className="text-3xl font-bold text-red-500">{priorityCustomers}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Wait Time</p>
                <p className="text-3xl font-bold text-green-600">{averageWaitTime}m</p>
              </div>
              <Clock className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Queue Management Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Queue Management
            <Button onClick={callNextCustomer} className="bg-orange-500 hover:bg-orange-600">
              Call Next Customer
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedCustomers.filter(c => c.status !== 'completed').map((customer, index) => (
              <div key={customer.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-lg">{customer.token}</span>
                    {customer.priority && (
                      <Badge variant="destructive" className="text-xs">
                        {customer.priorityType}
                      </Badge>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold">{customer.name}</p>
                    <p className="text-sm text-gray-600">
                      Wait time: {customer.waitTime} minutes | Status: 
                      <span className={`ml-1 font-semibold ${
                        customer.status === 'serving' ? 'text-blue-600' : 'text-orange-600'
                      }`}>
                        {customer.status === 'serving' ? 'Being Served' : 'Waiting'}
                      </span>
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {/* ST-304: Manual override controls */}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => moveCustomerUp(customer.id)}
                    disabled={index === 0}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => moveCustomerDown(customer.id)}
                    disabled={index === sortedCustomers.length - 1}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                  {customer.status === 'serving' && (
                    <Button
                      size="sm"
                      onClick={() => completeService(customer.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Complete
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderRegisteredCustomers = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Registered Customers</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportAllCustomersToExcel}>
            Export All to Excel
          </Button>
          <Button variant="outline" onClick={exportAllCustomersToPDF}>
            Export All to PDF
          </Button>
          <Button variant="outline" onClick={exportAllCustomersToGoogleSheets}>
            Export All to Google Sheets
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Token</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact Number</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Occupation</TableHead>
                  <TableHead>Distribution</TableHead>
                  <TableHead>Sales Agent</TableHead>
                  <TableHead>Assigned Doctor</TableHead>
                  <TableHead>Prescription</TableHead>
                  <TableHead>Grade Type</TableHead>
                  <TableHead>Lens Type</TableHead>
                  <TableHead>Frame Code</TableHead>
                  <TableHead>Wait Time</TableHead>
                  <TableHead>Payment Info</TableHead>
                  <TableHead>Priority Type</TableHead>
                  <TableHead>Remarks</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Registration Time</TableHead>
                  <TableHead>OR Number</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-bold">{customer.token}</TableCell>
                    <TableCell className="font-semibold">{customer.name}</TableCell>
                    <TableCell className="text-sm">{customer.contactNumber}</TableCell>
                    <TableCell className="text-sm">{customer.email}</TableCell>
                    <TableCell>{customer.age}</TableCell>
                    <TableCell className="text-sm max-w-[150px] truncate" title={customer.address}>
                      {customer.address}
                    </TableCell>
                    <TableCell>{customer.occupation}</TableCell>
                    <TableCell>{customer.distribution}</TableCell>
                    <TableCell>{customer.salesAgent}</TableCell>
                    <TableCell>{customer.assignedDoctor}</TableCell>
                    <TableCell className="text-xs">
                      <div>OD: {customer.prescription.od || 'N/A'}</div>
                      <div>OS: {customer.prescription.os || 'N/A'}</div>
                      <div>PD: {customer.prescription.pd || 'N/A'}</div>
                    </TableCell>
                    <TableCell className="text-sm max-w-[120px] truncate" title={customer.gradeType}>
                      {customer.gradeType}
                    </TableCell>
                    <TableCell className="text-sm max-w-[120px] truncate" title={customer.lensType}>
                      {customer.lensType}
                    </TableCell>
                    <TableCell>{customer.frameCode}</TableCell>
                    <TableCell>{customer.waitTime} min</TableCell>
                    <TableCell className="text-sm">
                      <div>{customer.paymentInfo.mode}</div>
                      <div>₱{customer.paymentInfo.amount}</div>
                    </TableCell>
                    <TableCell>
                      {customer.priority ? (
                        <Badge variant="destructive" className="text-xs">
                          {customer.priorityType}
                        </Badge>
                      ) : (
                        <span className="text-gray-500 text-sm">Regular</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm max-w-[150px] truncate" title={customer.remarks}>
                      {customer.remarks}
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        customer.status === 'completed' ? 'default' :
                        customer.status === 'serving' ? 'secondary' : 'outline'
                      }>
                        {customer.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {customer.registrationTime.toLocaleString()}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      OR-{customer.id.padStart(3, '0')}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => exportCustomerToExcel(customer.id)}
                          title="Export to Excel"
                        >
                          Excel
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => exportCustomerToPDF(customer.id)}
                          title="Export to PDF"
                        >
                          PDF
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => exportCustomerToGoogleSheets(customer.id)}
                          title="Export to Google Sheets"
                        >
                          Sheets
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-blue-800">
            <FileText className="h-4 w-4" />
            <span className="text-sm font-medium">
              Google Sheets integration uses Google Apps Script web app for seamless data transfer
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <div className="flex space-x-2">
        <Button
          variant={activeView === 'overview' ? 'default' : 'outline'}
          onClick={() => setActiveView('overview')}
          className={activeView === 'overview' ? 'bg-orange-500 hover:bg-orange-600' : ''}
        >
          Admin Dashboard
        </Button>
        <Button
          variant={activeView === 'registration' ? 'default' : 'outline'}
          onClick={() => setActiveView('registration')}
          className={activeView === 'registration' ? 'bg-orange-500 hover:bg-orange-600' : ''}
        >
          Customer Registration
        </Button>
        <Button
          variant={activeView === 'customers' ? 'default' : 'outline'}
          onClick={() => setActiveView('customers')}
          className={activeView === 'customers' ? 'bg-orange-500 hover:bg-orange-600' : ''}
        >
          Registered Customers
        </Button>
      </div>

      {/* Content */}
      {activeView === 'overview' && renderOverview()}
      {activeView === 'registration' && <CustomerRegistration />}
      {activeView === 'customers' && renderRegisteredCustomers()}
    </div>
  );
};

export default QueueManagement;
