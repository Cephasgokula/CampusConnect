import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchEvents } from '@/api/events';
import { EventCard } from '@/components/events/EventCard';
import { EventCardSkeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight } from 'lucide-react';
import type { EventItem } from '@/types';

export const HomePage = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents({ page: 1, limit: 3 })
      .then((data) => setEvents(data.events))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="-mt-8">
      {/* Hero Section */}
      <section className="relative -mx-4 overflow-hidden gradient-hero px-12 py-24 text-white md:-mx-8 lg:-mx-12">
        <div className="relative z-10 max-w-3xl" style={{ paddingLeft: '3rem', paddingRight: '2rem' }}>
          <h1 className="text-display-lg leading-tight">
            Ignite Your
            <br />
            <span className="text-secondary-fixed-dim">Campus Life</span>
          </h1>
        </div>
        <div className="relative z-10 mx-auto mt-10 max-w-3xl overflow-hidden rounded-xl shadow-ambient-lg">
          <div className="flex h-64 items-center justify-center bg-primary-container/30">
            <span className="text-lg text-white/20">Campus Imagery</span>
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="mt-20">
        <div className="mb-2">
          <span className="text-label-sm font-semibold uppercase tracking-wider text-secondary">
            Curated Highlights
          </span>
        </div>
        <div className="flex items-end justify-between">
          <h2 className="text-headline-lg text-on-surface">Featured Events</h2>
          <Link
            to="/events"
            className="flex items-center gap-1 text-sm font-medium text-on-surface-variant spring-hover hover:text-on-surface"
          >
            View all events <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <EventCardSkeleton key={i} />)
            : events.map((event) => <EventCard key={event.id} event={event} />)}
          {!loading && events.length === 0 && (
            <p className="text-body-md text-on-surface-variant">No events available yet.</p>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="mt-20 mb-8">
        <div className="rounded-xl gradient-primary p-10 md:p-14">
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div className="max-w-md">
              <h2 className="text-headline-lg text-white">Stay in the loop.</h2>
              <p className="mt-3 text-body-md text-white/70">
                Get weekly curated digests of the most impactful events on campus delivered straight
                to your inbox. No noise, just precision.
              </p>
              <div className="mt-6 flex gap-3">
                <Input
                  placeholder="Your campus email"
                  className="max-w-xs bg-white/10 text-white placeholder:text-white/40 ghost-border focus-visible:ring-white/30"
                />
                <Button variant="outline" className="bg-white text-primary hover:bg-white/90">
                  Join
                </Button>
              </div>
            </div>
            <div className="flex h-28 w-28 items-center justify-center rounded-xl bg-white/10">
              <svg className="h-14 w-14 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

