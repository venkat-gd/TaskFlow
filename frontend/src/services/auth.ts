import api from './api';
import type { User } from '@/types';

interface AuthResponse {
  message: string;
  user: User;
}

export async function registerUser(
  email: string,
  username: string,
  password: string
): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/register', {
    email,
    username,
    password,
  });
  return data;
}

export async function loginUser(
  email: string,
  password: string
): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/login', {
    email,
    password,
  });
  return data;
}

export async function logoutUser(): Promise<void> {
  await api.post('/auth/logout');
}

export async function refreshToken(): Promise<void> {
  await api.post('/auth/refresh');
}

export async function getMe(): Promise<User> {
  const { data } = await api.get<{ user: User }>('/users/me');
  return data.user;
}
