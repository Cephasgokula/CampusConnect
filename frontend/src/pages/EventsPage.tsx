import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchEvents } from '@/api/events';
import { registerEvent } from '@/api/registrations';
import { EventCard } from '@/components/events/EventCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import type { EventItem } from '@/types';

export const EventsPage = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await fetchEvents({
        page,
        limit: 9,
        search: search || undefined,
        category: category || undefined,
        date: date || undefined
      });
      setEvents(data.events);
      setPages(data.pagination.pages || 1);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadEvents();
  }, [page, category, date]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Events</h1>
      {!user && (
        <p className="text-sm text-slate-600">
          You are browsing as guest.{' '}
          <Link to="/login" className="font-medium text-secondary">
            Login as student
          </Link>{' '}
          to register for events.
        </p>
      )}
      {user?.role === 'admin' && <p className="text-sm text-slate-600">Admin accounts cannot register for events.</p>}
      <div className="grid gap-3 md:grid-cols-4">
        <Input
          placeholder="Search title or description"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setPage(1);
              void loadEvents();
            }
          }}
        />
        <select className="h-10 rounded-md border border-border bg-white px-3" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All categories</option>
          <option value="workshop">Workshop</option>
          <option value="seminar">Seminar</option>
          <option value="cultural">Cultural</option>
          <option value="sports">Sports</option>
          <option value="technical">Technical</option>
          <option value="other">Other</option>
        </select>
        <select className="h-10 rounded-md border border-border bg-white px-3" value={date} onChange={(e) => setDate(e.target.value)}>
          <option value="">Any date</option>
          <option value="today">Today</option>
          <option value="this-week">This week</option>
          <option value="this-month">This month</option>
        </select>
        <Button
          onClick={() => {
            setPage(1);
            void loadEvents();
          }}
        >
          Apply Filters
        </Button>
      </div>

      {error && <p className="text-sm text-danger">{error}</p>}
      {success && <p className="text-sm text-success">{success}</p>}
      {loading && <p className="text-sm text-slate-500">Loading events...</p>}

      <div className="grid gap-4 md:grid-cols-3">
        {events.map((event) => (
          <EventCard
            key={event._id}
            event={event}
            actionLabel={user?.role === 'student' ? 'Register' : !user ? 'Login to Register' : 'Students Only'}
            actionDisabled={user?.role !== 'student'}
            onAction={async () => {
              if (user?.role !== 'student') return;
              try {
                await registerEvent(event._id);
                setError(null);
                setSuccess(`Successfully registered for "${event.title}"`);
                await loadEvents();
              } catch (err: any) {
                setSuccess(null);
                setError(err.response?.data?.message || 'Failed to register');
              }
            }}
          />
        ))}
      </div>

      <div className="flex items-center justify-center gap-2">
        <Button variant="outline" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>
          Prev
        </Button>
        <span className="text-sm text-slate-600">
          Page {page} / {pages}
        </span>
        <Button variant="outline" onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page >= pages}>
          Next
        </Button>
      </div>
    </div>
  );
};
