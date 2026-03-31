import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { exportParticipantsCsv, fetchParticipants, markAttendance } from '@/api/registrations';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, CheckCircle } from 'lucide-react';
import type { Registration } from '@/types';

export const EventParticipantsPage = () => {
  const { id } = useParams();
  const [rows, setRows] = useState<Registration[]>([]);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    if (!id) return;
    try {
      const data = await fetchParticipants(id);
      setRows(data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load participants');
    }
  };

  useEffect(() => {
    void load();
  }, [id]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-headline-lg text-on-surface">Event Participants</h1>
        <Button
          variant="outline"
          onClick={async () => {
            if (!id) return;
            await exportParticipantsCsv(id);
          }}
        >
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {error && (
        <p className="rounded-lg bg-error-container px-4 py-3 text-sm text-error">{error}</p>
      )}

      <div className="rounded-xl bg-surface-container-lowest p-6 shadow-ambient">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="text-left">
                <th className="pb-4 text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">Name</th>
                <th className="pb-4 text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">Email</th>
                <th className="pb-4 text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">Roll Number</th>
                <th className="pb-4 text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">Department</th>
                <th className="pb-4 text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">Status</th>
                <th className="pb-4 text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr
                  key={row._id}
                  className={idx % 2 === 0 ? '' : 'bg-surface-container-low/50'}
                >
                  <td className="py-4 pr-4 font-medium text-on-surface">{row.student?.name || '-'}</td>
                  <td className="py-4 pr-4 text-on-surface-variant">{row.student?.email || '-'}</td>
                  <td className="py-4 pr-4 text-on-surface-variant">{row.student?.rollNumber || '-'}</td>
                  <td className="py-4 pr-4 text-on-surface-variant">{row.student?.department || '-'}</td>
                  <td className="py-4 pr-4">
                    <Badge variant={row.status === 'attended' ? 'success' : row.status === 'cancelled' ? 'error' : 'default'}>
                      {row.status}
                    </Badge>
                  </td>
                  <td className="py-4 text-right">
                    <Button
                      variant="outline"
                      disabled={row.status === 'attended'}
                      onClick={async () => {
                        await markAttendance(row._id);
                        await load();
                      }}
                    >
                      <CheckCircle className="mr-1.5 h-4 w-4" />
                      Mark Attended
                    </Button>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-on-surface-variant">
                    No participants found.
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

