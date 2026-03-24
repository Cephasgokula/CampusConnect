import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { api } from '@/api/client';
import type { ApiResponse, User } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  refreshMe: () => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('cems_token'));
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem('cems_user');
    return raw ? (JSON.parse(raw) as User) : null;
  });
  const [loading, setLoading] = useState(true);

  const login = (nextToken: string, nextUser: User): void => {
    localStorage.setItem('cems_token', nextToken);
    localStorage.setItem('cems_user', JSON.stringify(nextUser));
    setToken(nextToken);
    setUser(nextUser);
  };

  const logout = (): void => {
    localStorage.removeItem('cems_token');
    localStorage.removeItem('cems_user');
    setToken(null);
    setUser(null);
  };

  const refreshMe = async (): Promise<void> => {
    try {
      if (!localStorage.getItem('cems_token')) {
        setLoading(false);
        return;
      }

      const response = await api.get<ApiResponse<User>>('/auth/me');
      setUser(response.data.data);
      localStorage.setItem('cems_user', JSON.stringify(response.data.data));
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refreshMe();
  }, []);

  const value = useMemo(
    () => ({ user, token, loading, login, logout, refreshMe }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthState => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
