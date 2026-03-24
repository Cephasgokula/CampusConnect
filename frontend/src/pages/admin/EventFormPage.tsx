import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { createEvent, fetchAdminEvent, updateEvent } from '@/api/events';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const schema = Yup.object({
  title: Yup.string().required('Required'),
  description: Yup.string().required('Required'),
  category: Yup.string().required('Required'),
  date: Yup.string().required('Required'),
  venue: Yup.string().required('Required'),
  capacity: Yup.number().min(1).required('Required'),
  tags: Yup.string().optional(),
  registrationDeadline: Yup.string().optional()
});

export const EventFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      category: 'workshop',
      date: '',
      endDate: '',
      venue: '',
      capacity: 50,
      tags: '',
      registrationDeadline: ''
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      try {
        const payload = new FormData();
        Object.entries(values).forEach(([key, value]) => {
          if (value !== '') payload.append(key, String(value));
        });
        if (bannerFile) payload.append('banner', bannerFile);

        if (id) {
          await updateEvent(id, payload);
        } else {
          await createEvent(payload);
        }
        navigate('/admin/events');
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to save event');
      }
    }
  });

  useEffect(() => {
    if (!id) return;
    fetchAdminEvent(id)
      .then((event) => {
        formik.setValues({
          title: event.title,
          description: event.description,
          category: event.category,
          date: event.date.slice(0, 16),
          endDate: event.endDate?.slice(0, 16) || '',
          venue: event.venue,
          capacity: event.capacity,
          tags: event.tags?.join(', ') || '',
          registrationDeadline: event.registrationDeadline?.slice(0, 16) || ''
        });
      })
      .catch(() => setError('Failed to load event'));
  }, [id]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{id ? 'Edit Event' : 'Create Event'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="grid gap-3 md:grid-cols-2" onSubmit={formik.handleSubmit}>
          <div className="md:col-span-2">
            <Input name="title" placeholder="Event title" value={formik.values.title} onChange={formik.handleChange} />
          </div>
          <div className="md:col-span-2">
            <Textarea
              name="description"
              placeholder="Description"
              value={formik.values.description}
              onChange={formik.handleChange}
            />
          </div>
          <select className="h-10 rounded-md border border-border bg-white px-3" name="category" value={formik.values.category} onChange={formik.handleChange}>
            <option value="workshop">Workshop</option>
            <option value="seminar">Seminar</option>
            <option value="cultural">Cultural</option>
            <option value="sports">Sports</option>
            <option value="technical">Technical</option>
            <option value="other">Other</option>
          </select>
          <Input name="venue" placeholder="Venue" value={formik.values.venue} onChange={formik.handleChange} />
          <Input name="date" type="datetime-local" value={formik.values.date} onChange={formik.handleChange} />
          <Input name="endDate" type="datetime-local" value={formik.values.endDate} onChange={formik.handleChange} />
          <Input name="capacity" type="number" value={formik.values.capacity} onChange={formik.handleChange} />
          <Input name="registrationDeadline" type="datetime-local" value={formik.values.registrationDeadline} onChange={formik.handleChange} />
          <div className="md:col-span-2">
            <Input name="tags" placeholder="Tags (comma separated)" value={formik.values.tags} onChange={formik.handleChange} />
          </div>
          <div className="md:col-span-2">
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setBannerFile(e.currentTarget.files?.[0] || null)}
            />
          </div>

          {error && <p className="md:col-span-2 text-sm text-danger">{error}</p>}
          <div className="md:col-span-2">
            <Button type="submit">{id ? 'Update Event' : 'Create Event'}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
