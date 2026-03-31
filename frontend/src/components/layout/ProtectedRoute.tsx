import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import type { Role } from '@/types';

export const ProtectedRoute = ({ role }: { role?: Role }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="skeleton mx-auto h-8 w-32 rounded-md" />
          <p className="text-body-md text-on-surface-variant">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/events" replace />;
  }

  return <Outlet />;
};
