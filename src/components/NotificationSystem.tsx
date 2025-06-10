
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, MessageSquare, Volume2, Settings, Loader2, ExternalLink } from 'lucide-react';
import { useCustomers } from '@/contexts/CustomerContext';
import { useNotifications } from '@/hooks/useNotifications';
import NotificationSetup from './NotificationSetup';

interface NotificationSettings {
  smsEnabled: boolean;
  soundEnabled: boolean;
  autoSend: boolean;
}

const NotificationSystem = () => {
  const { customers } = useCustomers();
  const { loading, sendSMSNotification, sendBulkSMSNotifications } = useNotifications();
  const [settings, setSettings] = useState<NotificationSettings>({
    smsEnabled: true,
    soundEnabled: true,
    autoSend: false
  });

  // Get customers that need notifications
  const customersNeedingNotification = customers.filter(customer => 
    customer.status === 'waiting' && customer.waitTime > 0
  );

  const handleSendSMSNotification = async (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return;

    try {
      await sendSMSNotification(customer);
    } catch (error) {
      console.error('Failed to send SMS notification:', error);
    }
  };

  const handleBulkSMSNotifications = async () => {
    try {
      await sendBulkSMSNotifications(customersNeedingNotification);
    } catch (error) {
      console.error('Failed to send bulk SMS notifications:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">SMS Notification System</h1>
      </div>

      <Tabs defaultValue="notifications" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="notifications">Send SMS Notifications</TabsTrigger>
          <TabsTrigger value="setup">Service Setup</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-6">
          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                SMS Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    <span>SMS Notifications</span>
                  </div>
                  <Switch 
                    checked={settings.smsEnabled}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, smsEnabled: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Volume2 className="h-4 w-4" />
                    <span>Sound Alerts</span>
                  </div>
                  <Switch 
                    checked={settings.soundEnabled}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, soundEnabled: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    <span>Auto-Send</span>
                  </div>
                  <Switch 
                    checked={settings.autoSend}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoSend: checked }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bulk Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Bulk SMS Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-4">
                <Button 
                  onClick={handleBulkSMSNotifications}
                  disabled={loading || !settings.smsEnabled || customersNeedingNotification.length === 0}
                  className="flex items-center gap-2"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageSquare className="h-4 w-4" />}
                  Send SMS to All ({customersNeedingNotification.length})
                </Button>
              </div>
              
              {customersNeedingNotification.length === 0 && (
                <p className="text-gray-500 text-sm">No customers currently need notifications</p>
              )}
            </CardContent>
          </Card>

          {/* Customer List for Individual Notifications */}
          <Card>
            <CardHeader>
              <CardTitle>Individual SMS Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              {customersNeedingNotification.length === 0 ? (
                <div className="text-center py-8">
                  <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No customers require notifications at the moment</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {customersNeedingNotification.map((customer) => (
                    <div key={customer.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">{customer.token}</Badge>
                        <div>
                          <p className="font-medium">{customer.name}</p>
                          <p className="text-sm text-gray-500">
                            📱 {customer.contactNumber}
                          </p>
                        </div>
                        <Badge variant="secondary">
                          Wait: {Math.floor(customer.waitTime / 60)}:{(customer.waitTime % 60).toString().padStart(2, '0')}
                        </Badge>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          size="sm"
                          onClick={() => handleSendSMSNotification(customer.id)}
                          disabled={loading || !settings.smsEnabled || !customer.contactNumber}
                        >
                          <MessageSquare className="h-3 w-3 mr-1" />
                          Send SMS
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="setup">
          <NotificationSetup />
        </TabsContent>
      </Tabs>

      {/* Status Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-blue-800">
            <ExternalLink className="h-4 w-4" />
            <span className="text-sm font-medium">
              Visit the "Service Setup" tab to configure SMS (Twilio/Semaphore) provider
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationSystem;
