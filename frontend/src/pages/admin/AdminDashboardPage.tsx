import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchAdminEvents } from '@/api/events';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { formatDateTime } from '@/lib/utils';
import { Plus, Download, Calendar, Users, TrendingUp, Radio, Pencil, EyeOff, Trash2, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import type { EventItem } from '@/types';

export const AdminDashboardPage = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [filter, setFilter] = useState('');
  const [tablePage, setTablePage] = useState(1);
  const perPage = 3;

  useEffect(() => {
    fetchAdminEvents()
      .then(setEvents)
      .catch(() => setEvents([]));
  }, []);

  const active = events.filter((e) => e.active && !e.cancelled).length;
  const registrations = events.reduce((s, e) => s + e.registeredCount, 0);
  const upcoming = events.filter((e) => new Date(e.date) > new Date() && e.active).length;
  const liveNow = events.filter((e) => {
    const d = new Date(e.date);
    const end = e.endDate ? new Date(e.endDate) : new Date(d.getTime() + 3600000);
    const now = new Date();
    return now >= d && now <= end && e.active;
  }).length;

  const filtered = events.filter(
    (e) =>
      e.title.toLowerCase().includes(filter.toLowerCase()) ||
      e.venue.toLowerCase().includes(filter.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageEvents = filtered.slice((tablePage - 1) * perPage, tablePage * perPage);

  const getStatus = (e: EventItem) => {
    if (e.cancelled) return { label: 'Cancelled', variant: 'error' as const };
    if (!e.active) return { label: 'Inactive', variant: 'secondary' as const };
    const pct = Math.round((e.registeredCount / e.capacity) * 100);
    if (pct >= 95) return { label: 'At Capacity', variant: 'error' as const };
    const d = new Date(e.date);
    const end = e.endDate ? new Date(e.endDate) : new Date(d.getTime() + 3600000);
    const now = new Date();
    if (now >= d && now <= end) return { label: 'Live Now', variant: 'live' as const };
    return { label: 'Scheduled', variant: 'default' as const };
  };

  const stats = [
    { icon: Calendar, label: 'Total Events', value: events.length, badge: `+${Math.round(events.length * 0.12)}%` },
    { icon: TrendingUp, label: 'Total Registrations', value: registrations.toLocaleString(), badge: `+${(registrations / 2).toFixed(1).replace(/\.0$/, '')}` },
    { icon: Radio, label: 'Upcoming Events', value: upcoming, badge: 'Next 7 Days' },
    { icon: Users, label: 'Active Participants', value: liveNow > 0 ? liveNow * 100 : active, badge: liveNow > 0 ? 'Live Now' : '' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <span className="text-label-sm font-semibold uppercase tracking-wider text-secondary">
            Admin Central
          </span>
          <h1 className="mt-1 text-headline-lg text-on-surface">Platform Overview</h1>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Link to="/admin/events/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Event
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl bg-surface-container-lowest p-5 shadow-ambient"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container-low">
                <stat.icon className="h-5 w-5 text-primary-container" />
              </div>
              {stat.badge && (
                <span className="rounded-full bg-surface-container-low px-2.5 py-1 text-label-sm font-semibold text-on-surface-variant">
                  {stat.badge}
                </span>
              )}
            </div>
            <p className="mt-4 text-body-md text-on-surface-variant">{stat.label}</p>
            <p className="mt-1 text-2xl font-bold text-on-surface">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Manage Events Table */}
      <div className="rounded-xl bg-surface-container-lowest p-6 shadow-ambient">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h2 className="text-headline-md text-on-surface">Manage Events</h2>
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant/50" />
            <Input
              placeholder="Filter events..."
              value={filter}
              onChange={(e) => { setFilter(e.target.value); setTablePage(1); }}
              className="pl-10"
            />
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="text-left">
                <th className="pb-4 text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">Event Name</th>
                <th className="pb-4 text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">Date & Time</th>
                <th className="pb-4 text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">Capacity</th>
                <th className="pb-4 text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">Status</th>
                <th className="pb-4 text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageEvents.map((event, idx) => {
                const pct = Math.min(100, Math.round((event.registeredCount / event.capacity) * 100));
                const status = getStatus(event);
                return (
                  <tr
                    key={event.id}
                    className={idx % 2 === 0 ? 'bg-surface-container-lowest' : 'bg-surface-container-low/50'}
                  >
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-surface-container">
                          {event.banner ? (
                            <img src={event.banner} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center gradient-hero">
                              <span className="text-[8px] text-white/30">E</span>
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-on-surface">{event.title}</p>
                          <p className="text-body-md text-on-surface-variant">{event.venue}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 pr-4 text-on-surface-variant">
                      {formatDateTime(event.date)}
                    </td>
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-on-surface">
                          {event.registeredCount}/{event.capacity}
                        </span>
                        <div className="h-1.5 w-16 rounded-full bg-surface-container-high overflow-hidden">
                          <div
                            className={`h-full rounded-full ${pct > 90 ? 'bg-error' : 'bg-primary-container'}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-xs text-on-surface-variant">{pct}%</span>
                      </div>
                    </td>
                    <td className="py-4 pr-4">
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          to={`/admin/events/${event.id}/edit`}
                          className="flex h-8 w-8 items-center justify-center rounded-full text-on-surface-variant spring-hover hover:bg-surface-container-low hover:text-on-surface"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <Link
                          to={`/admin/events/${event.id}/participants`}
                          className="flex h-8 w-8 items-center justify-center rounded-full text-on-surface-variant spring-hover hover:bg-surface-container-low hover:text-on-surface"
                        >
                          <EyeOff className="h-4 w-4" />
                        </Link>
                        <button className="flex h-8 w-8 items-center justify-center rounded-full text-on-surface-variant spring-hover hover:bg-error-container hover:text-error">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {pageEvents.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-on-surface-variant">No events found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-body-md text-on-surface-variant">
            Showing {pageEvents.length} of {filtered.length} events
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setTablePage((p) => Math.max(1, p - 1))}
              disabled={tablePage <= 1}
              className="flex h-8 w-8 items-center justify-center rounded-full text-on-surface-variant spring-hover hover:bg-surface-container-low disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setTablePage((p) => Math.min(totalPages, p + 1))}
              disabled={tablePage >= totalPages}
              className="flex h-8 w-8 items-center justify-center rounded-full text-on-surface-variant spring-hover hover:bg-surface-container-low disabled:opacity-30"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

