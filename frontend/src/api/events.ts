import { api } from './client';
import type { ApiResponse, EventItem, PaginatedEvents } from '@/types';

export const fetchEvents = async (params: Record<string, string | number | undefined>): Promise<PaginatedEvents> => {
  const response = await api.get<ApiResponse<PaginatedEvents>>('/events', { params });
  return response.data.data;
};

export const fetchEvent = async (id: string): Promise<EventItem> => {
  const response = await api.get<ApiResponse<EventItem>>(`/events/${id}`);
  return response.data.data;
};

export const fetchAdminEvent = async (id: string): Promise<EventItem> => {
  const response = await api.get<ApiResponse<EventItem>>(`/events/admin/${id}`);
  return response.data.data;
};

export const fetchAdminEvents = async (): Promise<EventItem[]> => {
  const response = await api.get<ApiResponse<EventItem[]>>('/events/admin/all');
  return response.data.data;
};

export const createEvent = async (payload: FormData): Promise<EventItem> => {
  const response = await api.post<ApiResponse<EventItem>>('/events', payload, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data.data;
};

export const updateEvent = async (id: string, payload: FormData): Promise<EventItem> => {
  const response = await api.put<ApiResponse<EventItem>>(`/events/${id}`, payload, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data.data;
};

export const cancelEvent = async (id: string, reason: string): Promise<void> => {
  await api.put(`/events/${id}/cancel`, { reason });
};

export const deactivateEvent = async (id: string): Promise<void> => {
  await api.delete(`/events/${id}`);
};
