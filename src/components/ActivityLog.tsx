
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Clock, User, Activity, FileText } from 'lucide-react';

interface ActivityEntry {
  id: string;
  timestamp: Date;
  user: string;
  action: string;
  details: string;
  category: 'registration' | 'queue' | 'transaction' | 'system';
}

const ActivityLog = () => {
  const [activities] = useState<ActivityEntry[]>([
    {
      id: 'ACT-001',
      timestamp: new Date('2025-01-27T09:15:00'),
      user: 'Admin',
      action: 'Customer Registration',
      details: 'New customer registered: Juan Dela Cruz (T-001)',
      category: 'registration'
    },
    {
      id: 'ACT-002',
      timestamp: new Date('2025-01-27T09:20:00'),
      user: 'Mel',
      action: 'Queue Call',
      details: 'Called customer T-001 to counter JA',
      category: 'queue'
    },
    {
      id: 'ACT-003',
      timestamp: new Date('2025-01-27T09:45:00'),
      user: 'Mel',
      action: 'Transaction Completed',
      details: 'OR-001 processed for ₱2,500.00 via GCash',
      category: 'transaction'
    },
    {
      id: 'ACT-004',
      timestamp: new Date('2025-01-27T10:00:00'),
      user: 'Admin',
      action: 'Priority Queue Update',
      details: 'Moved Rosa Martinez (T-005) to priority queue - PWD',
      category: 'queue'
    },
    {
      id: 'ACT-005',
      timestamp: new Date('2025-01-27T10:30:00'),
      user: 'Cashier',
      action: 'Financial Report',
      details: 'Generated daily transaction report',
      category: 'system'
    }
  ]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'registration':
        return <User className="h-4 w-4" />;
      case 'queue':
        return <Clock className="h-4 w-4" />;
      case 'transaction':
        return <FileText className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'registration':
        return 'bg-blue-100 text-blue-800';
      case 'queue':
        return 'bg-orange-100 text-orange-800';
      case 'transaction':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Activity Log</h1>
        <div className="flex gap-2">
          <Button variant="outline">Filter by Date</Button>
          <Button variant="outline">Export Log</Button>
          <Button className="bg-orange-500 hover:bg-orange-600">Refresh</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            System Activities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activities.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell className="font-mono text-sm">
                    {activity.timestamp.toLocaleString()}
                  </TableCell>
                  <TableCell className="font-medium">{activity.user}</TableCell>
                  <TableCell>
                    <Badge className={getCategoryColor(activity.category)}>
                      <div className="flex items-center gap-1">
                        {getCategoryIcon(activity.category)}
                        {activity.category}
                      </div>
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{activity.action}</TableCell>
                  <TableCell className="max-w-md">{activity.details}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-yellow-800">
            <Activity className="h-4 w-4" />
            <span className="text-sm font-medium">
              Activity entries are non-editable and non-deletable for audit compliance
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivityLog;
