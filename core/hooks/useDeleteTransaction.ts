import { useState } from 'react';
import { deleteTransaction } from '../services/transactions';
import { useTransactionsContext } from '../contexts/TransactionsContext';

export function useDeleteTransaction() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { refresh } = useTransactionsContext();

  const deleteTransactionMutation = async (transactionId: number) => {
    try {
      setIsLoading(true);
      setError(null);
      await deleteTransaction(transactionId);
      // Refrescar todos los datos después de eliminar
      await refresh();
    } catch (err) {
      setError('Failed to delete transaction');
      console.error('useDeleteTransaction error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    deleteTransaction: deleteTransactionMutation,
    isLoading,
    error
  };
}