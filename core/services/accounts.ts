import { Account, CreateAccountPayload, UpdateAccountPayload } from '../types/transactions';
import api from './api';

export async function getAllAccounts(): Promise<Account[]> {
  try {
    const { data } = await api.get<Account[]>('/api/accounts');
    return data;
  } catch (error) {
    console.error('getAllAccounts error:', error);
    throw error;
  }
}

export async function getAccountById(accountId: number): Promise<Account> {
  try {
    const { data } = await api.get<Account>(`/api/accounts/${accountId}`);
    return data;
  } catch (error) {
    console.error('getAccountById error:', error);
    throw error;
  }
}

export async function createAccount(accountData: CreateAccountPayload): Promise<Account> {
  try {
    console.log('Creating account with data:', accountData);
    const { data } = await api.post<Account>('/api/accounts', accountData);
    console.log('Account created successfully:', data);
    return data;
  } catch (error: any) {
    console.error('createAccount error:', error);
    console.error('Error response:', error.response?.data);
    console.error('Error status:', error.response?.status);
    throw error;
  }
}

export async function updateAccount(
  accountId: number, 
  accountData: UpdateAccountPayload
): Promise<Account> {
  try {
    console.log('Updating account', accountId, 'with data:', accountData);
    const { data } = await api.put<Account>(`/api/accounts/${accountId}`, accountData);
    console.log('Account updated successfully:', data);
    return data;
  } catch (error: any) {
    console.error('updateAccount error:', error);
    console.error('Error response:', error.response?.data);
    console.error('Error status:', error.response?.status);
    throw error;
  }
}

export async function deleteAccount(accountId: number): Promise<void> {
  try {
    console.log('Deleting account:', accountId);
    await api.delete(`/api/accounts/${accountId}`);
    console.log('Account deleted successfully');
  } catch (error: any) {
    console.error('deleteAccount error:', error);
    console.error('Error response:', error.response?.data);
    console.error('Error status:', error.response?.status);
    throw error;
  }
}