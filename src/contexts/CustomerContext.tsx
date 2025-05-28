import React, { createContext, useContext, useState, ReactNode } from 'react';

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
  addCustomer: (customer: Omit<Customer, 'id' | 'token' | 'waitTime' | 'status' | 'registrationTime' | 'orNumber'>) => void;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
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
  const [customers, setCustomers] = useState<Customer[]>([
    { 
      id: '1', 
      name: 'Juan Dela Cruz', 
      contactNumber: '+63-912-345-6789',
      email: 'juan.delacruz@email.com',
      age: 65,
      address: 'Quezon City, Metro Manila',
      occupation: 'Retired Teacher',
      distribution: 'pickup',
      salesAgent: 'Mel',
      assignedDoctor: 'Dr. Maria Santos',
      prescription: { od: '-2.00', os: '-1.75', ou: '', pd: '62', add: '+1.50' },
      gradeType: 'Progressive (PROG)',
      lensType: 'Anti-radiation (MC)',
      frameCode: 'FR001',
      paymentInfo: { mode: 'Cash', amount: '2500.00' },
      remarks: 'First time customer, needs extra care',
      token: 'T-001', 
      priority: true, 
      priorityType: 'Senior Citizen', 
      waitTime: 5, 
      status: 'serving', 
      registrationTime: new Date('2025-01-27T09:00:00'),
      orNumber: 'OR-001'
    },
    { 
      id: '2', 
      name: 'Maria Santos', 
      contactNumber: '+63-917-123-4567',
      email: 'maria.santos@email.com',
      age: 32,
      address: 'Makati City, Metro Manila',
      occupation: 'Marketing Manager',
      distribution: 'lalamove',
      salesAgent: 'Ace',
      assignedDoctor: 'Dr. Pedro Garcia',
      prescription: { od: '-1.25', os: '-1.50', ou: '', pd: '58', add: '' },
      gradeType: 'Single Grade (SV)',
      lensType: 'Anti-blue light (BB)',
      frameCode: 'FR002',
      paymentInfo: { mode: 'Gcash', amount: '1800.00' },
      remarks: 'Prefers lightweight frames',
      token: 'T-002', 
      priority: false, 
      waitTime: 12, 
      status: 'waiting', 
      registrationTime: new Date('2025-01-27T09:15:00'),
      orNumber: 'OR-002'
    },
    { 
      id: '3', 
      name: 'Ana Rodriguez', 
      contactNumber: '+63-928-765-4321',
      email: 'ana.rodriguez@email.com',
      age: 28,
      address: 'Pasig City, Metro Manila',
      occupation: 'Nurse',
      distribution: 'pickup',
      salesAgent: 'Yhel',
      assignedDoctor: 'Dr. Rosa Martinez',
      prescription: { od: '-0.75', os: '-1.00', ou: '', pd: '60', add: '' },
      gradeType: 'Single Vision-Reading (SV-READING)',
      lensType: 'Photochromic anti-radiation (TRG)',
      frameCode: 'FR003',
      paymentInfo: { mode: 'Maya', amount: '2200.00' },
      remarks: 'Pregnant, needs priority service',
      token: 'T-003', 
      priority: true, 
      priorityType: 'Pregnant', 
      waitTime: 8, 
      status: 'waiting', 
      registrationTime: new Date('2025-01-27T09:30:00'),
      orNumber: 'OR-003'
    },
    { 
      id: '4', 
      name: 'Pedro Garcia', 
      contactNumber: '+63-915-987-6543',
      email: 'pedro.garcia@email.com',
      age: 45,
      address: 'Taguig City, Metro Manila',
      occupation: 'Engineer',
      distribution: 'lbc',
      salesAgent: 'Jil',
      assignedDoctor: 'Dr. Juan Dela Cruz',
      prescription: { od: '-3.25', os: '-3.00', ou: '', pd: '64', add: '+2.00' },
      gradeType: 'Process-Progressive (PROC-PROG)',
      lensType: 'Ultra-Thin High Cylinder 1.61 (UTH 1.61 HC)',
      frameCode: 'FR004',
      paymentInfo: { mode: 'Credit Card', amount: '4500.00' },
      remarks: 'High prescription, requires special handling',
      token: 'T-004', 
      priority: false, 
      waitTime: 15, 
      status: 'waiting', 
      registrationTime: new Date('2025-01-27T09:45:00'),
      orNumber: 'OR-004'
    },
    { 
      id: '5', 
      name: 'Rosa Martinez', 
      contactNumber: '+63-922-345-6789',
      email: 'rosa.martinez@email.com',
      age: 38,
      address: 'Mandaluyong City, Metro Manila',
      occupation: 'Teacher',
      distribution: 'pickup',
      salesAgent: 'Jeselle',
      assignedDoctor: 'Dr. Ana Rodriguez',
      prescription: { od: '-2.50', os: '-2.25', ou: '', pd: '59', add: '' },
      gradeType: 'Flat-Top (F.T)',
      lensType: 'Photochromic anti-blue light (BTS)',
      frameCode: 'FR005',
      paymentInfo: { mode: 'Bank Transfer', amount: '3200.00' },
      remarks: 'PWD discount applied',
      token: 'T-005', 
      priority: true, 
      priorityType: 'PWD', 
      waitTime: 3, 
      status: 'waiting', 
      registrationTime: new Date('2025-01-27T10:00:00'),
      orNumber: 'OR-005'
    }
  ]);

  const addCustomer = (customerData: Omit<Customer, 'id' | 'token' | 'waitTime' | 'status' | 'registrationTime' | 'orNumber'>) => {
    const newCustomer: Customer = {
      ...customerData,
      id: Date.now().toString(),
      token: `T-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      waitTime: 0,
      status: 'waiting',
      registrationTime: new Date(),
      orNumber: `OR-${Date.now()}`
    };
    
    setCustomers(prev => [...prev, newCustomer]);
    console.log('Customer added to queue:', newCustomer);
  };

  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    setCustomers(prev => prev.map(customer => 
      customer.id === id ? { ...customer, ...updates } : customer
    ));
  };

  return (
    <CustomerContext.Provider value={{ customers, addCustomer, updateCustomer }}>
      {children}
    </CustomerContext.Provider>
  );
};
