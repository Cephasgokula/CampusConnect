import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { loginUser } from '@/api/auth';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Lock } from 'lucide-react';

const schema = Yup.object({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(6, 'Min 6 chars').required('Required')
});

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [role, setRole] = useState<'student' | 'admin'>('student');

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: schema,
    onSubmit: async (values) => {
      try {
        const result = await loginUser(values);
        login(result.token, result.user);
        navigate(result.user.role === 'admin' ? '/admin' : '/dashboard');
      } catch (err: any) {
        setError(err.response?.data?.message || 'Login failed');
      }
    }
  });

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="w-full max-w-md">
        <div className="rounded-xl bg-surface-container-lowest p-8 shadow-ambient-lg">
          <div className="text-center">
            <h1 className="text-headline-lg text-on-surface">Join the Pulse</h1>
            <p className="mt-2 text-body-md text-on-surface-variant">
              Curation and community for campus leaders.
            </p>
          </div>

          {/* Login / Register toggle */}
          <div className="mt-6 flex rounded-lg bg-surface-container-low p-1">
            <div className="flex-1 rounded-md bg-surface-container-lowest py-2 text-center text-sm font-semibold text-on-surface shadow-sm">
              Login
            </div>
            <Link
              to="/register"
              className="flex-1 rounded-md py-2 text-center text-sm font-medium text-on-surface-variant spring-hover hover:text-on-surface"
            >
              Register
            </Link>
          </div>

          {/* Role toggle */}
          <div className="mt-6">
            <p className="text-label-sm uppercase tracking-wider text-on-surface-variant">Role</p>
            <div className="mt-2 flex gap-3">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`flex-1 rounded-lg py-2.5 text-sm font-medium spring-hover ${
                  role === 'student'
                    ? 'bg-surface-container-lowest text-on-surface shadow-sm ghost-border'
                    : 'bg-surface-container-low text-on-surface-variant'
                }`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`flex-1 rounded-lg py-2.5 text-sm font-medium spring-hover ${
                  role === 'admin'
                    ? 'bg-surface-container-lowest text-on-surface shadow-sm ghost-border'
                    : 'bg-surface-container-low text-on-surface-variant'
                }`}
              >
                Admin
              </button>
            </div>
          </div>

          <form className="mt-6 space-y-5" onSubmit={formik.handleSubmit}>
            <div>
              <p className="mb-2 text-label-sm uppercase tracking-wider text-on-surface-variant">Email Address</p>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant/50" />
                <Input
                  name="email"
                  placeholder="name@university.edu"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  className="pl-10"
                />
              </div>
              {formik.touched.email && formik.errors.email && (
                <p className="mt-1 text-xs text-error">{formik.errors.email}</p>
              )}
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-label-sm uppercase tracking-wider text-on-surface-variant">Password</p>
                <button type="button" className="text-label-sm font-bold uppercase tracking-wider text-secondary spring-hover hover:underline">
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant/50" />
                <Input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  className="pl-10"
                />
              </div>
              {formik.touched.password && formik.errors.password && (
                <p className="mt-1 text-xs text-error">{formik.errors.password}</p>
              )}
            </div>

            {error && (
              <p className="rounded-lg bg-error-container px-4 py-3 text-sm text-error">{error}</p>
            )}

            <Button className="w-full" type="submit">
              Continue to Dashboard
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full bg-surface-container-low" style={{ height: '1px' }} />
              </div>
            </div>
            <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-surface-container-low py-3 text-sm font-medium text-on-surface-variant spring-hover hover:bg-surface-container">
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with University Google Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

