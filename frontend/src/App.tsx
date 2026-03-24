import { Route, Routes } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { HomePage } from '@/pages/HomePage';
import { EventsPage } from '@/pages/EventsPage';
import { EventDetailPage } from '@/pages/EventDetailPage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { StudentDashboardPage } from '@/pages/StudentDashboardPage';
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage';
import { ManageEventsPage } from '@/pages/admin/ManageEventsPage';
import { EventFormPage } from '@/pages/admin/EventFormPage';
import { EventParticipantsPage } from '@/pages/admin/EventParticipantsPage';

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:id" element={<EventDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute role="student" />}>
          <Route path="/dashboard" element={<StudentDashboardPage />} />
        </Route>

        <Route element={<ProtectedRoute role="admin" />}>
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/events" element={<ManageEventsPage />} />
          <Route path="/admin/events/new" element={<EventFormPage />} />
          <Route path="/admin/events/:id/edit" element={<EventFormPage />} />
          <Route path="/admin/events/:id/participants" element={<EventParticipantsPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
