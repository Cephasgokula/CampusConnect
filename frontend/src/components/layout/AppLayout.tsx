import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

const navLinkClass = ({ isActive }: { isActive: boolean }): string =>
  isActive ? 'text-primary font-semibold' : 'text-slate-600 hover:text-primary';

export const AppLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <header className="border-b border-border bg-white/80 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="font-bold text-primary">
            CampusConnect
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <NavLink to="/events" className={navLinkClass}>
              Events
            </NavLink>
            {user?.role === 'student' && (
              <NavLink to="/dashboard" className={navLinkClass}>
                Dashboard
              </NavLink>
            )}
            {user?.role === 'admin' && (
              <>
                <NavLink to="/admin" className={navLinkClass}>
                  Admin
                </NavLink>
                <NavLink to="/admin/events" className={navLinkClass}>
                  Manage Events
                </NavLink>
              </>
            )}
            {!user ? (
              <>
                <NavLink to="/login" className={navLinkClass}>
                  Login
                </NavLink>
                <NavLink to="/register" className={navLinkClass}>
                  Register
                </NavLink>
              </>
            ) : (
              <Button
                variant="outline"
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
              >
                Logout ({user.name})
              </Button>
            )}
          </nav>
        </div>
      </header>
      <main className="container py-6">
        <Outlet />
      </main>
    </div>
  );
};
