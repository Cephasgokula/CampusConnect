import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { exportParticipantsCsv, fetchParticipants, markAttendance } from '@/api/registrations';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Event Participants</CardTitle>
          <Button
            variant="outline"
            onClick={async () => {
              if (!id) return;
              await exportParticipantsCsv(id);
            }}
          >
            Export CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error && <p className="mb-3 text-sm text-danger">{error}</p>}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-slate-600">
                <th className="p-2">Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Roll Number</th>
                <th className="p-2">Department</th>
                <th className="p-2">Status</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row._id} className="border-b border-border">
                  <td className="p-2">{row.student?.name || '-'}</td>
                  <td className="p-2">{row.student?.email || '-'}</td>
                  <td className="p-2">{row.student?.rollNumber || '-'}</td>
                  <td className="p-2">{row.student?.department || '-'}</td>
                  <td className="p-2">{row.status}</td>
                  <td className="p-2">
                    <Button
                      variant="outline"
                      disabled={row.status === 'attended'}
                      onClick={async () => {
                        await markAttendance(row._id);
                        await load();
                      }}
                    >
                      Mark Attended
                    </Button>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td className="p-2 text-slate-500" colSpan={6}>
                    No participants found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

