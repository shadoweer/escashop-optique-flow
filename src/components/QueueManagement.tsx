import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Clock, AlertTriangle, ArrowUp, ArrowDown, FileText, Loader2 } from 'lucide-react';
import CustomerRegistration from './CustomerRegistration';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useCustomers } from '@/contexts/CustomerContext';

const QueueManagement = () => {
  const [activeView, setActiveView] = useState<'overview' | 'registration' | 'customers'>('overview');
  const { customers, updateCustomer, loading } = useCustomers();

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

  const callNextCustomer = async () => {
    const nextCustomer = sortedCustomers.find(c => c.status === 'waiting');
    if (nextCustomer) {
      await updateCustomer(nextCustomer.id, { status: 'serving' });
      console.log(`🔊 Calling customer: ${nextCustomer.name} - Token: ${nextCustomer.token}`);
    }
  };

  const completeService = async (customerId: string) => {
    await updateCustomer(customerId, { status: 'completed' });
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
      customers.forEach(customer => {
        if (customer.status === 'waiting') {
          updateCustomer(customer.id, { waitTime: customer.waitTime + 1 });
        }
      });
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [customers, updateCustomer]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading customers...</span>
      </div>
    );
  }

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
                      {customer.orNumber}
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
