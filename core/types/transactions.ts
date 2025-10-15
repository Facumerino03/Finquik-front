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

// Respuesta paginada del backend - Actualizada para PageResponse
export interface PaginatedResponse<T> {
  content: T[];
  pageNumber: number;        // Antes: number
  pageSize: number;          // Antes: size
  totalElements: number;     // Se mantiene igual
  totalPages: number;        // Se mantiene igual
  isLast: boolean;           // Antes: last
}

export interface TransactionsListProps {
  transactions: Transaction[];
  showAllButton?: boolean;
  onSeeAllPress?: () => void;
  maxItems?: number;
  emptyStateType?: 'all' | 'incomes' | 'expenses';
  showTitle?: boolean; // Nueva prop para controlar si mostrar el título
  isFiltered?: boolean; // Nuevo prop
}