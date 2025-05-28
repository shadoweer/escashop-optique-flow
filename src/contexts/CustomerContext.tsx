
import React, { createContext, useContext, ReactNode } from 'react';
import { useCustomerData } from '@/hooks/useCustomerData';
import { useCustomerOperations } from '@/hooks/useCustomerOperations';

export interface Customer {
  id: string;
  name: string;
  contactNumber: string;
  email: string;
  age: number;
  address: string;
  occupation: string;
  distribution: string;
  salesAgent: string;
  assignedDoctor: string;
  prescription: {
    od: string;
    os: string;
    ou: string;
    pd: string;
    add: string;
  };
  gradeType: string;
  lensType: string;
  frameCode: string;
  paymentInfo: {
    mode: string;
    amount: string;
  };
  remarks: string;
  token: string;
  priority: boolean;
  priorityType?: string;
  waitTime: number;
  status: 'waiting' | 'serving' | 'completed';
  registrationTime: Date;
  orNumber: string;
}

interface CustomerContextType {
  customers: Customer[];
  loading: boolean;
  addCustomer: (customer: Omit<Customer, 'id' | 'token' | 'waitTime' | 'status' | 'registrationTime' | 'orNumber'>) => Promise<void>;
  updateCustomer: (id: string, updates: Partial<Customer>) => Promise<void>;
  refetch: () => void;
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export const useCustomers = () => {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error('useCustomers must be used within a CustomerProvider');
  }
  return context;
};

export const CustomerProvider = ({ children }: { children: ReactNode }) => {
  const { customers, loading, refetch } = useCustomerData();
  const { addCustomerToDatabase, updateCustomerInDatabase, logActivity } = useCustomerOperations();

  const addCustomer = async (customerData: Omit<Customer, 'id' | 'token' | 'waitTime' | 'status' | 'registrationTime' | 'orNumber'>) => {
    const result = await addCustomerToDatabase(customerData);
    if (result) {
      // Log the registration activity
      await logActivity({
        activity_type: 'registration',
        user_type: 'admin',
        user_name: 'System Admin',
        description: `Customer ${result.name} registered with token ${result.token}`,
        details: { customer_id: result.id, token: result.token },
        customer_id: result.id
      });
      
      // Refresh the customer list
      refetch();
    }
  };

  const updateCustomer = async (id: string, updates: Partial<Customer>) => {
    const success = await updateCustomerInDatabase(id, updates);
    if (success) {
      // Log the update activity
      await logActivity({
        activity_type: 'queue',
        user_type: 'admin',
        user_name: 'System Admin',
        description: `Customer updated: ${Object.keys(updates).join(', ')}`,
        details: updates,
        customer_id: id
      });
      
      // Refresh the customer list
      refetch();
    }
  };

  return (
    <CustomerContext.Provider value={{ customers, loading, addCustomer, updateCustomer, refetch }}>
      {children}
    </CustomerContext.Provider>
  );
};
