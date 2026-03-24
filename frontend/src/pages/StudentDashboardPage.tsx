import { useEffect, useState } from 'react';
import { cancelRegistration, fetchMyRegistrations } from '@/api/registrations';
import { EventCard } from '@/components/events/EventCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Registration } from '@/types';

export const StudentDashboardPage = () => {
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

  if (loading) return <p className="text-slate-500">Loading dashboard...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>My Registrations</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600">
            Track upcoming events and cancel if your plans change.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <EventCard
            key={item._id}
            event={item.event}
            actionLabel={item.status === 'registered' ? 'Cancel' : undefined}
            onAction={
              item.status === 'registered'
                ? async () => {
                    await cancelRegistration(item.event._id);
                    await load();
                  }
                : undefined
            }
          />
        ))}
        {items.length === 0 && <p className="text-sm text-slate-500">No registrations found.</p>}
      </div>
    </div>
  );
};

