import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { cancelRegistration, fetchMyRegistrations } from '@/api/registrations';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { formatDateTime } from '@/lib/utils';
import { Calendar, MapPin, User } from 'lucide-react';
import type { Registration } from '@/types';

const statusVariant = (status: string) => {
  if (status === 'registered') return 'default';
  if (status === 'attended') return 'success';
  return 'error';
};

export const StudentDashboardPage = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      const data = await fetchMyRegistrations();
      setItems(data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load registrations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-8 w-64 rounded-md" />
        <div className="skeleton h-6 w-96 rounded-md" />
        <div className="skeleton h-40 w-full rounded-xl" />
      </div>
    );
  }

  if (error) return <p className="text-error">{error}</p>;

  const registeredEvents = items.filter((i) => i.status === 'registered');
  const totalHours = items.length * 4; // approximate

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <span className="text-label-sm font-semibold uppercase tracking-wider text-secondary">
          Student Portal
        </span>
        <h1 className="mt-1 text-headline-lg text-on-surface">
          Welcome back, <span className="text-primary-container">{user?.name || 'Student'}</span>
        </h1>
        <p className="mt-2 text-body-md text-on-surface-variant">
          Your personal hub for academic events, creative workshops, and campus community life. Stay ahead of your schedule.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        {/* Registrations list */}
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-headline-md text-on-surface">My Registrations</h2>
            <button className="text-sm font-medium text-secondary spring-hover hover:underline">
              View History
            </button>
          </div>

          <div className="mt-6 space-y-4">
            {items.map((item) => (
              <div
                key={item._id}
                className="flex items-center gap-4 rounded-xl bg-surface-container-lowest p-4 shadow-ambient spring-hover hover:shadow-ambient-lg"
              >
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-surface-container">
                  {item.event.banner ? (
                    <img src={item.event.banner} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center gradient-hero">
                      <span className="text-xs text-white/30">E</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/events/${item.event.id}`}
                    className="text-sm font-semibold text-on-surface spring-hover hover:text-primary-container"
                  >
                    {item.event.title}
                  </Link>
                  <div className="mt-1 flex flex-wrap gap-3 text-body-md text-on-surface-variant">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDateTime(item.event.date)}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {item.event.venue}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={statusVariant(item.status)}>
                    {item.status}
                  </Badge>
                  {item.status === 'registered' && (
                    <Button
                      variant="tertiary"
                      className="text-xs text-error hover:bg-error-container"
                      onClick={async () => {
                        await cancelRegistration(item.event.id);
                        await load();
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            ))}
            {items.length === 0 && (
              <div className="rounded-xl bg-surface-container-low p-8 text-center">
                <p className="text-body-md text-on-surface-variant">No registrations found.</p>
                <Link to="/events">
                  <Button className="mt-4">Browse Events</Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          {/* Profile card */}
          <div className="rounded-xl bg-surface-container-lowest p-6 shadow-ambient text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary text-white">
              {user?.avatar ? (
                <img src={user.avatar} alt="" className="h-full w-full rounded-full object-cover" />
              ) : (
                <User className="h-8 w-8" />
              )}
            </div>
            <h3 className="mt-3 text-base font-semibold text-on-surface">{user?.name}</h3>
            <p className="text-body-md text-on-surface-variant">
              {user?.department || 'Student'}{user?.rollNumber ? ` • ${user.rollNumber}` : ''}
            </p>
            <div className="mt-4 flex justify-center gap-6">
              <div className="text-center">
                <p className="text-xl font-bold text-on-surface">{items.length}</p>
                <p className="text-label-sm uppercase tracking-wider text-on-surface-variant">Events</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-on-surface">{totalHours}</p>
                <p className="text-label-sm uppercase tracking-wider text-on-surface-variant">Hours</p>
              </div>
            </div>
          </div>

          {/* Recommended event */}
          {registeredEvents.length > 0 && (
            <div className="overflow-hidden rounded-xl gradient-primary p-6 text-white">
              <span className="text-label-sm uppercase tracking-wider text-green-300">Recommended</span>
              <h3 className="mt-2 text-lg font-bold">Explore More Events</h3>
              <p className="mt-1 text-body-md text-white/70">
                Discover new events matching your interests.
              </p>
              <Link to="/events">
                <Button variant="outline" className="mt-4 bg-white text-primary hover:bg-white/90">
                  Browse Events
                </Button>
              </Link>
            </div>
          )}

          {/* Event availability */}
          {items.slice(0, 2).map((item) => {
            const pct = Math.min(100, Math.round((item.event.registeredCount / item.event.capacity) * 100));
            return (
              <div key={item._id} className="rounded-xl bg-surface-container-lowest p-5 shadow-ambient">
                <p className="text-label-sm uppercase tracking-wider text-on-surface-variant">Event Availability</p>
                <div className="mt-3 space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-on-surface truncate">{item.event.title}</span>
                      <span className={`text-xs font-semibold ${pct > 80 ? 'text-error' : 'text-on-surface-variant'}`}>
                        {pct}% Full
                      </span>
                    </div>
                    <div className="mt-1.5 h-1.5 rounded-full bg-surface-container-high overflow-hidden">
                      <div
                        className={`h-full rounded-full ${pct > 80 ? 'bg-error' : 'bg-primary-container'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

