
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const QueueDisplay = () => {
  const counters = [
    { id: 'JA', name: 'JA', currentToken: 'A-015', customerName: 'Maria Santos' },
    { id: 'Jil', name: 'Jil', currentToken: 'B-023', customerName: 'John Dela Cruz' },
    { id: 'Shella', name: 'Shella', currentToken: 'A-016', customerName: 'Ana Rodriguez' },
    { id: 'Eric', name: 'Eric', currentToken: null, customerName: null }
  ];

  const waitingQueue = [
    { token: 'A-017', name: 'Pedro Garcia', priority: 'Senior' },
    { token: 'B-024', name: 'Lisa Wong', priority: null },
    { token: 'A-018', name: 'Carmen Lopez', priority: 'PWD' },
    { token: 'B-025', name: 'Mark Johnson', priority: null },
    { token: 'A-019', name: 'Rosa Mendoza', priority: 'Pregnant' }
  ];

  const callNext = (counterId: string) => {
    // TODO: Implement call next customer logic
    console.log(`Calling next customer for counter ${counterId}`);
  };

  return (
    <div className="space-y-6">
      {/* Counter Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Counter Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {counters.map((counter) => (
              <Card key={counter.id} className="text-center">
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold mb-2">Counter {counter.name}</h3>
                  {counter.currentToken ? (
                    <div className="space-y-2">
                      <div className="text-2xl font-bold text-primary">{counter.currentToken}</div>
                      <div className="text-sm text-muted-foreground">{counter.customerName}</div>
                      <Button 
                        size="sm" 
                        onClick={() => callNext(counter.id)}
                        className="w-full"
                      >
                        Call Next
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="text-gray-400">Available</div>
                      <Button 
                        size="sm" 
                        onClick={() => callNext(counter.id)}
                        className="w-full"
                      >
                        Call Customer
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Waiting Queue */}
      <Card>
        <CardHeader>
          <CardTitle>Waiting Queue ({waitingQueue.length} customers)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {waitingQueue.map((customer, index) => (
              <div key={customer.token} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="text-lg font-semibold">{index + 1}</div>
                  <div>
                    <div className="font-medium">{customer.token} - {customer.name}</div>
                    {customer.priority && (
                      <Badge variant="secondary" className="mt-1">
                        {customer.priority}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  Est. wait: {(index + 1) * 10} min
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Queue Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">15 min</div>
            <div className="text-sm text-muted-foreground">Average Wait Time</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">3</div>
            <div className="text-sm text-muted-foreground">Priority Customers</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">28</div>
            <div className="text-sm text-muted-foreground">Served Today</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QueueDisplay;
