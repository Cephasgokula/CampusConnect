import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { registerUser } from '@/api/auth';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Lock, User, Hash, Building } from 'lucide-react';

const schema = Yup.object({
  name: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(6, 'Min 6 chars').required('Required'),
  rollNumber: Yup.string().optional(),
  department: Yup.string().optional()
});

export const RegisterPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      rollNumber: '',
      department: ''
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      try {
        const result = await registerUser(values);
        login(result.token, result.user);
        navigate('/dashboard');
      } catch (err: any) {
        setError(err.response?.data?.message || 'Registration failed');
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
            <Link
              to="/login"
              className="flex-1 rounded-md py-2 text-center text-sm font-medium text-on-surface-variant spring-hover hover:text-on-surface"
            >
              Login
            </Link>
            <div className="flex-1 rounded-md bg-surface-container-lowest py-2 text-center text-sm font-semibold text-on-surface shadow-sm">
              Register
            </div>
          </div>

          <form className="mt-6 space-y-5" onSubmit={formik.handleSubmit}>
            <div>
              <p className="mb-2 text-label-sm uppercase tracking-wider text-on-surface-variant">Full Name</p>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant/50" />
                <Input
                  name="name"
                  placeholder="Your full name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  className="pl-10"
                />
              </div>
              {formik.touched.name && formik.errors.name && (
                <p className="mt-1 text-xs text-error">{formik.errors.name}</p>
              )}
            </div>

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
              <p className="mb-2 text-label-sm uppercase tracking-wider text-on-surface-variant">Password</p>
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

            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="mb-2 text-label-sm uppercase tracking-wider text-on-surface-variant">Roll Number</p>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant/50" />
                  <Input
                    name="rollNumber"
                    placeholder="Optional"
                    value={formik.values.rollNumber}
                    onChange={formik.handleChange}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <p className="mb-2 text-label-sm uppercase tracking-wider text-on-surface-variant">Department</p>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant/50" />
                  <Input
                    name="department"
                    placeholder="Optional"
                    value={formik.values.department}
                    onChange={formik.handleChange}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            {error && (
              <p className="rounded-lg bg-error-container px-4 py-3 text-sm text-error">{error}</p>
            )}

            <Button className="w-full" type="submit">
              Create Account
            </Button>
          </form>

          <p className="mt-4 text-center text-body-md text-on-surface-variant">
            Already have an account?{' '}
            <Link className="font-semibold text-secondary spring-hover hover:underline" to="/login">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

