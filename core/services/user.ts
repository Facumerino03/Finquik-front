import api from './api';

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
