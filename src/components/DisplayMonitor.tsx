
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const DisplayMonitor = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Display Monitor</h1>
        <Button variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
          Fullscreen Mode
        </Button>
      </div>
      
      <div className="text-sm text-gray-600 mb-4">
        This is a preview of the public display monitor that customers will see.
      </div>

      {/* Display Monitor Preview */}
      <Card className="bg-gray-800 text-white">
        <CardContent className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <img 
                src="/lovable-uploads/cbedd510-5670-4550-8b1b-bf1a1a3bf793.png" 
                alt="EscaShop Logo" 
                className="h-16 w-16 object-contain"
              />
            </div>
            <h2 className="text-2xl font-bold mb-2">
              <span className="text-orange-500">ESCA</span> <span className="text-white">SHOP</span>
            </h2>
            <p className="text-gray-300 text-sm">PREMIUM EYEWEAR</p>
            <p className="text-gray-400 text-sm mt-2">Customer Queue System</p>
          </div>

          {/* Now Serving Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-white">NOW SERVING</h3>
            <div className="grid grid-cols-4 gap-4">
              {['JA', 'Jil', 'Shella', 'Eric'].map((counter) => (
                <div key={counter} className="bg-gray-700 rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-300 mb-2">Counter {counter}</div>
                  <div className="text-lg font-bold text-white">Available</div>
                </div>
              ))}
            </div>
          </div>

          {/* Waiting Queue Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">WAITING QUEUE</h3>
            <div className="bg-gray-700 rounded-lg">
              <div className="grid grid-cols-4 gap-px bg-gray-600 p-px rounded-lg">
                <div className="bg-gray-700 p-3 text-center text-sm font-medium text-gray-300">POSITION</div>
                <div className="bg-gray-700 p-3 text-center text-sm font-medium text-gray-300">TOKEN</div>
                <div className="bg-gray-700 p-3 text-center text-sm font-medium text-gray-300">CUSTOMER</div>
                <div className="bg-gray-700 p-3 text-center text-sm font-medium text-gray-300">EST WAIT TIME</div>
              </div>
              <div className="p-8 text-center">
                <div className="text-gray-400">Next</div>
                <div className="text-white">A009</div>
                <div className="text-gray-300">Abner Escano</div>
                <div className="text-gray-400">15 mins</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DisplayMonitor;
