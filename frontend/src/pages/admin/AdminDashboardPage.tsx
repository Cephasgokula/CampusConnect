import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchAdminEvents } from '@/api/events';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { EventItem } from '@/types';

export const AdminDashboardPage = () => {
  const [events, setEvents] = useState<EventItem[]>([]);

  useEffect(() => {
    fetchAdminEvents()
      .then(setEvents)
      .catch(() => setEvents([]));
  }, []);

  const active = events.filter((event) => event.isActive).length;
  const cancelled = events.filter((event) => event.isCancelled).length;
  const registrations = events.reduce((sum, event) => sum + event.registeredCount, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <Link to="/admin/events/new">
          <Button>Create Event</Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Events</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{events.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active Events</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{active}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Registrations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{registrations}</p>
            <p className="mt-1 text-xs text-slate-500">Cancelled events: {cancelled}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

