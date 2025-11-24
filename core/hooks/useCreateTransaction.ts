import { useState } from 'react';
import { useTransactionsContext } from '../contexts/TransactionsContext';
import { createTransaction } from '../services/transactions';
import { CreateTransactionPayload } from '../types/transactions';

export function useCreateTransaction() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { refresh } = useTransactionsContext();

  const createTransactionMutation = async (transactionData: CreateTransactionPayload) => {
    try {
      setIsLoading(true);
      setError(null);
      await createTransaction(transactionData);
      await refresh();
    } catch (err) {
      setError('Failed to create transaction');
      console.error('useCreateTransaction error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createTransaction: createTransactionMutation,
    isLoading,
    error
  };
}