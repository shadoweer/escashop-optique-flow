
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Mail, MessageSquare, Bell, Send, Settings } from 'lucide-react';

interface NotificationTemplate {
  id: string;
  name: string;
  type: 'sms' | 'email';
  subject?: string;
  message: string;
  enabled: boolean;
}

const NotificationCenter = () => {
  const [templates, setTemplates] = useState<NotificationTemplate[]>([
    {
      id: '1',
      name: 'Queue Ready',
      type: 'sms',
      message: 'Hello {{customerName}}, your queue number {{token}} is ready! Please proceed to counter {{counter}}.',
      enabled: true
    },
    {
      id: '2',
      name: 'Appointment Reminder',
      type: 'email',
      subject: 'Appointment Reminder - Esca Optical',
      message: 'Dear {{customerName}}, this is a reminder for your appointment on {{date}} at {{time}}.',
      enabled: true
    },
    {
      id: '3',
      name: 'Service Complete',
      type: 'sms',
      message: 'Thank you {{customerName}}! Your service is complete. Token: {{token}}. Please collect your receipt.',
      enabled: false
    }
  ]);

  const [newTemplate, setNewTemplate] = useState({
    name: '',
    type: 'sms' as 'sms' | 'email',
    subject: '',
    message: '',
    enabled: true
  });

  const [testNotification, setTestNotification] = useState({
    recipient: '',
    templateId: '',
    customerName: 'John Doe',
    token: 'A001',
    counter: '1'
  });

  const [settings, setSettings] = useState({
    smsEnabled: true,
    emailEnabled: true,
    autoNotify: true
  });

  const { toast } = useToast();

  const sendTestNotification = async () => {
    if (!testNotification.recipient || !testNotification.templateId) {
      toast({
        title: "Error",
        description: "Please select a template and enter recipient details",
        variant: "destructive"
      });
      return;
    }

    const template = templates.find(t => t.id === testNotification.templateId);
    if (!template) return;

    try {
      // Replace template variables
      let message = template.message
        .replace('{{customerName}}', testNotification.customerName)
        .replace('{{token}}', testNotification.token)
        .replace('{{counter}}', testNotification.counter);

      // Log the notification (in real app, this would send via SMS/Email service)
      console.log(`Sending ${template.type} to ${testNotification.recipient}:`, message);

      toast({
        title: "Test Notification Sent",
        description: `${template.type.toUpperCase()} sent to ${testNotification.recipient}`
      });

      // Log to activity
      await supabase.from('activity_logs').insert({
        activity_type: 'notification',
        user_name: 'Admin',
        user_type: 'admin',
        description: `Test ${template.type} notification sent`,
        details: {
          recipient: testNotification.recipient,
          template: template.name,
          message: message
        }
      });

    } catch (error) {
      console.error('Error sending notification:', error);
      toast({
        title: "Error",
        description: "Failed to send notification",
        variant: "destructive"
      });
    }
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
    setNewTemplate({ name: '', type: 'sms', subject: '', message: '', enabled: true });

    toast({
      title: "Success",
      description: "Notification template saved"
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
          <p className="text-gray-600">Manage SMS & Email notifications for customers</p>
        </div>
        <Badge variant="outline" className="text-green-600 border-green-600">
          SMS & Email Ready
        </Badge>
      </div>

      {/* Settings Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Notification Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
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
                <Label className="text-sm font-medium">Email Notifications</Label>
                <p className="text-xs text-gray-500">Send detailed updates via email</p>
              </div>
              <Switch 
                checked={settings.emailEnabled}
                onCheckedChange={(checked) => setSettings({...settings, emailEnabled: checked})}
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
        {/* Templates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Templates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {templates.map((template) => (
              <div key={template.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {template.type === 'sms' ? (
                      <MessageSquare className="h-4 w-4 text-blue-500" />
                    ) : (
                      <Mail className="h-4 w-4 text-green-500" />
                    )}
                    <span className="font-medium">{template.name}</span>
                  </div>
                  <Switch 
                    checked={template.enabled}
                    onCheckedChange={() => toggleTemplate(template.id)}
                  />
                </div>
                {template.subject && (
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    Subject: {template.subject}
                  </p>
                )}
                <p className="text-sm text-gray-600">{template.message}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Test Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Test Notification
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="template">Template</Label>
              <select 
                id="template"
                className="w-full mt-1 p-2 border rounded-md"
                value={testNotification.templateId}
                onChange={(e) => setTestNotification({...testNotification, templateId: e.target.value})}
              >
                <option value="">Select template</option>
                {templates.filter(t => t.enabled).map(template => (
                  <option key={template.id} value={template.id}>
                    {template.name} ({template.type.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="recipient">Recipient (Email/Phone)</Label>
              <Input
                id="recipient"
                value={testNotification.recipient}
                onChange={(e) => setTestNotification({...testNotification, recipient: e.target.value})}
                placeholder="customer@email.com or +1234567890"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label htmlFor="customerName">Customer Name</Label>
                <Input
                  id="customerName"
                  value={testNotification.customerName}
                  onChange={(e) => setTestNotification({...testNotification, customerName: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="token">Token</Label>
                <Input
                  id="token"
                  value={testNotification.token}
                  onChange={(e) => setTestNotification({...testNotification, token: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="counter">Counter</Label>
                <Input
                  id="counter"
                  value={testNotification.counter}
                  onChange={(e) => setTestNotification({...testNotification, counter: e.target.value})}
                />
              </div>
            </div>

            <Button onClick={sendTestNotification} className="w-full">
              Send Test Notification
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Create New Template */}
      <Card>
        <CardHeader>
          <CardTitle>Create New Template</CardTitle>
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
              <select 
                id="newType"
                className="w-full mt-1 p-2 border rounded-md"
                value={newTemplate.type}
                onChange={(e) => setNewTemplate({...newTemplate, type: e.target.value as 'sms' | 'email'})}
              >
                <option value="sms">SMS</option>
                <option value="email">Email</option>
              </select>
            </div>
          </div>

          {newTemplate.type === 'email' && (
            <div>
              <Label htmlFor="newSubject">Email Subject</Label>
              <Input
                id="newSubject"
                value={newTemplate.subject}
                onChange={(e) => setNewTemplate({...newTemplate, subject: e.target.value})}
                placeholder="Enter email subject"
              />
            </div>
          )}

          <div>
            <Label htmlFor="newMessage">Message</Label>
            <Textarea
              id="newMessage"
              value={newTemplate.message}
              onChange={(e) => setNewTemplate({...newTemplate, message: e.target.value})}
              placeholder="Enter message. Use {{customerName}}, {{token}}, {{counter}} for dynamic values"
              rows={4}
            />
          </div>

          <Button onClick={saveTemplate}>Save Template</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationCenter;
