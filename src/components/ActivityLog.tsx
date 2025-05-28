
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Clock, User, Activity, FileText, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ActivityEntry {
  id: string;
  activity_type: string;
  user_type: string;
  user_name: string;
  description: string;
  details: any;
  timestamp: string;
  ip_address?: string;
  customer_id?: string;
}

const ActivityLog = () => {
  const [activities, setActivities] = useState<ActivityEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchActivities = async () => {
    try {
      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(100);

      if (error) {
        console.error('Error fetching activities:', error);
        return;
      }

      setActivities(data || []);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();

    // Set up real-time subscription for activity logs
    const channel = supabase
      .channel('activity-logs-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'activity_logs'
        },
        () => {
          console.log('New activity logged, refreshing...');
          fetchActivities();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading activities...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Activity Log</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchActivities}>Refresh</Button>
          <Button variant="outline">Filter by Date</Button>
          <Button variant="outline">Export Log</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            System Activities ({activities.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activities.length === 0 ? (
            <div className="text-center py-8">
              <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No activities recorded yet</p>
              <p className="text-sm text-gray-400">Activities will appear here as customers are registered and processed</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activities.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell className="font-mono text-sm">
                      {new Date(activity.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell className="font-medium">{activity.user_name}</TableCell>
                    <TableCell>
                      <Badge className={getCategoryColor(activity.activity_type)}>
                        <div className="flex items-center gap-1">
                          {getCategoryIcon(activity.activity_type)}
                          {activity.activity_type}
                        </div>
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{activity.description}</TableCell>
                    <TableCell className="max-w-md">
                      {activity.details && (
                        <pre className="text-xs bg-gray-50 p-2 rounded overflow-auto">
                          {JSON.stringify(activity.details, null, 2)}
                        </pre>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-yellow-800">
            <Activity className="h-4 w-4" />
            <span className="text-sm font-medium">
              Activity entries are automatically logged and non-editable for audit compliance
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivityLog;
