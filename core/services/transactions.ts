import { CreateTransactionPayload, PaginatedResponse, Transaction, TransactionsSummary } from '../types/transactions';
import api from './api';

export interface TransactionFilters {
  type?: 'INCOME' | 'EXPENSE';
  startDate?: string; // formato YYYY-MM-DD
  endDate?: string; // formato YYYY-MM-DD
  accountId?: number;
  categoryId?: number;
}

export async function getTransactionsSummary(): Promise<TransactionsSummary> {
  const { data } = await api.get<TransactionsSummary>('/api/transactions/summary');
  return data;
}

export async function createTransaction(transactionData: CreateTransactionPayload): Promise<void> {
  await api.post('/api/transactions', transactionData);
}

// Función genérica para obtener transacciones con filtros
export async function getTransactionsWithFilters(filters: TransactionFilters = {}): Promise<Transaction[]> {
  const params = new URLSearchParams();
  
  if (filters.type) params.append('type', filters.type);
  if (filters.startDate) params.append('startDate', filters.startDate);
  if (filters.endDate) params.append('endDate', filters.endDate);
  if (filters.accountId) params.append('accountId', filters.accountId.toString());
  if (filters.categoryId) params.append('categoryId', filters.categoryId.toString());

  const queryString = params.toString();
  const url = queryString ? `/api/transactions?${queryString}` : '/api/transactions';
  
  const { data } = await api.get<PaginatedResponse<Transaction>>(url);
  return data.content;
}

// Nuevos endpoints para obtener transacciones - ahora manejan la respuesta paginada
export async function getAllTransactions(): Promise<Transaction[]> {
  const { data } = await api.get<PaginatedResponse<Transaction>>('/api/transactions');
  return data.content; // Extraer solo el array de transacciones
}

export async function getIncomeTransactions(): Promise<Transaction[]> {
  const { data } = await api.get<PaginatedResponse<Transaction>>('/api/transactions?type=INCOME');
  return data.content; // Extraer solo el array de transacciones
}

export async function getExpenseTransactions(): Promise<Transaction[]> {
  const { data } = await api.get<PaginatedResponse<Transaction>>('/api/transactions?type=EXPENSE');
  return data.content; // Extraer solo el array de transacciones
}
