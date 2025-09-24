import { Account } from '../types/transactions';
import api from './api';

export async function getAccounts(): Promise<Account[]> {
  const { data } = await api.get<Account[]>('/api/accounts');
  return data;
}