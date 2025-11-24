import { useState } from 'react';
import { updateTransaction } from '../services/transactions';
import { UpdateTransactionPayload } from '../services/transactions';
import { useTransactionsContext } from '../contexts/TransactionsContext';

export function useUpdateTransaction() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { refresh } = useTransactionsContext();

  const updateTransactionMutation = async (transactionId: number, transactionData: UpdateTransactionPayload) => {
    try {
      setIsLoading(true);
      setError(null);
      await updateTransaction(transactionId, transactionData);
      await refresh();
    } catch (err) {
      setError('Failed to update transaction');
      console.error('useUpdateTransaction error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateTransaction: updateTransactionMutation,
    isLoading,
    error
  };
}