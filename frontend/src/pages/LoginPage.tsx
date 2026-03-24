import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { loginUser } from '@/api/auth';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const schema = Yup.object({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(6, 'Min 6 chars').required('Required')
});

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

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
    <div className="mx-auto max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-3" onSubmit={formik.handleSubmit}>
            <Input name="email" placeholder="Email" value={formik.values.email} onChange={formik.handleChange} />
            {formik.touched.email && formik.errors.email && <p className="text-xs text-danger">{formik.errors.email}</p>}

            <Input
              name="password"
              type="password"
              placeholder="Password"
              value={formik.values.password}
              onChange={formik.handleChange}
            />
            {formik.touched.password && formik.errors.password && <p className="text-xs text-danger">{formik.errors.password}</p>}

            {error && <p className="text-sm text-danger">{error}</p>}
            <Button className="w-full" type="submit">
              Sign in
            </Button>
          </form>
          <p className="mt-3 text-sm text-slate-600">
            New here?{' '}
            <Link className="font-medium text-secondary" to="/register">
              Create account
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

