
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Bell, MessageSquare, Mail, Volume2, Settings, Loader2 } from 'lucide-react';
import { useCustomers } from '@/contexts/CustomerContext';

interface NotificationSettings {
  smsEnabled: boolean;
  emailEnabled: boolean;
  soundEnabled: boolean;
  autoSend: boolean;
}

const NotificationSystem = () => {
  const { customers } = useCustomers();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>({
    smsEnabled: true,
    emailEnabled: true,
    soundEnabled: true,
    autoSend: false
  });

  // Get customers that need notifications
  const customersNeedingNotification = customers.filter(customer => 
    customer.status === 'waiting' && customer.waitTime > 0
  );

  const sendNotification = async (customerId: string, type: 'sms' | 'email') => {
    setLoading(true);
    try {
      // This would integrate with actual SMS/email services
      console.log(`Sending ${type} notification to customer ${customerId}`);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Failed to send ${type} notification:`, error);
    } finally {
      setLoading(false);
    }
  };

  const sendBulkNotifications = async (type: 'sms' | 'email') => {
    setLoading(true);
    try {
      for (const customer of customersNeedingNotification) {
        await sendNotification(customer.id, type);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Notification System</h1>
        <div className="flex gap-2">
          <Button variant="outline" disabled={loading}>
            <Settings className="h-4 w-4 mr-2" />
            Configure Services
          </Button>
        </div>
      </div>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Notification Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <Mail className="h-4 w-4" />
                <span>Email Notifications</span>
              </div>
              <Switch 
                checked={settings.emailEnabled}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, emailEnabled: checked }))}
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
          <CardTitle>Bulk Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <Button 
              onClick={() => sendBulkNotifications('sms')}
              disabled={loading || !settings.smsEnabled || customersNeedingNotification.length === 0}
              className="flex items-center gap-2"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageSquare className="h-4 w-4" />}
              Send SMS to All ({customersNeedingNotification.length})
            </Button>
            
            <Button 
              onClick={() => sendBulkNotifications('email')}
              disabled={loading || !settings.emailEnabled || customersNeedingNotification.length === 0}
              variant="outline"
              className="flex items-center gap-2"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
              Send Email to All ({customersNeedingNotification.length})
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
          <CardTitle>Individual Notifications</CardTitle>
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
                      <p className="text-sm text-gray-500">{customer.contactNumber}</p>
                    </div>
                    <Badge variant="secondary">
                      Wait: {Math.floor(customer.waitTime / 60)}:{(customer.waitTime % 60).toString().padStart(2, '0')}
                    </Badge>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      size="sm"
                      onClick={() => sendNotification(customer.id, 'sms')}
                      disabled={loading || !settings.smsEnabled}
                    >
                      <MessageSquare className="h-3 w-3 mr-1" />
                      SMS
                    </Button>
                    <Button 
                      size="sm"
                      variant="outline"
                      onClick={() => sendNotification(customer.id, 'email')}
                      disabled={loading || !settings.emailEnabled}
                    >
                      <Mail className="h-3 w-3 mr-1" />
                      Email
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Status Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-blue-800">
            <Bell className="h-4 w-4" />
            <span className="text-sm font-medium">
              Notification services require API configuration for SMS and email providers
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationSystem;
