
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Customer } from '@/contexts/CustomerContext';

export const useCustomerData = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('registration_time', { ascending: true });

      if (error) {
        console.error('Error fetching customers:', error);
        return;
      }

      // Transform database data to frontend format
      const transformedCustomers: Customer[] = data.map(customer => ({
        id: customer.id,
        name: customer.name,
        contactNumber: customer.contact_number,
        email: customer.email,
        age: customer.age,
        address: customer.address,
        occupation: customer.occupation,
        distribution: customer.distribution,
        salesAgent: customer.sales_agent,
        assignedDoctor: customer.assigned_doctor,
        prescription: typeof customer.prescription === 'object' && customer.prescription !== null 
          ? {
              od: (customer.prescription as any).od || '',
              os: (customer.prescription as any).os || '',
              ou: (customer.prescription as any).ou || '',
              pd: (customer.prescription as any).pd || '',
              add: (customer.prescription as any).add || ''
            }
          : {
              od: '',
              os: '',
              ou: '',
              pd: '',
              add: ''
            },
        gradeType: customer.grade_type,
        lensType: customer.lens_type,
        frameCode: customer.frame_code,
        paymentInfo: typeof customer.payment_info === 'object' && customer.payment_info !== null
          ? {
              mode: (customer.payment_info as any).mode || '',
              amount: (customer.payment_info as any).amount || ''
            }
          : {
              mode: '',
              amount: ''
            },
        remarks: customer.remarks || '',
        token: customer.token,
        priority: customer.priority,
        priorityType: customer.priority_type,
        waitTime: customer.wait_time,
        status: customer.status as 'waiting' | 'serving' | 'completed',
        registrationTime: new Date(customer.registration_time),
        orNumber: customer.or_number
      }));

      setCustomers(transformedCustomers);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();

    // Set up real-time subscription
    const channel = supabase
      .channel('customers-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'customers'
        },
        () => {
          console.log('Customer data changed, refreshing...');
          fetchCustomers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { customers, loading, refetch: fetchCustomers };
};
