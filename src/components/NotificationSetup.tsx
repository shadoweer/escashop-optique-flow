
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Mail, Settings, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const NotificationSetup = () => {
  const { toast } = useToast();
  const [testPhone, setTestPhone] = useState('');
  const [testEmail, setTestEmail] = useState('');
  const [testing, setTesting] = useState(false);

  const testNotification = async (type: 'sms' | 'email') => {
    setTesting(true);
    
    try {
      const testData = {
        customerId: 'test-customer',
        type,
        customerName: 'Test Customer',
        customerPhone: type === 'sms' ? testPhone : undefined,
        customerEmail: type === 'email' ? testEmail : undefined,
        token: 'TEST01',
        waitTime: 15,
      };

      // This would use the actual notification function
      console.log('Testing notification:', testData);
      
      toast({
        title: "Test Notification",
        description: `Test ${type} notification would be sent`,
      });
    } catch (error) {
      toast({
        title: "Test Failed",
        description: `Failed to send test ${type}`,
        variant: "destructive",
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Notification Service Setup</h2>
        <Badge variant="outline" className="flex items-center gap-2">
          <Settings className="h-3 w-3" />
          Configuration Required
        </Badge>
      </div>

      <Tabs defaultValue="sms" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="sms" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            SMS Setup
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email Setup
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sms" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Twilio SMS Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900">Required Twilio Secrets</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Add these secrets in your Supabase Edge Functions settings:
                    </p>
                    <ul className="text-sm text-blue-700 mt-2 space-y-1">
                      <li>• <code>TWILIO_ACCOUNT_SID</code></li>
                      <li>• <code>TWILIO_AUTH_TOKEN</code></li>
                      <li>• <code>TWILIO_PHONE_NUMBER</code></li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <Label htmlFor="test-phone">Test Phone Number</Label>
                  <Input
                    id="test-phone"
                    type="tel"
                    placeholder="+1234567890"
                    value={testPhone}
                    onChange={(e) => setTestPhone(e.target.value)}
                  />
                </div>
                <Button
                  onClick={() => testNotification('sms')}
                  disabled={testing || !testPhone}
                  className="w-full"
                >
                  {testing ? 'Sending...' : 'Send Test SMS'}
                </Button>
              </div>

              <div className="bg-gray-50 border rounded-lg p-4">
                <h4 className="font-medium mb-2">Setup Instructions:</h4>
                <ol className="text-sm space-y-1 list-decimal list-inside text-gray-600">
                  <li>Create a Twilio account at twilio.com</li>
                  <li>Get your Account SID and Auth Token from the console</li>
                  <li>Purchase a phone number for sending SMS</li>
                  <li>Add the credentials to Supabase Edge Functions secrets</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Resend Email Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-green-900">Required Resend Secret</h4>
                    <p className="text-sm text-green-700 mt-1">
                      Add this secret in your Supabase Edge Functions settings:
                    </p>
                    <ul className="text-sm text-green-700 mt-2">
                      <li>• <code>RESEND_API_KEY</code></li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <Label htmlFor="test-email">Test Email Address</Label>
                  <Input
                    id="test-email"
                    type="email"
                    placeholder="test@example.com"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                  />
                </div>
                <Button
                  onClick={() => testNotification('email')}
                  disabled={testing || !testEmail}
                  className="w-full"
                >
                  {testing ? 'Sending...' : 'Send Test Email'}
                </Button>
              </div>

              <div className="bg-gray-50 border rounded-lg p-4">
                <h4 className="font-medium mb-2">Setup Instructions:</h4>
                <ol className="text-sm space-y-1 list-decimal list-inside text-gray-600">
                  <li>Create a Resend account at resend.com</li>
                  <li>Verify your sending domain</li>
                  <li>Generate an API key from the dashboard</li>
                  <li>Add the API key to Supabase Edge Functions secrets</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="bg-orange-50 border-orange-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-orange-800">
            <ExternalLink className="h-4 w-4" />
            <span className="text-sm font-medium">
              Configure API keys in Supabase Edge Functions settings to enable notifications
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationSetup;
