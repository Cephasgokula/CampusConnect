import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchEvents } from '@/api/events';
import { EventCard } from '@/components/events/EventCard';
import { Button } from '@/components/ui/button';
import type { EventItem } from '@/types';

export const HomePage = () => {
  const [events, setEvents] = useState<EventItem[]>([]);

  useEffect(() => {
    fetchEvents({ page: 1, limit: 3 })
      .then((data) => setEvents(data.events))
      .catch(() => setEvents([]));
  }, []);

  return (
    <div className="space-y-8">
      <section className="rounded-2xl bg-gradient-to-r from-primary to-secondary p-8 text-white shadow">
        <h1 className="text-3xl font-bold">Campus Event Management System</h1>
        <p className="mt-2 max-w-2xl text-blue-50">
          Discover, register, and manage campus events with role-based workflows for students and admins.
        </p>
        <div className="mt-4">
          <Link to="/events">
            <Button variant="outline" className="border-white bg-white text-primary hover:bg-blue-50">
              Explore Events
            </Button>
          </Link>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Featured Events</h2>
          <Link to="/events" className="text-sm font-medium text-secondary">
            View all
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {events.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
          {events.length === 0 && <p className="text-sm text-slate-500">No events available yet.</p>}
        </div>
      </section>
    </div>
  );
};

