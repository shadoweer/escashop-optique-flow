
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Customer } from '@/contexts/CustomerContext';

export const useCustomerOperations = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const addCustomerToDatabase = async (customerData: Omit<Customer, 'id' | 'token' | 'waitTime' | 'status' | 'registrationTime' | 'orNumber'>) => {
    setLoading(true);
    try {
      const newCustomer = {
        name: customerData.name,
        contact_number: customerData.contactNumber,
        email: customerData.email,
        age: customerData.age,
        address: customerData.address,
        occupation: customerData.occupation,
        distribution: customerData.distribution,
        sales_agent: customerData.salesAgent,
        assigned_doctor: customerData.assignedDoctor,
        prescription: customerData.prescription,
        grade_type: customerData.gradeType,
        lens_type: customerData.lensType,
        frame_code: customerData.frameCode,
        payment_info: customerData.paymentInfo,
        remarks: customerData.remarks,
        token: `T-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        priority: customerData.priority,
        priority_type: customerData.priorityType,
        wait_time: 0,
        status: 'waiting' as const,
        or_number: `OR-${Date.now()}`
      };

      const { data, error } = await supabase
        .from('customers')
        .insert([newCustomer])
        .select()
        .single();

      if (error) {
        console.error('Error adding customer:', error);
        toast({
          title: "Error",
          description: "Failed to register customer. Please try again.",
          variant: "destructive"
        });
        return null;
      }

      toast({
        title: "Customer Registered Successfully",
        description: `Customer ${data.name} has been added to the queue with token ${data.token}.`
      });

      return data;
    } catch (error) {
      console.error('Error adding customer:', error);
      toast({
        title: "Error",
        description: "Failed to register customer. Please try again.",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateCustomerInDatabase = async (id: string, updates: Partial<Customer>) => {
    try {
      const dbUpdates: any = {};
      
      // Map frontend field names to database field names
      if (updates.contactNumber !== undefined) dbUpdates.contact_number = updates.contactNumber;
      if (updates.salesAgent !== undefined) dbUpdates.sales_agent = updates.salesAgent;
      if (updates.assignedDoctor !== undefined) dbUpdates.assigned_doctor = updates.assignedDoctor;
      if (updates.gradeType !== undefined) dbUpdates.grade_type = updates.gradeType;
      if (updates.lensType !== undefined) dbUpdates.lens_type = updates.lensType;
      if (updates.frameCode !== undefined) dbUpdates.frame_code = updates.frameCode;
      if (updates.paymentInfo !== undefined) dbUpdates.payment_info = updates.paymentInfo;
      if (updates.priorityType !== undefined) dbUpdates.priority_type = updates.priorityType;
      if (updates.waitTime !== undefined) dbUpdates.wait_time = updates.waitTime;
      if (updates.registrationTime !== undefined) dbUpdates.registration_time = updates.registrationTime;
      if (updates.orNumber !== undefined) dbUpdates.or_number = updates.orNumber;
      
      // Direct mappings
      if (updates.name !== undefined) dbUpdates.name = updates.name;
      if (updates.email !== undefined) dbUpdates.email = updates.email;
      if (updates.age !== undefined) dbUpdates.age = updates.age;
      if (updates.address !== undefined) dbUpdates.address = updates.address;
      if (updates.occupation !== undefined) dbUpdates.occupation = updates.occupation;
      if (updates.distribution !== undefined) dbUpdates.distribution = updates.distribution;
      if (updates.prescription !== undefined) dbUpdates.prescription = updates.prescription;
      if (updates.remarks !== undefined) dbUpdates.remarks = updates.remarks;
      if (updates.token !== undefined) dbUpdates.token = updates.token;
      if (updates.priority !== undefined) dbUpdates.priority = updates.priority;
      if (updates.status !== undefined) dbUpdates.status = updates.status;

      const { error } = await supabase
        .from('customers')
        .update(dbUpdates)
        .eq('id', id);

      if (error) {
        console.error('Error updating customer:', error);
        toast({
          title: "Error",
          description: "Failed to update customer. Please try again.",
          variant: "destructive"
        });
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error updating customer:', error);
      return false;
    }
  };

  const logActivity = async (activityData: {
    activity_type: string;
    user_type: string;
    user_name: string;
    description: string;
    details?: any;
    customer_id?: string;
  }) => {
    try {
      const { error } = await supabase
        .from('activity_logs')
        .insert([activityData]);

      if (error) {
        console.error('Error logging activity:', error);
      }
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  };

  return {
    addCustomerToDatabase,
    updateCustomerInDatabase,
    logActivity,
    loading
  };
};
