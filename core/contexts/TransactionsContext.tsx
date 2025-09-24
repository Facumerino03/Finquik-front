import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";
import { getAllTransactions, getExpenseTransactions, getIncomeTransactions, getTransactionsSummary } from "../services/transactions";
import { Transaction } from "../types/transactions";
import { useAuth } from "./AuthContext";

interface TransactionsContextType {
  // Datos
  transactions: Transaction[];
  incomeTransactions: Transaction[];
  expenseTransactions: Transaction[];
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  
  // Estados
  isLoading: boolean;
  error: string | null;
  
  // Acciones
  refresh: () => Promise<void>;
}

const TransactionsContext = createContext<TransactionsContextType | undefined>(undefined);

interface TransactionsProviderProps {
  children: ReactNode;
}

export const TransactionsProvider: React.FC<TransactionsProviderProps> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [incomeTransactions, setIncomeTransactions] = useState<Transaction[]>([]);
  const [expenseTransactions, setExpenseTransactions] = useState<Transaction[]>([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { userToken } = useAuth();

  const fetchTransactions = async () => {
    if (!userToken) {
      setIsLoading(false);
      return;
    }

    try {
      setError(null);
      
      // Obtener todas las transacciones en paralelo
      const [allData, incomeData, expenseData] = await Promise.all([
        getAllTransactions(),
        getIncomeTransactions(),
        getExpenseTransactions()
      ]);

      // Ordenar por fecha (más reciente primero)
      const sortByDate = (a: Transaction, b: Transaction) => 
        new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime();

      setTransactions(allData.sort(sortByDate));
      setIncomeTransactions(incomeData.sort(sortByDate));
      setExpenseTransactions(expenseData.sort(sortByDate));
    } catch (err) {
      setError('Failed to load transactions');
      console.error('fetchTransactions error:', err);
    }
  };

  const fetchSummary = async () => {
    if (!userToken) {
      return;
    }

    try {
      const res = await getTransactionsSummary();
      const income = res.totalIncome ?? 0;
      const expenses = res.totalExpenses ?? 0;
      const calculatedBalance = income - expenses;

      setTotalIncome(income);
      setTotalExpenses(expenses);
      setBalance(calculatedBalance);
    } catch (err) {
      console.error('fetchSummary error:', err);
    }
  };

  const refresh = async () => {
    setIsLoading(true);
    await Promise.all([fetchTransactions(), fetchSummary()]);
    setIsLoading(false);
  };

  useEffect(() => {
    if (userToken) {
      refresh();
    } else {
      setIsLoading(false);
    }
  }, [userToken]);

  return (
    <TransactionsContext.Provider 
      value={{ 
        transactions,
        incomeTransactions,
        expenseTransactions,
        totalIncome,
        totalExpenses,
        balance,
        isLoading,
        error,
        refresh
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
};

export const useTransactionsContext = (): TransactionsContextType => {
  const context = useContext(TransactionsContext);
  if (context === undefined) {
    throw new Error('useTransactionsContext debe ser usado dentro de un TransactionsProvider');
  }
  return context;
};
