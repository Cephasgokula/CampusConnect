import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchEvents } from '@/api/events';
import { registerEvent } from '@/api/registrations';
import { EventCard } from '@/components/events/EventCard';
import { EventCardSkeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Info, Search } from 'lucide-react';
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

  const pageNumbers = () => {
    const nums: (number | string)[] = [];
    for (let i = 1; i <= pages; i++) {
      if (i <= 3 || i === pages || Math.abs(i - page) <= 1) {
        nums.push(i);
      } else if (nums[nums.length - 1] !== '...') {
        nums.push('...');
      }
    }
    return nums;
  };

  return (
    <div className="space-y-8">
      {/* Guest banner */}
      {!user && (
        <div className="flex items-center gap-3 rounded-xl bg-secondary px-6 py-4 text-white">
          <Info className="h-5 w-5 shrink-0" />
          <p className="flex-1 text-sm">
            Log in to register for events and track your schedule.
          </p>
          <Link to="/login" className="text-sm font-semibold uppercase tracking-wider hover:underline">
            Log In
          </Link>
        </div>
      )}

      {/* Filter bar */}
      <div className="rounded-xl bg-surface-container-lowest p-6 shadow-ambient">
        <div className="grid gap-4 md:grid-cols-[1fr_auto_auto_auto] items-end">
          <div>
            <p className="mb-2 text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant">
              Search Events
            </p>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant/50" />
              <Input
                placeholder="Keywords, clubs, or speakers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setPage(1);
                    void loadEvents();
                  }
                }}
                className="pl-10"
              />
            </div>
          </div>
          <div>
            <p className="mb-2 text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant">
              Category
            </p>
            <select
              className="h-11 rounded-[8px] bg-surface-container-lowest px-4 text-body-md text-on-surface outline-none ghost-border focus-visible:ring-2 focus-visible:ring-secondary-fixed-dim"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="workshop">Workshop</option>
              <option value="seminar">Seminar</option>
              <option value="cultural">Cultural</option>
              <option value="sports">Sports</option>
              <option value="technical">Technical</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <p className="mb-2 text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant">
              Timeframe
            </p>
            <select
              className="h-11 rounded-[8px] bg-surface-container-lowest px-4 text-body-md text-on-surface outline-none ghost-border focus-visible:ring-2 focus-visible:ring-secondary-fixed-dim"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            >
              <option value="">Anytime</option>
              <option value="today">Today</option>
              <option value="this-week">This week</option>
              <option value="this-month">This month</option>
            </select>
          </div>
          <Button
            onClick={() => {
              setPage(1);
              void loadEvents();
            }}
          >
            Apply Filters
          </Button>
        </div>
      </div>

      {error && (
        <p className="rounded-lg bg-error-container px-4 py-3 text-sm text-error">{error}</p>
      )}
      {success && (
        <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-success">{success}</p>
      )}

      {/* Event grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <EventCardSkeleton key={i} />)
          : events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                actionLabel={user?.role === 'student' ? 'Register' : !user ? 'Login to Register' : 'Students Only'}
                actionDisabled={user?.role !== 'student'}
                onAction={async () => {
                  if (user?.role !== 'student') return;
                  try {
                    await registerEvent(event.id);
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

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="flex h-9 w-9 items-center justify-center rounded-full text-on-surface-variant spring-hover hover:bg-surface-container-low disabled:opacity-30"
          >
            ‹
          </button>
          {pageNumbers().map((n, i) =>
            typeof n === 'string' ? (
              <span key={i} className="px-1 text-on-surface-variant">
                {n}
              </span>
            ) : (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium spring-hover ${
                  n === page
                    ? 'bg-secondary text-white'
                    : 'text-on-surface-variant hover:bg-surface-container-low'
                }`}
              >
                {n}
              </button>
            )
          )}
          <button
            onClick={() => setPage((p) => Math.min(pages, p + 1))}
            disabled={page >= pages}
            className="flex h-9 w-9 items-center justify-center rounded-full text-on-surface-variant spring-hover hover:bg-surface-container-low disabled:opacity-30"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
};
