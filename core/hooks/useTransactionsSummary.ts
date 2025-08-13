import { useCallback, useEffect, useState } from 'react';
import { getTransactionsSummary } from '../services/transactions';

export function useTransactionsSummary() {
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getTransactionsSummary();
      const income = res.totalIncome ?? 0;
      const expenses = res.totalExpenses ?? 0;
      const calculatedBalance = income - expenses;

      setTotalIncome(income);
      setTotalExpenses(expenses);
      setBalance(calculatedBalance);
    } catch (e: any) {
      setError('Failed to load summary');
      console.error('useTransactionsSummary error:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    totalIncome,
    totalExpenses,
    balance,
    isLoading,
    error,
    refresh: fetchData,
  };
}