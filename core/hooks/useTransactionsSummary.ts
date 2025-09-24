import { useTransactionsContext } from '../contexts/TransactionsContext';

export function useTransactionsSummary() {
  const context = useTransactionsContext();

  return {
    totalIncome: context.totalIncome,
    totalExpenses: context.totalExpenses,
    balance: context.balance,
    isLoading: context.isLoading,
    error: context.error,
    refresh: context.refreshSummary,
  };
}
