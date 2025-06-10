
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Settings, CheckCircle, AlertCircle, ExternalLink, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const NotificationSetup = () => {
  const { toast } = useToast();
  const [testPhone, setTestPhone] = useState('');
  const [testing, setTesting] = useState(false);

  const testNotification = async () => {
    if (!testPhone) {
      toast({
        title: "Error",
        description: "Please enter a phone number",
        variant: "destructive",
      });
      return;
    }

    setTesting(true);
    
    try {
      const testData = {
        customerId: 'test-customer',
        type: 'sms',
        customerName: 'Test Customer',
        customerPhone: testPhone,
        token: 'TEST01',
        waitTime: 15,
      };

      console.log('Testing SMS notification:', testData);
      
      // Call the actual notification function
      const { data, error } = await supabase.functions.invoke('send-notification', {
        body: testData,
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Test SMS Sent Successfully!",
        description: `Test SMS notification sent to ${testPhone}. Check your phone.`,
      });
    } catch (error) {
      console.error('Test SMS failed:', error);
      toast({
        title: "Test Failed",
        description: `Failed to send test SMS: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">SMS Service Setup</h2>
        <Badge variant="outline" className="flex items-center gap-2 text-green-600 border-green-600">
          <CheckCircle className="h-3 w-3" />
          Twilio Configured
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Twilio SMS Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-900">Twilio API Keys Configured</h4>
                <p className="text-sm text-green-700 mt-1">
                  Your Twilio credentials have been successfully configured:
                </p>
                <ul className="text-sm text-green-700 mt-2 space-y-1">
                  <li>• Account SID: ACc276c280eb5088c4234ca3233c0e5ea5</li>
                  <li>• Auth Token: ••••••••••••••••••••••••••••••••</li>
                  <li>• Phone Number: +14144045399</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-900">Important Notes for Philippines SMS</h4>
                <ul className="text-sm text-yellow-700 mt-2 space-y-1">
                  <li>• Use international format: +639XXXXXXXXX</li>
                  <li>• For trial accounts, verify your phone number in Twilio console</li>
                  <li>• US numbers may have delivery restrictions to Philippines</li>
                  <li>• Check Twilio logs if messages don't arrive</li>
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
                placeholder="+639XXXXXXXXX or 09XXXXXXXXX"
                value={testPhone}
                onChange={(e) => setTestPhone(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                Philippine format: +639XXXXXXXXX or 09XXXXXXXXX
              </p>
            </div>
            <Button
              onClick={testNotification}
              disabled={testing || !testPhone}
              className="w-full"
            >
              {testing ? 'Sending...' : 'Send Test SMS'}
            </Button>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium mb-2 text-blue-900">SMS Service Status:</h4>
            <div className="flex items-center gap-2 text-blue-800">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm">Ready to send SMS notifications to customers</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-orange-50 border-orange-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-orange-800">
            <Phone className="h-4 w-4" />
            <span className="text-sm font-medium">
              SMS notifications are configured with Twilio. Test the service above to ensure delivery to Philippine numbers.
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationSetup;
