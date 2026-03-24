import { api } from './client';
import type { ApiResponse, User } from '@/types';

interface AuthResult {
  token: string;
  user: User;
}

export const registerUser = async (payload: {
  name: string;
  email: string;
  password: string;
  rollNumber?: string;
  department?: string;
}): Promise<AuthResult> => {
  const response = await api.post<ApiResponse<AuthResult>>('/auth/register', payload);
  return response.data.data;
};

export const loginUser = async (payload: { email: string; password: string }): Promise<AuthResult> => {
  const response = await api.post<ApiResponse<AuthResult>>('/auth/login', payload);
  return response.data.data;
};
