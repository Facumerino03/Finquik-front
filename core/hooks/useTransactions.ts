import { useTransactionsContext } from '../contexts/TransactionsContext';

export function useTransactions() {
  const context = useTransactionsContext();
  
  const getRecentTransactions = (limit: number = 4) => {
    return context.transactions.slice(0, limit);
  };

  return {
    transactions: context.transactions,
    incomeTransactions: context.incomeTransactions,
    expenseTransactions: context.expenseTransactions,
    recentTransactions: getRecentTransactions(),
    isLoading: context.isLoading,
    error: context.error,
    refresh: context.refreshTransactions,
  };
}
