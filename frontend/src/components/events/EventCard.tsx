import { Link } from 'react-router-dom';
import type { EventItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDateTime } from '@/lib/utils';

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

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="line-clamp-2">{event.title}</CardTitle>
          <Badge>{event.category}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="mb-3 line-clamp-3 text-sm text-slate-600">{event.description}</p>

        <div className="space-y-1 text-sm text-slate-600">
          <p>{formatDateTime(event.date)}</p>
          <p>{event.venue}</p>
        </div>

        <div className="my-3">
          <div className="mb-1 h-2 rounded bg-slate-100">
            <div
              className={`h-2 rounded ${capacityPercent > 80 ? 'bg-danger' : 'bg-secondary'}`}
              style={{ width: `${capacityPercent}%` }}
            />
          </div>
          <p className="text-xs text-slate-500">
            {event.registeredCount}/{event.capacity} registered
          </p>
        </div>

        {event.isCancelled && <p className="mb-2 text-sm text-danger">Cancelled: {event.cancelReason || 'No reason'}</p>}

        <div className="flex gap-2">
          <Link
            to={`/events/${event._id}`}
            className="inline-flex h-10 flex-1 items-center justify-center rounded-md border border-border bg-white px-4 text-sm font-medium text-foreground transition hover:bg-slate-50"
          >
            View
          </Link>
          {actionLabel && (
            <Button
              className="flex-1"
              onClick={onAction}
              disabled={actionDisabled || event.isCancelled || !event.isActive}
            >
              {actionLabel}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
