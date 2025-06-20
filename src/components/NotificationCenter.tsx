
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { MessageSquare, Bell, Send, Settings, Users, Loader2 } from 'lucide-react';
import { useCustomers } from '@/contexts/CustomerContext';
import { useNotifications } from '@/hooks/useNotifications';

interface NotificationTemplate {
  id: string;
  name: string;
  type: 'sms';
  message: string;
  enabled: boolean;
}

const NotificationCenter = () => {
  const { customers } = useCustomers();
  const { loading: smsLoading, sendSMSNotification } = useNotifications();
  
  const [templates, setTemplates] = useState<NotificationTemplate[]>([
    {
      id: '1',
      name: 'Queue Ready',
      type: 'sms',
      message: 'Hello {{customerName}}, your queue number {{token}} is ready! Please proceed to our counter.',
      enabled: true
    },
    {
      id: '2',
      name: 'Service Complete',
      type: 'sms',
      message: 'Thank you {{customerName}}! Your service is complete. Token: {{token}}. Please collect your receipt.',
      enabled: false
    },
    {
      id: '3',
      name: 'Wait Time Update',
      type: 'sms',
      message: 'Hello {{customerName}}! Your queue number {{token}} at Esca Optical has an estimated wait time of {{waitTime}} minutes.',
      enabled: true
    }
  ]);

  const [newTemplate, setNewTemplate] = useState({
    name: '',
    type: 'sms' as 'sms',
    message: '',
    enabled: true
  });

  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [bulkSending, setBulkSending] = useState(false);

  const [settings, setSettings] = useState({
    smsEnabled: true,
    autoNotify: true
  });

  const { toast } = useToast();

  const sendNotificationToCustomer = async (customerId: string, templateId: string) => {
    const customer = customers.find(c => c.id === customerId);
    const template = templates.find(t => t.id === templateId);
    
    if (!customer || !template) return;

    try {
      await sendSMSNotification(customer);
      
      // Log to activity
      await supabase.from('activity_logs').insert({
        activity_type: 'notification',
        user_name: 'Admin',
        user_type: 'admin',
        description: `SMS notification sent to ${customer.name}`,
        details: {
          template: template.name,
          customer_contact: customer.contactNumber,
          token: customer.token
        },
        customer_id: customer.id
      });

    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  };

  const sendBulkNotifications = async () => {
    if (!selectedTemplate || selectedCustomers.length === 0) {
      toast({
        title: "Error",
        description: "Please select customers and a template",
        variant: "destructive"
      });
      return;
    }

    setBulkSending(true);
    let successCount = 0;
    let errorCount = 0;

    try {
      for (const customerId of selectedCustomers) {
        try {
          await sendNotificationToCustomer(customerId, selectedTemplate);
          successCount++;
        } catch (error) {
          errorCount++;
          console.error(`Failed to send SMS to customer ${customerId}:`, error);
        }
      }

      toast({
        title: "Bulk SMS Complete",
        description: `Sent ${successCount} SMS notifications successfully. ${errorCount > 0 ? `${errorCount} failed.` : ''}`,
        variant: errorCount > 0 ? "destructive" : "default",
      });

      // Clear selections after successful send
      setSelectedCustomers([]);
    } finally {
      setBulkSending(false);
    }
  };

  const toggleCustomerSelection = (customerId: string) => {
    setSelectedCustomers(prev => 
      prev.includes(customerId) 
        ? prev.filter(id => id !== customerId)
        : [...prev, customerId]
    );
  };

  const selectAllCustomers = () => {
    setSelectedCustomers(customers.map(c => c.id));
  };

  const clearSelection = () => {
    setSelectedCustomers([]);
  };

  const saveTemplate = () => {
    if (!newTemplate.name || !newTemplate.message) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const template: NotificationTemplate = {
      id: Date.now().toString(),
      ...newTemplate
    };

    setTemplates([...templates, template]);
    setNewTemplate({ name: '', type: 'sms', message: '', enabled: true });

    toast({
      title: "Success",
      description: "SMS template saved"
    });
  };

  const toggleTemplate = (id: string) => {
    setTemplates(templates.map(t => 
      t.id === id ? { ...t, enabled: !t.enabled } : t
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Notification Center</h2>
          <p className="text-gray-600">Manage SMS notifications for customers</p>
        </div>
        <Badge variant="outline" className="text-green-600 border-green-600">
          SMS Ready
        </Badge>
      </div>

      {/* Settings Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            SMS Notification Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">SMS Notifications</Label>
                <p className="text-xs text-gray-500">Send queue updates via SMS</p>
              </div>
              <Switch 
                checked={settings.smsEnabled}
                onCheckedChange={(checked) => setSettings({...settings, smsEnabled: checked})}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Auto Notifications</Label>
                <p className="text-xs text-gray-500">Automatically notify customers</p>
              </div>
              <Switch 
                checked={settings.autoNotify}
                onCheckedChange={(checked) => setSettings({...settings, autoNotify: checked})}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Customer Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Select Customers ({customers.length})
            </CardTitle>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={selectAllCustomers}
                disabled={customers.length === 0}
              >
                Select All
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearSelection}
                disabled={selectedCustomers.length === 0}
              >
                Clear ({selectedCustomers.length})
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 max-h-96 overflow-y-auto">
            {customers.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No customers registered yet</p>
            ) : (
              customers.map((customer) => (
                <div key={customer.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Checkbox
                    checked={selectedCustomers.includes(customer.id)}
                    onCheckedChange={() => toggleCustomerSelection(customer.id)}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{customer.token}</Badge>
                      <span className="font-medium">{customer.name}</span>
                      <Badge variant={customer.status === 'waiting' ? 'default' : customer.status === 'serving' ? 'destructive' : 'secondary'}>
                        {customer.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">📱 {customer.contactNumber}</p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Send Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Send SMS Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="template">Select Template</Label>
              <select 
                id="template"
                className="w-full mt-1 p-2 border rounded-md"
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
              >
                <option value="">Choose a template</option>
                {templates.filter(t => t.enabled).map(template => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                Selected: {selectedCustomers.length} customer(s)
              </p>
              {selectedTemplate && (
                <p className="text-sm text-gray-600 mt-1">
                  Template: {templates.find(t => t.id === selectedTemplate)?.name}
                </p>
              )}
            </div>

            <Button 
              onClick={sendBulkNotifications} 
              className="w-full"
              disabled={bulkSending || selectedCustomers.length === 0 || !selectedTemplate || !settings.smsEnabled}
            >
              {bulkSending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Sending...
                </>
              ) : (
                <>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send SMS to {selectedCustomers.length} Customer(s)
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            SMS Templates
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {templates.map((template) => (
            <div key={template.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">{template.name}</span>
                </div>
                <Switch 
                  checked={template.enabled}
                  onCheckedChange={() => toggleTemplate(template.id)}
                />
              </div>
              <p className="text-sm text-gray-600">{template.message}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Create New Template */}
      <Card>
        <CardHeader>
          <CardTitle>Create New SMS Template</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="newName">Template Name</Label>
              <Input
                id="newName"
                value={newTemplate.name}
                onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
                placeholder="Enter template name"
              />
            </div>
            <div>
              <Label htmlFor="newType">Type</Label>
              <Input
                id="newType"
                value="SMS"
                disabled
                className="bg-gray-100"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="newMessage">Message</Label>
            <Textarea
              id="newMessage"
              value={newTemplate.message}
              onChange={(e) => setNewTemplate({...newTemplate, message: e.target.value})}
              placeholder="Enter message. Use {{customerName}}, {{token}}, {{waitTime}} for dynamic values"
              rows={4}
            />
          </div>

          <Button onClick={saveTemplate}>Save SMS Template</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationCenter;
