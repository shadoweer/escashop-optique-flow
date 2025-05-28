
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

  const sendNotification = async (customer: Customer, type: 'sms' | 'email') => {
    setLoading(true);
    try {
      console.log(`Sending ${type} notification to customer ${customer.id}`);
      
      const { data, error } = await supabase.functions.invoke('send-notification', {
        body: {
          customerId: customer.id,
          type,
          customerName: customer.name,
          customerPhone: customer.contactNumber,
          customerEmail: customer.email,
          token: customer.token,
          waitTime: customer.waitTime,
        },
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: `${type.toUpperCase()} notification sent to ${customer.name}`,
      });

      return data;
    } catch (error) {
      console.error(`Failed to send ${type} notification:`, error);
      
      let errorMessage = `Failed to send ${type} notification`;
      if (error.message?.includes('credentials not configured')) {
        errorMessage = `${type.toUpperCase()} service not configured. Please add API keys in settings.`;
      } else if (error.message?.includes('required')) {
        errorMessage = `Customer ${type === 'sms' ? 'phone number' : 'email'} is missing`;
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

  const sendBulkNotifications = async (customers: Customer[], type: 'sms' | 'email') => {
    setLoading(true);
    let successCount = 0;
    let errorCount = 0;

    try {
      for (const customer of customers) {
        try {
          await sendNotification(customer, type);
          successCount++;
        } catch (error) {
          errorCount++;
          console.error(`Failed to send ${type} to ${customer.name}:`, error);
        }
      }

      toast({
        title: "Bulk Notification Complete",
        description: `Sent ${successCount} notifications successfully. ${errorCount > 0 ? `${errorCount} failed.` : ''}`,
        variant: errorCount > 0 ? "destructive" : "default",
      });

    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    sendNotification,
    sendBulkNotifications,
  };
};
