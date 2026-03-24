import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { registerUser } from '@/api/auth';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
    <div className="mx-auto max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Create Student Account</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-3" onSubmit={formik.handleSubmit}>
            <Input name="name" placeholder="Full name" value={formik.values.name} onChange={formik.handleChange} />
            {formik.touched.name && formik.errors.name && <p className="text-xs text-danger">{formik.errors.name}</p>}

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

            <Input
              name="rollNumber"
              placeholder="Roll number (optional)"
              value={formik.values.rollNumber}
              onChange={formik.handleChange}
            />
            <Input
              name="department"
              placeholder="Department (optional)"
              value={formik.values.department}
              onChange={formik.handleChange}
            />

            {error && <p className="text-sm text-danger">{error}</p>}
            <Button className="w-full" type="submit">
              Register
            </Button>
          </form>
          <p className="mt-3 text-sm text-slate-600">
            Already have an account?{' '}
            <Link className="font-medium text-secondary" to="/login">
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

