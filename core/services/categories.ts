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

export interface CreateCategoryPayload {
  name: string;
  type: 'INCOME' | 'EXPENSE';
  iconName?: string;
  iconColor?: string;
}

export async function createCategory(categoryData: CreateCategoryPayload): Promise<Category> {
  const { data } = await api.post<Category>('/api/categories', categoryData);
  return data;
}

export interface UpdateCategoryPayload {
  name: string;
  type: 'INCOME' | 'EXPENSE';
  iconName?: string;
  iconColor?: string;
}

export async function updateCategory(categoryId: number, categoryData: UpdateCategoryPayload): Promise<Category> {
  const { data } = await api.put<Category>(`/api/categories/${categoryId}`, categoryData);
  return data;
}

export async function deleteCategory(categoryId: number): Promise<void> {
  await api.delete(`/api/categories/${categoryId}`);
}