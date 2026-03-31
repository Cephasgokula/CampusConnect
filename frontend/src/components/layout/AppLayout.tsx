import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Search, User } from 'lucide-react';

const navLinkClass = ({ isActive }: { isActive: boolean }): string =>
  isActive
    ? 'text-on-surface font-semibold underline underline-offset-[6px] decoration-2 decoration-primary'
    : 'text-on-surface-variant hover:text-on-surface spring-hover';

export const AppLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <header className="sticky top-0 z-50 glass-header">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-lg font-bold text-primary">
              Campus Pulse
            </Link>
            <nav className="flex items-center gap-6 text-sm">
              <NavLink to="/" className={navLinkClass}>
                Home
              </NavLink>
              <NavLink to="/events" className={navLinkClass}>
                Events
              </NavLink>
              {user ? (
                user.role === 'admin' ? (
                  <NavLink to="/admin" className={navLinkClass}>
                    Dashboard
                  </NavLink>
                ) : (
                  <NavLink to="/dashboard" className={navLinkClass}>
                    Dashboard
                  </NavLink>
                )
              ) : (
                <NavLink to="/login" className={navLinkClass}>
                  Auth
                </NavLink>
              )}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex h-9 w-9 items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container-low spring-hover">
              <Search className="h-4 w-4" />
            </button>
            {user ? (
              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white spring-hover hover:bg-primary-container"
                title={`Logout (${user.name})`}
              >
                <User className="h-4 w-4" />
              </button>
            ) : (
              <Link
                to="/login"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-container-low text-on-surface-variant spring-hover hover:bg-surface-container"
              >
                <User className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="container flex-1 py-8">
        <Outlet />
      </main>

      <footer className="bg-surface-container-low py-10">
        <div className="container flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-lg font-bold text-on-surface">Campus Pulse</p>
            <p className="mt-1 text-label-sm uppercase tracking-wider text-on-surface-variant">
              © 2024 Campus Pulse. Editorial precision for campus life.
            </p>
          </div>
          <nav className="flex gap-6 text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant">
            <span className="cursor-pointer spring-hover hover:text-on-surface">About</span>
            <span className="cursor-pointer spring-hover hover:text-on-surface">Contact</span>
            <span className="cursor-pointer spring-hover hover:text-on-surface">Help</span>
            <span className="cursor-pointer spring-hover hover:text-on-surface">Privacy</span>
          </nav>
        </div>
      </footer>
    </div>
  );
};
