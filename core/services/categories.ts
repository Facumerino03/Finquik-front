import { Category } from '../types/transactions';
import api from './api';

export async function getCategories(): Promise<Category[]> {
  const { data } = await api.get<Category[]>('/api/categories');
  return data;
}

export async function getCategoriesByType(type: 'INCOME' | 'EXPENSE'): Promise<Category[]> {
  const { data } = await api.get<Category[]>(`/api/categories?type=${type}`);
  return data;
}