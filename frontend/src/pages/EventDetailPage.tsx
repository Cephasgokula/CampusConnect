import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchEvent } from '@/api/events';
import { registerEvent } from '@/api/registrations';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { formatDateTime } from '@/lib/utils';
import type { EventItem } from '@/types';

export const EventDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [event, setEvent] = useState<EventItem | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetchEvent(id)
      .then(setEvent)
      .catch((err) => setLoadError(err.response?.data?.message || 'Could not load event'));
  }, [id]);

  if (loadError) return <p className="text-danger">{loadError}</p>;
  if (!event) return <p className="text-slate-500">Loading event...</p>;

  const capacityPercent = Math.min(100, Math.round((event.registeredCount / event.capacity) * 100));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{event.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-slate-700">{event.description}</p>
        <div className="space-y-1 text-sm text-slate-600">
          <p>Date: {formatDateTime(event.date)}</p>
          <p>Venue: {event.venue}</p>
          <p>Category: {event.category}</p>
        </div>

        <div className="my-4">
          <div className="mb-1 h-2 rounded bg-slate-100">
            <div className="h-2 rounded bg-secondary" style={{ width: `${capacityPercent}%` }} />
          </div>
          <p className="text-xs text-slate-500">
            {event.registeredCount}/{event.capacity} registered
          </p>
        </div>

        {event.isCancelled && <p className="mb-4 text-danger">This event has been cancelled: {event.cancelReason}</p>}

        {!user && (
          <p className="text-sm text-slate-600">
            <Link to="/login" className="font-medium text-secondary">
              Login as student
            </Link>{' '}
            to register.
          </p>
        )}

        {user?.role === 'admin' && <p className="text-sm text-slate-600">Admin accounts cannot register for events.</p>}

        {actionError && <p className="mb-3 text-sm text-danger">{actionError}</p>}
        {message && <p className="mb-3 text-sm text-success">{message}</p>}

        <Button
          onClick={async () => {
            if (!event || user?.role !== 'student') return;
            try {
              await registerEvent(event._id);
              const refreshed = await fetchEvent(event._id);
              setEvent(refreshed);
              setActionError(null);
              setMessage(`Successfully registered for "${event.title}"`);
            } catch (err: any) {
              setMessage(null);
              setActionError(err.response?.data?.message || 'Registration failed');
            }
          }}
          disabled={user?.role !== 'student' || event.isCancelled || !event.isActive}
        >
          {user?.role === 'student' ? 'Register for Event' : !user ? 'Login to Register' : 'Students Only'}
        </Button>
      </CardContent>
    </Card>
  );
};
