import { Link } from 'react-router-dom';
import type { EventItem } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDateTime } from '@/lib/utils';
import { Calendar, MapPin, Bookmark } from 'lucide-react';

export const EventCard = ({
  event,
  actionLabel,
  onAction,
  actionDisabled
}: {
  event: EventItem;
  actionLabel?: string;
  onAction?: () => void;
  actionDisabled?: boolean;
}) => {
  const capacityPercent = Math.min(100, Math.round((event.registeredCount / event.capacity) * 100));
  const isAlmostFull = capacityPercent > 90;
  const isHigh = capacityPercent > 80;

  const categoryColors: Record<string, string> = {
    technical: 'bg-primary text-white',
    cultural: 'bg-yellow-500 text-white',
    sports: 'bg-error text-white',
    workshop: 'bg-secondary text-white',
    seminar: 'bg-primary-container text-white',
    other: 'bg-on-surface-variant text-white',
  };

  return (
    <Link
      to={`/events/${event.id}`}
      className="group block overflow-hidden rounded-xl bg-surface-container-lowest shadow-ambient spring-hover hover:shadow-ambient-lg hover:-translate-y-0.5"
    >
      <div className="relative h-48 overflow-hidden bg-surface-container">
        {event.banner ? (
          <img
            src={event.banner}
            alt={event.title}
            className="h-full w-full object-cover spring-hover group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center gradient-hero">
            <span className="text-2xl font-bold text-white/30">Campus Event</span>
          </div>
        )}
        <span
          className={`absolute left-3 top-3 rounded-sm px-2.5 py-1 text-label-sm font-semibold uppercase tracking-wider ${
            categoryColors[event.category] || categoryColors.other
          }`}
        >
          {event.category}
        </span>
        <button
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-surface-container-lowest/80 text-on-surface-variant backdrop-blur-sm spring-hover hover:text-primary"
          onClick={(e) => e.preventDefault()}
        >
          <Bookmark className="h-4 w-4" />
        </button>
      </div>

      <div className="p-5">
        <h3 className="text-base font-semibold text-on-surface line-clamp-1 group-hover:text-primary spring-hover">
          {event.title}
        </h3>
        <p className="mt-1.5 text-body-md text-on-surface-variant line-clamp-2">
          {event.description}
        </p>

        <div className="mt-3 flex flex-col gap-1.5 text-body-md text-on-surface-variant">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            <span>{formatDateTime(event.date)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            <span>{event.venue}</span>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between text-label-sm uppercase tracking-wider">
            <span className={isAlmostFull ? 'text-error font-semibold' : 'text-on-surface-variant'}>
              {isAlmostFull ? 'Almost Full' : 'Capacity'}
            </span>
            <span className={isHigh ? 'text-error font-semibold' : 'text-on-surface-variant'}>
              {capacityPercent}% Full
            </span>
          </div>
          <div className="mt-1.5 h-1.5 rounded-full bg-surface-container-high overflow-hidden">
            <div
              className={`h-full rounded-full spring-hover ${isHigh ? 'bg-error' : 'bg-primary-container'}`}
              style={{ width: `${capacityPercent}%` }}
            />
          </div>
        </div>

        {event.cancelled && (
          <Badge variant="error" className="mt-3">Cancelled</Badge>
        )}

        {actionLabel && (
          <div className="mt-4" onClick={(e) => e.preventDefault()}>
            <Button
              className="w-full"
              onClick={onAction}
              disabled={actionDisabled || event.cancelled || !event.active}
            >
              {actionLabel}
            </Button>
          </div>
        )}
      </div>
    </Link>
  );
};
