import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { createEvent, fetchAdminEvent, updateEvent } from '@/api/events';
import { Button } from '@/components/ui/button';
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
    <div className="space-y-6">
      <h1 className="text-headline-lg text-on-surface">{id ? 'Edit Event' : 'Create Event'}</h1>

      <div className="rounded-xl bg-surface-container-lowest p-8 shadow-ambient">
        <form className="grid gap-5 md:grid-cols-2" onSubmit={formik.handleSubmit}>
          <div className="md:col-span-2">
            <p className="mb-2 text-label-sm uppercase tracking-wider text-on-surface-variant">Event Title</p>
            <Input name="title" placeholder="Event title" value={formik.values.title} onChange={formik.handleChange} />
          </div>
          <div className="md:col-span-2">
            <p className="mb-2 text-label-sm uppercase tracking-wider text-on-surface-variant">Description</p>
            <Textarea
              name="description"
              placeholder="Event description"
              value={formik.values.description}
              onChange={formik.handleChange}
            />
          </div>
          <div>
            <p className="mb-2 text-label-sm uppercase tracking-wider text-on-surface-variant">Category</p>
            <select
              className="h-11 w-full rounded-[8px] bg-surface-container-lowest px-4 text-body-md text-on-surface outline-none ghost-border focus-visible:ring-2 focus-visible:ring-secondary-fixed-dim"
              name="category"
              value={formik.values.category}
              onChange={formik.handleChange}
            >
              <option value="workshop">Workshop</option>
              <option value="seminar">Seminar</option>
              <option value="cultural">Cultural</option>
              <option value="sports">Sports</option>
              <option value="technical">Technical</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <p className="mb-2 text-label-sm uppercase tracking-wider text-on-surface-variant">Venue</p>
            <Input name="venue" placeholder="Venue" value={formik.values.venue} onChange={formik.handleChange} />
          </div>
          <div>
            <p className="mb-2 text-label-sm uppercase tracking-wider text-on-surface-variant">Start Date</p>
            <Input name="date" type="datetime-local" value={formik.values.date} onChange={formik.handleChange} />
          </div>
          <div>
            <p className="mb-2 text-label-sm uppercase tracking-wider text-on-surface-variant">End Date</p>
            <Input name="endDate" type="datetime-local" value={formik.values.endDate} onChange={formik.handleChange} />
          </div>
          <div>
            <p className="mb-2 text-label-sm uppercase tracking-wider text-on-surface-variant">Capacity</p>
            <Input name="capacity" type="number" value={formik.values.capacity} onChange={formik.handleChange} />
          </div>
          <div>
            <p className="mb-2 text-label-sm uppercase tracking-wider text-on-surface-variant">Registration Deadline</p>
            <Input name="registrationDeadline" type="datetime-local" value={formik.values.registrationDeadline} onChange={formik.handleChange} />
          </div>
          <div className="md:col-span-2">
            <p className="mb-2 text-label-sm uppercase tracking-wider text-on-surface-variant">Tags</p>
            <Input name="tags" placeholder="Tags (comma separated)" value={formik.values.tags} onChange={formik.handleChange} />
          </div>
          <div className="md:col-span-2">
            <p className="mb-2 text-label-sm uppercase tracking-wider text-on-surface-variant">Banner Image</p>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setBannerFile(e.currentTarget.files?.[0] || null)}
            />
          </div>

          {error && (
            <p className="md:col-span-2 rounded-lg bg-error-container px-4 py-3 text-sm text-error">{error}</p>
          )}
          <div className="md:col-span-2">
            <Button type="submit">{id ? 'Update Event' : 'Create Event'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
