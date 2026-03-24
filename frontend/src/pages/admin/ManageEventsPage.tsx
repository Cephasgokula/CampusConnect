import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { cancelEvent, deactivateEvent, fetchAdminEvents } from '@/api/events';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDateTime } from '@/lib/utils';
import type { EventItem } from '@/types';

export const ManageEventsPage = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      const data = await fetchAdminEvents();
      setEvents(data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load events');
    }
  };

  useEffect(() => {
    void load();
  }, []);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Manage Events</CardTitle>
          <Link to="/admin/events/new">
            <Button>Create Event</Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {error && <p className="mb-3 text-sm text-danger">{error}</p>}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-slate-600">
                <th className="p-2">Title</th>
                <th className="p-2">Date</th>
                <th className="p-2">Venue</th>
                <th className="p-2">Capacity</th>
                <th className="p-2">Status</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event._id} className="border-b border-border">
                  <td className="p-2">{event.title}</td>
                  <td className="p-2">{formatDateTime(event.date)}</td>
                  <td className="p-2">{event.venue}</td>
                  <td className="p-2">
                    {event.registeredCount}/{event.capacity}
                  </td>
                  <td className="p-2">
                    {!event.isActive ? 'Inactive' : event.isCancelled ? 'Cancelled' : 'Active'}
                  </td>
                  <td className="flex flex-wrap gap-2 p-2">
                    <Link to={`/admin/events/${event._id}/edit`}>
                      <Button variant="outline">Edit</Button>
                    </Link>
                    <Link to={`/admin/events/${event._id}/participants`}>
                      <Button variant="outline">Participants</Button>
                    </Link>
                    <Button
                      variant="outline"
                      onClick={async () => {
                        const reason = window.prompt('Cancel reason?');
                        if (!reason) return;
                        await cancelEvent(event._id, reason);
                        await load();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="danger"
                      onClick={async () => {
                        const ok = window.confirm('Deactivate this event?');
                        if (!ok) return;
                        await deactivateEvent(event._id);
                        await load();
                      }}
                    >
                      Deactivate
                    </Button>
                  </td>
                </tr>
              ))}
              {events.length === 0 && (
                <tr>
                  <td className="p-2 text-slate-500" colSpan={6}>
                    No events found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

