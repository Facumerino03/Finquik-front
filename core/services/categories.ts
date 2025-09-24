import api from './api';
import { Category } from '../types/transactions';

export async function getCategories(): Promise<Category[]> {
  const { data } = await api.get<Category[]>('/api/categories');
  return data;
}