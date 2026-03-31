import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { cancelEvent, deactivateEvent, fetchAdminEvents } from '@/api/events';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { formatDateTime } from '@/lib/utils';
import { Plus, Pencil, Users, XCircle, Trash2, Search } from 'lucide-react';
import type { EventItem } from '@/types';

export const ManageEventsPage = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('');

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

  const filtered = events.filter(
    (e) =>
      e.title.toLowerCase().includes(filter.toLowerCase()) ||
      e.venue.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-headline-lg text-on-surface">Manage Events</h1>
        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant/50" />
            <Input
              placeholder="Filter events..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-10"
            />
          </div>
          <Link to="/admin/events/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Event
            </Button>
          </Link>
        </div>
      </div>

      {error && (
        <p className="rounded-lg bg-error-container px-4 py-3 text-sm text-error">{error}</p>
      )}

      <div className="rounded-xl bg-surface-container-lowest p-6 shadow-ambient">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-sm">
            <thead>
              <tr className="text-left">
                <th className="pb-4 text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">Title</th>
                <th className="pb-4 text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">Date</th>
                <th className="pb-4 text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">Venue</th>
                <th className="pb-4 text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">Capacity</th>
                <th className="pb-4 text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">Status</th>
                <th className="pb-4 text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((event, idx) => {
                const pct = Math.min(100, Math.round((event.registeredCount / event.capacity) * 100));
                const statusLabel = !event.active ? 'Inactive' : event.cancelled ? 'Cancelled' : 'Active';
                const statusVariant = !event.active ? 'secondary' : event.cancelled ? 'error' : 'default';

                return (
                  <tr
                    key={event.id}
                    className={idx % 2 === 0 ? '' : 'bg-surface-container-low/50'}
                  >
                    <td className="py-4 pr-4">
                      <p className="font-medium text-on-surface">{event.title}</p>
                    </td>
                    <td className="py-4 pr-4 text-on-surface-variant">{formatDateTime(event.date)}</td>
                    <td className="py-4 pr-4 text-on-surface-variant">{event.venue}</td>
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-2">
                        <span className="text-on-surface">{event.registeredCount}/{event.capacity}</span>
                        <div className="h-1.5 w-12 rounded-full bg-surface-container-high overflow-hidden">
                          <div
                            className={`h-full rounded-full ${pct > 90 ? 'bg-error' : 'bg-primary-container'}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 pr-4">
                      <Badge variant={statusVariant as any}>{statusLabel}</Badge>
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          to={`/admin/events/${event.id}/edit`}
                          className="flex h-8 w-8 items-center justify-center rounded-full text-on-surface-variant spring-hover hover:bg-surface-container-low"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <Link
                          to={`/admin/events/${event.id}/participants`}
                          className="flex h-8 w-8 items-center justify-center rounded-full text-on-surface-variant spring-hover hover:bg-surface-container-low"
                        >
                          <Users className="h-4 w-4" />
                        </Link>
                        <button
                          className="flex h-8 w-8 items-center justify-center rounded-full text-on-surface-variant spring-hover hover:bg-surface-container-low"
                          onClick={async () => {
                            const reason = window.prompt('Cancel reason?');
                            if (!reason) return;
                            await cancelEvent(event.id, reason);
                            await load();
                          }}
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                        <button
                          className="flex h-8 w-8 items-center justify-center rounded-full text-on-surface-variant spring-hover hover:bg-error-container hover:text-error"
                          onClick={async () => {
                            const ok = window.confirm('Deactivate this event?');
                            if (!ok) return;
                            await deactivateEvent(event.id);
                            await load();
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-on-surface-variant">
                    No events found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

