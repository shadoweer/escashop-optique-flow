
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Customer {
  id: string;
  name: string;
  token: string;
  contactNumber: string;
  email: string;
  waitTime: number;
  status: string;
}

export const useNotifications = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const sendSMSNotification = async (customer: Customer) => {
    setLoading(true);
    try {
      console.log(`Sending SMS notification to customer ${customer.id}`);
      
      const { data, error } = await supabase.functions.invoke('send-notification', {
        body: {
          customerId: customer.id,
          type: 'sms',
          customerName: customer.name,
          customerPhone: customer.contactNumber,
          token: customer.token,
          waitTime: customer.waitTime,
        },
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: `SMS notification sent to ${customer.name}`,
      });

      return data;
    } catch (error) {
      console.error('Failed to send SMS notification:', error);
      
      let errorMessage = 'Failed to send SMS notification';
      if (error.message?.includes('credentials not configured')) {
        errorMessage = 'SMS service not configured. Please add API keys in settings.';
      } else if (error.message?.includes('required')) {
        errorMessage = 'Customer phone number is missing';
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const sendBulkSMSNotifications = async (customers: Customer[]) => {
    setLoading(true);
    let successCount = 0;
    let errorCount = 0;

    try {
      for (const customer of customers) {
        try {
          await sendSMSNotification(customer);
          successCount++;
        } catch (error) {
          errorCount++;
          console.error(`Failed to send SMS to ${customer.name}:`, error);
        }
      }

      toast({
        title: "Bulk SMS Complete",
        description: `Sent ${successCount} SMS notifications successfully. ${errorCount > 0 ? `${errorCount} failed.` : ''}`,
        variant: errorCount > 0 ? "destructive" : "default",
      });

    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    sendSMSNotification,
    sendBulkSMSNotifications,
  };
};
