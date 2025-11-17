import axios from 'axios';
import api from './api';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
}

export async function getCurrentUser(): Promise<User> {
  const { data } = await api.get<User>('/api/users/me');
  return data;
}

// Nuevas funciones para reseteo de contraseña
export async function requestPasswordReset(email: string): Promise<void> {
  // No necesita autenticación, usamos axios directamente
  await axios.post(`${API_URL}/api/auth/forgot-password`, { email });
}

export async function resetPassword(token: string, newPassword: string): Promise<void> {
  // No necesita autenticación, usamos axios directamente
  await axios.post(`${API_URL}/api/auth/reset-password`, { token, newPassword });
}
