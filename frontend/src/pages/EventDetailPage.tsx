import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchEvent } from '@/api/events';
import { registerEvent } from '@/api/registrations';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { formatDateTime } from '@/lib/utils';
import { ArrowLeft, Calendar, MapPin, Users, RefreshCw, AlertTriangle, Info } from 'lucide-react';
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

  if (loadError) return <p className="text-error">{loadError}</p>;
  if (!event) return (
    <div className="space-y-6">
      <div className="skeleton h-80 w-full rounded-xl" />
      <div className="skeleton h-8 w-2/3 rounded-md" />
      <div className="skeleton h-4 w-full rounded-md" />
    </div>
  );

  const capacityPercent = Math.min(100, Math.round((event.registeredCount / event.capacity) * 100));
  const isHigh = capacityPercent > 80;
  const isAlmostFull = capacityPercent > 90;

  return (
    <div className="space-y-6">
      <Link
        to="/events"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-on-surface-variant spring-hover hover:text-on-surface"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Events
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        {/* Left column */}
        <div className="space-y-6">
          <div className="overflow-hidden rounded-xl bg-surface-container">
            {event.banner ? (
              <img src={event.banner} alt={event.title} className="h-80 w-full object-cover" />
            ) : (
              <div className="flex h-80 items-center justify-center gradient-hero">
                <span className="text-3xl font-bold text-white/20">Campus Event</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {event.tags?.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
            {!event.tags?.length && <Badge>{event.category}</Badge>}
          </div>

          <div>
            <h1 className="text-headline-lg text-on-surface">{event.title}</h1>
            <div className="mt-6 space-y-4 text-body-md leading-relaxed text-on-surface-variant whitespace-pre-line">
              {event.description}
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          {/* Capacity card */}
          <div className="rounded-xl bg-surface-container-lowest p-6 shadow-ambient">
            <p className="text-label-sm uppercase tracking-wider text-on-surface-variant">Current Capacity</p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-on-surface">{event.registeredCount}</span>
              <span className="text-lg text-on-surface-variant">/ {event.capacity}</span>
              <span className="text-body-md text-on-surface-variant">Seats</span>
              <span className={`ml-auto text-sm font-semibold ${isHigh ? 'text-error' : 'text-on-surface-variant'}`}>
                {capacityPercent}% Full
              </span>
            </div>
            <div className="mt-3 h-2 rounded-full bg-surface-container-high overflow-hidden">
              <div
                className={`h-full rounded-full spring-hover ${isHigh ? 'bg-error' : 'bg-primary-container'}`}
                style={{ width: `${capacityPercent}%` }}
              />
            </div>
            {isAlmostFull && (
              <p className="mt-2 flex items-center gap-1.5 text-sm text-error">
                <AlertTriangle className="h-3.5 w-3.5" />
                Limited seats remaining!
              </p>
            )}
          </div>

          {/* Details card */}
          <div className="rounded-xl bg-surface-container-lowest p-6 shadow-ambient space-y-5">
            <div className="flex items-start gap-3">
              <Calendar className="mt-0.5 h-5 w-5 text-on-surface-variant" />
              <div>
                <p className="text-label-sm uppercase tracking-wider text-on-surface-variant">Date & Time</p>
                <p className="mt-0.5 text-sm font-medium text-on-surface">{formatDateTime(event.date)}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-5 w-5 text-on-surface-variant" />
              <div>
                <p className="text-label-sm uppercase tracking-wider text-on-surface-variant">Venue</p>
                <p className="mt-0.5 text-sm font-medium text-on-surface">{event.venue}</p>
                <button className="text-sm text-secondary spring-hover hover:underline">View Map</button>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Users className="mt-0.5 h-5 w-5 text-on-surface-variant" />
              <div>
                <p className="text-label-sm uppercase tracking-wider text-on-surface-variant">Organized By</p>
                <p className="mt-0.5 text-sm font-medium text-on-surface">Campus Events Team</p>
              </div>
            </div>

            {!user && (
              <div className="flex items-center gap-2 rounded-lg bg-surface-container-low px-4 py-3 text-body-md text-on-surface-variant">
                <Info className="h-4 w-4 shrink-0" />
                Log in to register for this event.
              </div>
            )}

            <Button
              className="w-full"
              onClick={async () => {
                if (!event || user?.role !== 'student') return;
                try {
                  await registerEvent(event.id);
                  const refreshed = await fetchEvent(event.id);
                  setEvent(refreshed);
                  setActionError(null);
                  setMessage(`Successfully registered for "${event.title}"`);
                } catch (err: any) {
                  setMessage(null);
                  setActionError(err.response?.data?.message || 'Registration failed');
                }
              }}
              disabled={user?.role !== 'student' || event.cancelled || !event.active}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              {user?.role === 'student' ? 'Register Now' : !user ? 'Login to Register' : 'Students Only'}
            </Button>

            <button className="w-full text-center text-sm text-on-surface-variant spring-hover hover:text-on-surface">
              Add to Calendar
            </button>
          </div>

          {/* Status card */}
          {event.cancelled && (
            <div className="rounded-xl bg-error-container p-5">
              <p className="text-label-sm uppercase tracking-wider text-error">Event Status</p>
              <p className="mt-1 text-sm font-medium text-error">
                Cancelled: {event.cancelReason || 'No reason provided'}
              </p>
            </div>
          )}

          {actionError && (
            <div className="rounded-xl bg-error-container p-5">
              <p className="text-sm text-error">{actionError}</p>
            </div>
          )}
          {message && (
            <div className="rounded-xl bg-green-50 p-5">
              <p className="text-sm text-success">{message}</p>
            </div>
          )}

          {user?.role === 'admin' && (
            <div className="rounded-xl bg-surface-container-low p-5">
              <p className="text-body-md italic text-on-surface-variant">
                Admin View: Students only registration message is active for this role.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
