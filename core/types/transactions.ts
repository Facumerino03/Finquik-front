export interface TransactionsSummary {
  totalIncome: number;
  totalExpenses: number;
}

export interface Transaction {
  id: number;
  amount: number;
  description: string;
  iconName?: string;
  transactionDate: string;
  createdAt: string;
  account: {
    id: number;
    name: string;
    type: 'BANK_ACCOUNT' | 'CASH' | 'CREDIT_CARD';
    currentBalance: number;
    currency: string;
    createdAt: string;
    updatedAt: string;
  };
  category: {
    id: number;
    name: string;
    type: 'INCOME' | 'EXPENSE';
  };
}

export interface Category {
  id: number;
  name: string;
  type: 'INCOME' | 'EXPENSE';
  iconName?: string | null;
  iconColor?: string | null; 
}

export interface Account {
  id: number;
  name: string;
  type: string;
  currentBalance: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
  iconName?: string;
  iconColor?: string;
}

export interface CreateTransactionPayload {
  amount: number;
  description: string;
  transactionDate: string; 
  accountId: number;
  categoryId: number;
  iconName?: string;
}

export interface CreateAccountPayload {
  name: string;
  type: string;
  initialBalance: number; 
  currency: string;
  iconName?: string;
  iconColor?: string;
}

export interface UpdateAccountPayload {
  name: string;
  type: string;
  initialBalance: number; 
  currentBalance: number; 
  currency: string;
  iconName?: string;
  iconColor?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface TransactionsListProps {
  transactions: Transaction[];
  showAllButton?: boolean;
  onSeeAllPress?: () => void;
  maxItems?: number;
  emptyStateType?: 'all' | 'incomes' | 'expenses';
  showTitle?: boolean;
  isFiltered?: boolean;
  clickable?: boolean;
  onTransactionPress?: (transaction: Transaction) => void;
}