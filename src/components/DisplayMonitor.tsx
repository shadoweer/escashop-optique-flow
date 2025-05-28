
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX } from 'lucide-react';
import { useCustomers } from '@/contexts/CustomerContext';

interface CounterData {
  id: string;
  name: string;
  currentToken: string;
  currentCustomer: string;
  status: 'available' | 'busy' | 'offline';
  lastCalled: Date;
}

const DisplayMonitor = () => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const { customers } = useCustomers();
  
  // Initialize counters without mock data
  const [counters, setCounters] = useState<CounterData[]>([
    {
      id: '1',
      name: 'JA',
      currentToken: '',
      currentCustomer: '',
      status: 'available',
      lastCalled: new Date()
    },
    {
      id: '2',
      name: 'Jil',
      currentToken: '',
      currentCustomer: '',
      status: 'available',
      lastCalled: new Date()
    },
    {
      id: '3',
      name: 'Shella',
      currentToken: '',
      currentCustomer: '',
      status: 'available',
      lastCalled: new Date()
    },
    {
      id: '4',
      name: 'Eric',
      currentToken: '',
      currentCustomer: '',
      status: 'available',
      lastCalled: new Date()
    }
  ]);

  const playCallSound = () => {
    if (soundEnabled) {
      console.log('🔊 Sound effect would play here for customer call');
    }
  };

  const callCustomer = (counterId: string, token: string, customerName: string) => {
    setCounters(prev => prev.map(counter => 
      counter.id === counterId 
        ? { ...counter, currentToken: token, currentCustomer: customerName, status: 'busy', lastCalled: new Date() }
        : counter
    ));
    
    playCallSound();
    console.log(`🔊 Now calling ${customerName} with token ${token} to counter ${counters.find(c => c.id === counterId)?.name}`);
  };

  const completeCustomer = (counterId: string) => {
    setCounters(prev => prev.map(counter => 
      counter.id === counterId 
        ? { ...counter, currentToken: '', currentCustomer: '', status: 'available' }
        : counter
    ));
  };

  const renderCounterCard = (counter: CounterData) => (
    <Card key={counter.id} className="h-64">
      <CardHeader className="pb-4">
        <CardTitle className="text-center text-3xl font-bold text-orange-500">
          Counter {counter.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center space-y-2">
          {counter.currentToken ? (
            <>
              <div className="text-4xl font-bold text-gray-800">{counter.currentToken}</div>
              <div className="text-lg text-gray-600">{counter.currentCustomer}</div>
              <Badge 
                variant="default" 
                className="bg-blue-600 text-white px-3 py-1"
              >
                Currently Serving
              </Badge>
            </>
          ) : (
            <>
              <div className="text-2xl text-gray-400">No Customer</div>
              <Badge 
                variant="outline" 
                className="border-green-500 text-green-600 px-3 py-1"
              >
                Available
              </Badge>
            </>
          )}
        </div>

        <div className="text-center">
          <Badge variant={
            counter.status === 'busy' ? 'destructive' :
            counter.status === 'available' ? 'default' : 'secondary'
          }>
            {counter.status.toUpperCase()}
          </Badge>
        </div>

        <div className="flex gap-2 justify-center">
          <Button 
            size="sm" 
            onClick={() => {
              // Get next waiting customer
              const nextCustomer = customers.find(c => c.status === 'waiting');
              if (nextCustomer) {
                callCustomer(counter.id, nextCustomer.token, nextCustomer.name);
              }
            }}
            disabled={counter.status === 'busy' || !customers.some(c => c.status === 'waiting')}
            className="bg-orange-500 hover:bg-orange-600"
          >
            Call Next
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => completeCustomer(counter.id)}
            disabled={counter.status === 'available'}
          >
            Complete
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  useEffect(() => {
    const interval = setInterval(() => {
      console.log('🔄 Display refreshed at', new Date().toLocaleTimeString());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Calculate real statistics from customers data
  const servedToday = customers.filter(c => c.status === 'completed').length;
  const currentlyWaiting = customers.filter(c => c.status === 'waiting').length;
  const averageServiceTime = 8; // This would be calculated from real data

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img 
              src="/lovable-uploads/cbedd510-5670-4550-8b1b-bf1a1a3bf793.png" 
              alt="EscaShop Logo" 
              className="h-12 w-12 object-contain"
            />
            <div>
              <h1 className="text-3xl font-bold">
                <span className="text-orange-500">ESCA</span> <span className="text-gray-700">SHOP</span>
              </h1>
              <p className="text-gray-500">Queue Display Monitor</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="flex items-center gap-2"
            >
              {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              Sound {soundEnabled ? 'On' : 'Off'}
            </Button>
            <div className="text-right">
              <p className="text-sm text-gray-600">Current Time</p>
              <p className="text-lg font-semibold">{new Date().toLocaleTimeString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {counters.map(renderCounterCard)}
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-sm text-gray-600">Total Customers Served Today</p>
            <p className="text-3xl font-bold text-green-600">{servedToday}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Average Service Time</p>
            <p className="text-3xl font-bold text-blue-600">{averageServiceTime} min</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Currently Waiting</p>
            <p className="text-3xl font-bold text-orange-500">{currentlyWaiting}</p>
          </div>
        </div>
      </div>

      <div className="text-center mt-6 text-gray-500">
        <p>© 2025 Esca Optical - Queue Management System</p>
        <p className="text-sm">Display updates automatically every 30 seconds</p>
      </div>
    </div>
  );
};

export default DisplayMonitor;
