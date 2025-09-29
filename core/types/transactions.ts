export interface TransactionsSummary {
  totalIncome: number;
  totalExpenses: number;
}

// Estructura real de la transacción según el backend
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

// Interfaces para categorías y cuentas
export interface Category {
  id: number;
  name: string;
  type: 'INCOME' | 'EXPENSE';
}

export interface Account {
  id: number;
  name: string;
  type: 'BANK_ACCOUNT' | 'CASH' | 'CREDIT_CARD';
  currentBalance: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

// Payload para crear transacción
export interface CreateTransactionPayload {
  amount: number;
  description: string;
  transactionDate: string; // formato YYYY-MM-DD
  accountId: number;
  categoryId: number;
  iconName?: string;
}

// Respuesta paginada del backend
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
  showTitle?: boolean; // Nueva prop para controlar si mostrar el título
}