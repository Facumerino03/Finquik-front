export interface TransactionsSummary {
  totalIncome: number;
  totalExpenses: number;
}

export interface Transaction {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  description: string;
  date: string;
  category?: string;
}

export interface TransactionsListProps {
  transactions: Transaction[];
  showAllButton?: boolean;
  onSeeAllPress?: () => void;
  maxItems?: number;
  emptyStateType?: 'all' | 'incomes' | 'expenses';
}