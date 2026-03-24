import { api } from './client';
import type { ApiResponse, Registration } from '@/types';

export const registerEvent = async (eventId: string): Promise<void> => {
  await api.post(`/registrations/${eventId}`);
};

export const cancelRegistration = async (eventId: string): Promise<void> => {
  await api.delete(`/registrations/${eventId}`);
};

export const fetchMyRegistrations = async (): Promise<Registration[]> => {
  const response = await api.get<ApiResponse<Registration[]>>('/registrations/my');
  return response.data.data;
};

export const fetchParticipants = async (eventId: string): Promise<Registration[]> => {
  const response = await api.get<ApiResponse<Registration[]>>(`/registrations/event/${eventId}`);
  return response.data.data;
};

export const markAttendance = async (registrationId: string): Promise<void> => {
  await api.put(`/registrations/${registrationId}/attend`);
};

export const exportParticipantsCsv = async (eventId: string): Promise<void> => {
  const response = await api.get(`/registrations/event/${eventId}/export`, {
    responseType: 'blob'
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'participants.csv');
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
