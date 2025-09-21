import { useEffect, useState } from 'react';
import { Transaction } from '../types/transactions';

// Datos hardcodeados para testing
const mockTransactions: Transaction[] = [
  // {
  //   id: '1',
  //   amount: 100,
  //   type: 'expense',
  //   description: 'Starbucks',
  //   date: '2025-01-08',
  //   category: 'Food'
  // },
  // {
  //   id: '2',
  //   amount: 100,
  //   type: 'income',
  //   description: 'Transaction',
  //   date: '2025-01-08',
  //   category: 'Work'
  // },
  // {
  //   id: '3',
  //   amount: 320,
  //   type: 'expense',
  //   description: 'Adobe',
  //   date: '2025-01-08',
  //   category: 'Software'
  // },
  // {
  //   id: '4',
  //   amount: 1300,
  //   type: 'income',
  //   description: 'Transaction',
  //   date: '2025-01-08',
  //   category: 'Work'
  // },
  // {
  //   id: '5',
  //   amount: 50,
  //   type: 'expense',
  //   description: 'Transport',
  //   date: '2025-01-07',
  //   category: 'Transportation'
  // },
  // {
  //   id: '6',
  //   amount: 200,
  //   type: 'income',
  //   description: 'Bonus',
  //   date: '2025-01-07',
  //   category: 'Work'
  // }
];

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setTransactions(mockTransactions);
      setIsLoading(false);
    }, 1000);
  }, []);

  const getIncomeTransactions = () => {
    return transactions.filter(t => t.type === 'income');
  };

  const getExpenseTransactions = () => {
    return transactions.filter(t => t.type === 'expense');
  };

  const getRecentTransactions = (limit: number = 4) => {
    return transactions
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  };

  return {
    transactions,
    incomeTransactions: getIncomeTransactions(),
    expenseTransactions: getExpenseTransactions(),
    recentTransactions: getRecentTransactions(),
    isLoading,
    refresh: () => {
      setIsLoading(true);
      setTimeout(() => {
        setTransactions(mockTransactions);
        setIsLoading(false);
      }, 1000);
    }
  };
}
