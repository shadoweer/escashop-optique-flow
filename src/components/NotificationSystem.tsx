
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

const NotificationSystem = () => {
  const [activeSubTab, setActiveSubTab] = useState('log');

  const subTabs = [
    { id: 'log', label: 'Notification Log' },
    { id: 'send', label: 'Send Notification' }
  ];

  const renderContent = () => {
    switch (activeSubTab) {
      case 'log':
        return (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Notification Summary</h2>
              <div className="flex gap-2">
                <Button variant="outline">Export Log</Button>
                <Button variant="outline">Refresh</Button>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-6">
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">1</div>
                  <div className="text-sm text-green-700">Successful Notifications</div>
                </CardContent>
              </Card>
              
              <Card className="bg-red-50 border-red-200">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-red-600 mb-2">0</div>
                  <div className="text-sm text-red-700">Failed Notifications</div>
                </CardContent>
              </Card>
              
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">1</div>
                  <div className="text-sm text-blue-700">SMS Sent</div>
                </CardContent>
              </Card>
              
              <Card className="bg-purple-50 border-purple-200">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">0</div>
                  <div className="text-sm text-purple-700">Emails Sent</div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Notifications */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Notifications</h3>
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recipient</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">NOTIF-17</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Abner Escano</td>
                          <td className="px-6 py-4 text-sm text-gray-900">Your token P647 is now being served.</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">SMS</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">4/16/2025 9:00:31 AM</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge className="bg-green-100 text-green-800">Sent</Badge>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case 'send':
        return (
          <div className="max-w-2xl">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Send Custom Notification</h2>
            
            <Card>
              <CardContent className="p-6 space-y-6">
                <div>
                  <Label htmlFor="notificationType" className="text-sm font-medium text-gray-700">Notification Type</Label>
                  <Select>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="SMS Message" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sms">SMS Message</SelectItem>
                      <SelectItem value="email">Email Message</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-3 block">Select Recipients</Label>
                  <Card className="p-4 max-h-48 overflow-y-auto">
                    <div className="space-y-3">
                      {[
                        { name: 'Abner Escano', token: 'A809', phone: '+639123456789' },
                        { name: 'Maria Santos', token: 'A810', phone: '+639234567890' },
                        { name: 'John Doe', token: 'P647', phone: '+639345678901' }
                      ].map((customer, index) => (
                        <label key={index} className="flex items-center space-x-3 cursor-pointer">
                          <input type="checkbox" className="rounded border-gray-300" />
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900">
                              👤 {customer.name} ({customer.token})
                            </div>
                            <div className="text-sm text-gray-500">{customer.phone}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </Card>
                </div>

                <div>
                  <Label htmlFor="message" className="text-sm font-medium text-gray-700">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Enter your message here..."
                    className="mt-1 min-h-32"
                  />
                </div>

                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                  📤 Send Notification
                </Button>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Notification System</h1>
      
      {/* Sub Navigation */}
      <div className="flex bg-gray-50 rounded-lg p-1 max-w-md">
        {subTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeSubTab === tab.id
                ? 'bg-white text-gray-800 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {renderContent()}
    </div>
  );
};

export default NotificationSystem;
