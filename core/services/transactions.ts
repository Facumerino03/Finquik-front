import api from './api';
import { TransactionsSummary } from '../types/transactions';

export async function getTransactionsSummary(): Promise<TransactionsSummary> {
  const { data } = await api.get<TransactionsSummary>('/api/transactions/summary');
  return data;
}