
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Send, MessageSquare, Mail, Volume2, CheckCircle, XCircle } from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  token: string;
  phone: string;
  email: string;
  status: 'waiting' | 'serving' | 'completed';
}

interface Notification {
  id: string;
  customerId: string;
  customerName: string;
  token: string;
  type: 'SMS' | 'Email';
  message: string;
  status: 'success' | 'failure';
  sentAt: Date;
}

const NotificationSystem = () => {
  const [activeTab, setActiveTab] = useState<'send' | 'log'>('send');
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [notificationType, setNotificationType] = useState<'SMS' | 'Email'>('SMS');
  const [customMessage, setCustomMessage] = useState('');
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      customerId: '1',
      customerName: 'Juan Dela Cruz',
      token: 'T-001',
      type: 'SMS',
      message: 'Your turn is coming up. Please be ready.',
      status: 'success',
      sentAt: new Date(Date.now() - 300000) // 5 minutes ago
    },
    {
      id: '2',
      customerId: '2',
      customerName: 'Maria Santos',
      token: 'T-002',
      type: 'Email',
      message: 'Thank you for waiting. Your estimated wait time is 10 minutes.',
      status: 'success',
      sentAt: new Date(Date.now() - 600000) // 10 minutes ago
    },
    {
      id: '3',
      customerId: '3',
      customerName: 'Ana Rodriguez',
      token: 'T-003',
      type: 'SMS',
      message: 'Please proceed to counter JA for your eye examination.',
      status: 'failure',
      sentAt: new Date(Date.now() - 120000) // 2 minutes ago
    }
  ]);

  // Sample customer data
  const customers: Customer[] = [
    { id: '1', name: 'Juan Dela Cruz', token: 'T-001', phone: '+639123456789', email: 'juan@email.com', status: 'serving' },
    { id: '2', name: 'Maria Santos', token: 'T-002', phone: '+639123456790', email: 'maria@email.com', status: 'waiting' },
    { id: '3', name: 'Ana Rodriguez', token: 'T-003', phone: '+639123456791', email: 'ana@email.com', status: 'waiting' },
    { id: '4', name: 'Pedro Garcia', token: 'T-004', phone: '+639123456792', email: 'pedro@email.com', status: 'waiting' },
  ];

  const { toast } = useToast();

  // ST-402: Predefined messages including customer name and token
  const predefinedMessages = {
    SMS: [
      'Hi {name}, your token {token} will be called in 5 minutes. Please be ready.',
      'Dear {name}, please proceed to the counter for token {token}.',
      'Token {token} ({name}), your turn is next. Please prepare your requirements.',
      'Hi {name}, we apologize for the delay. Your token {token} will be called shortly.'
    ],
    Email: [
      'Dear {name}, this is to inform you that your token {token} will be called soon. Please be ready with your requirements.',
      'Hello {name}, your eye examination for token {token} is about to begin. Please proceed to the designated counter.',
      'Hi {name}, thank you for your patience. Token {token} will be called within the next few minutes.',
      'Dear {name}, your appointment for token {token} is ready. Please come to the counter when called.'
    ]
  };

  const handleCustomerSelection = (customerId: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedCustomers([...selectedCustomers, customerId]);
    } else {
      setSelectedCustomers(selectedCustomers.filter(id => id !== customerId));
    }
  };

  const selectAllCustomers = () => {
    const waitingCustomers = customers.filter(c => c.status === 'waiting').map(c => c.id);
    setSelectedCustomers(waitingCustomers);
  };

  const clearSelection = () => {
    setSelectedCustomers([]);
  };

  // ST-401: Send SMS or Email to selected customers
  const sendNotifications = () => {
    if (selectedCustomers.length === 0) {
      toast({
        title: "No Customers Selected",
        description: "Please select at least one customer to send notifications.",
        variant: "destructive"
      });
      return;
    }

    const selectedCustomerData = customers.filter(c => selectedCustomers.includes(c.id));
    const newNotifications: Notification[] = [];

    selectedCustomerData.forEach(customer => {
      // ST-402: Replace placeholders with customer name and token
      const messageTemplate = customMessage || predefinedMessages[notificationType][0];
      const finalMessage = messageTemplate
        .replace('{name}', customer.name)
        .replace('{token}', customer.token);

      const notification: Notification = {
        id: Date.now().toString() + customer.id,
        customerId: customer.id,
        customerName: customer.name,
        token: customer.token,
        type: notificationType,
        message: finalMessage,
        status: Math.random() > 0.1 ? 'success' : 'failure', // 90% success rate simulation
        sentAt: new Date()
      };

      newNotifications.push(notification);
    });

    setNotifications([...newNotifications, ...notifications]);

    // ST-403: Sound effect simulation
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+byz2kcDz2V3fLOciYFJXfJ8N+OPAYTXrTn66lcFAg+leDx0W4cDT+U3fLPdCUFKHfH8+COPAkUXLLp6aleFAlBnOPy0G8dDDiS2+/IciUGKn3J8t+IPQcTXLPn66lcFApBmOPz0HAcDDuQ2+/JdSYGKHnG8+COPAkUXLLp6apcFAhBnOLy0G8dDDeS2+/JdCUGKnzK8t+IPAYSWrPn6qpdEwlBnOLy0W4dDDqS2+/JdSYFKXfJ8t+OPAcTXLPn6qpdEwlAmeLyz2wbDDuR2+/KdSYGKXrK8uCOPAcTXLPn6qpdEwlAmeLyz2wbDT2U3fLOdCYEKnzJ8t+OPAkTXLPp6qpdFAlBneLy0G8dDECU2+/JdSYFKnzJ8t+OPAcTXLPn6qpdEwlAmeLyz2wbDEGU3PLOdCYEKnvJ8+COPAcTXbTp6qldEwpBmOLy0G8dDECR2O/JdCYEK3zJ8+COPAcTXbPp6qpdEwlBmOLy0G8dDECS2e/JdSQFKnvJ8+COPAcTXbPp6qhdEwlBmOLy0G8dDDmR2O/KdSYEKnvJ8+COPAcSXbPp6qhdEwlBmOLy0G8dDDmR2O/KdSYEKnvJ8+COPAcSXbTp6qhdEwlBmOLy0G8dDDiR2O/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDiR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwlBmOLy0G8dDDaR2e/KdSYEKnvJ8+COOwgTXbPp6qhdEwl');
    audio.play().catch(() => {
      console.log('🔊 Sound effect would play here for calling customer');
    });

    const successCount = newNotifications.filter(n => n.status === 'success').length;
    const totalSent = newNotifications.length;

    toast({
      title: "Notifications Sent",
      description: `Successfully sent ${successCount}/${totalSent} ${notificationType} notifications.`,
      variant: successCount === totalSent ? "default" : "destructive"
    });

    setSelectedCustomers([]);
    setCustomMessage('');
  };

  // ST-404: Statistics for sent notifications
  const smsCount = notifications.filter(n => n.type === 'SMS').length;
  const emailCount = notifications.filter(n => n.type === 'Email').length;
  const successRate = notifications.length > 0 
    ? Math.round((notifications.filter(n => n.status === 'success').length / notifications.length) * 100) 
    : 0;

  const renderSendNotifications = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Send Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Notification Type Selection */}
          <div className="space-y-2">
            <Label>Notification Type</Label>
            <div className="flex gap-4">
              <Button
                variant={notificationType === 'SMS' ? 'default' : 'outline'}
                onClick={() => setNotificationType('SMS')}
                className={notificationType === 'SMS' ? 'bg-orange-500 hover:bg-orange-600' : ''}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                SMS
              </Button>
              <Button
                variant={notificationType === 'Email' ? 'default' : 'outline'}
                onClick={() => setNotificationType('Email')}
                className={notificationType === 'Email' ? 'bg-orange-500 hover:bg-orange-600' : ''}
              >
                <Mail className="h-4 w-4 mr-2" />
                Email
              </Button>
            </div>
          </div>

          {/* Customer Selection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Select Customers</Label>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={selectAllCustomers}>
                  Select All Waiting
                </Button>
                <Button size="sm" variant="outline" onClick={clearSelection}>
                  Clear Selection
                </Button>
              </div>
            </div>
            
            <div className="grid gap-3 max-h-64 overflow-y-auto">
              {customers.map((customer) => (
                <div key={customer.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Checkbox
                    id={customer.id}
                    checked={selectedCustomers.includes(customer.id)}
                    onCheckedChange={(checked) => handleCustomerSelection(customer.id, !!checked)}
                    disabled={customer.status === 'completed'}
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{customer.name}</p>
                        <p className="text-sm text-gray-600">Token: {customer.token}</p>
                      </div>
                      <Badge variant={
                        customer.status === 'serving' ? 'default' : 
                        customer.status === 'waiting' ? 'secondary' : 'outline'
                      }>
                        {customer.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">
                      {notificationType === 'SMS' ? customer.phone : customer.email}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Message Template */}
          <div className="space-y-4">
            <Label>Message Template</Label>
            <Select 
              value={customMessage} 
              onValueChange={setCustomMessage}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a predefined message or write custom" />
              </SelectTrigger>
              <SelectContent>
                {predefinedMessages[notificationType].map((message, index) => (
                  <SelectItem key={index} value={message}>
                    {message.substring(0, 60)}...
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="space-y-2">
              <Label htmlFor="customMessage">Custom Message</Label>
              <Textarea
                id="customMessage"
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder={`Write your custom ${notificationType} message here. Use {name} and {token} for placeholders.`}
                rows={4}
              />
              <p className="text-sm text-gray-500">
                Use placeholders: {'{name}'} for customer name, {'{token}'} for token number
              </p>
            </div>
          </div>

          {/* Send Button */}
          <Button 
            onClick={sendNotifications} 
            className="w-full bg-orange-500 hover:bg-orange-600"
            disabled={selectedCustomers.length === 0}
          >
            <Send className="h-4 w-4 mr-2" />
            Send {notificationType} to {selectedCustomers.length} Customer{selectedCustomers.length !== 1 ? 's' : ''}
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderNotificationLog = () => (
    <div className="space-y-6">
      {/* ST-404: Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">SMS Sent</p>
                <p className="text-3xl font-bold text-blue-600">{smsCount}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Emails Sent</p>
                <p className="text-3xl font-bold text-green-600">{emailCount}</p>
              </div>
              <Mail className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-3xl font-bold text-orange-500">{successRate}%</p>
              </div>
              <Volume2 className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notification Log */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Log</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div key={notification.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                <div className="flex-shrink-0">
                  {notification.type === 'SMS' ? (
                    <MessageSquare className="h-5 w-5 text-blue-600" />
                  ) : (
                    <Mail className="h-5 w-5 text-green-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">{notification.customerName} ({notification.token})</p>
                    <div className="flex items-center space-x-2">
                      <Badge variant={notification.type === 'SMS' ? 'secondary' : 'outline'}>
                        {notification.type}
                      </Badge>
                      {notification.status === 'success' ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {notification.sentAt.toLocaleString()} | Status: {notification.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex space-x-2">
        <Button
          variant={activeTab === 'send' ? 'default' : 'outline'}
          onClick={() => setActiveTab('send')}
          className={activeTab === 'send' ? 'bg-orange-500 hover:bg-orange-600' : ''}
        >
          Send Notification
        </Button>
        <Button
          variant={activeTab === 'log' ? 'default' : 'outline'}
          onClick={() => setActiveTab('log')}
          className={activeTab === 'log' ? 'bg-orange-500 hover:bg-orange-600' : ''}
        >
          Notification Log
        </Button>
      </div>

      {/* Content */}
      {activeTab === 'send' && renderSendNotifications()}
      {activeTab === 'log' && renderNotificationLog()}
    </div>
  );
};

export default NotificationSystem;
