import { CreateTransactionPayload, PaginatedResponse, Transaction, TransactionsSummary } from '../types/transactions';
import api from './api';

export async function getTransactionsSummary(): Promise<TransactionsSummary> {
  const { data } = await api.get<TransactionsSummary>('/api/transactions/summary');
  return data;
}

export async function createTransaction(transactionData: CreateTransactionPayload): Promise<void> {
  await api.post('/api/transactions', transactionData);
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
