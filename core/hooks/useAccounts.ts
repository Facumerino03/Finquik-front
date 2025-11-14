import { useEffect, useState } from 'react';
import { getAllAccounts } from '../services/accounts';
import { Account } from '../types/transactions';

export function useAccounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAccounts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getAllAccounts();
      setAccounts(data);
    } catch (err) {
      console.error('useAccounts error:', err);
      setError('Failed to load accounts');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  return {
    accounts,
    isLoading,
    error,
    refresh: fetchAccounts,
  };
}