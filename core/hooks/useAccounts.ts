import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getAccounts } from '../services/accounts';
import { Account } from '../types/transactions';

export function useAccounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userToken } = useAuth();

  useEffect(() => {
    if (!userToken) {
      setIsLoading(false);
      return;
    }

    const fetchAccounts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getAccounts();
        setAccounts(data);
      } catch (err) {
        setError('Failed to load accounts');
        console.error('useAccounts error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccounts();
  }, [userToken]);

  return {
    accounts,
    isLoading,
    error,
    refresh: () => {
      if (userToken) {
        setIsLoading(true);
        fetchAccounts();
      }
    }
  };
}