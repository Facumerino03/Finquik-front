import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { getAllAccounts } from "../services/accounts";
import { getAllTransactions, getExpenseTransactions, getIncomeTransactions, getTransactionsSummary } from "../services/transactions";
import { Account, Transaction } from "../types/transactions";
import { useAuth } from "./AuthContext";

interface TransactionsContextType {
  // Data
  transactions: Transaction[];
  incomeTransactions: Transaction[];
  expenseTransactions: Transaction[];
  accounts: Account[];
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  
  // States
  isLoading: boolean;
  error: string | null;
  
  // Actions
  refresh: () => Promise<void>;
  refreshAccounts: () => Promise<void>;
}

const TransactionsContext = createContext<TransactionsContextType | undefined>(undefined);

interface TransactionsProviderProps {
  children: ReactNode;
}

export const TransactionsProvider: React.FC<TransactionsProviderProps> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [incomeTransactions, setIncomeTransactions] = useState<Transaction[]>([]);
  const [expenseTransactions, setExpenseTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
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
      
      const [allData, incomeData, expenseData] = await Promise.all([
        getAllTransactions(),
        getIncomeTransactions(),
        getExpenseTransactions()
      ]);

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

  const fetchAccounts = async () => {
    if (!userToken) {
      return;
    }

    try {
      const accountsData = await getAllAccounts();
      setAccounts(accountsData);
    } catch (err) {
      console.error('fetchAccounts error:', err);
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
    await Promise.all([fetchTransactions(), fetchAccounts(), fetchSummary()]);
    setIsLoading(false);
  };

  const refreshAccounts = async () => {
    await fetchAccounts();
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
        accounts,
        totalIncome,
        totalExpenses,
        balance,
        isLoading,
        error,
        refresh,
        refreshAccounts
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
