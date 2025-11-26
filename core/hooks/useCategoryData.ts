import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getCategoriesByType } from '../services/categories';
import { Category, Transaction } from '../types/transactions';

interface CategoryData {
  category: Category;
  amount: number;
  transactionCount: number;
}

export function useCategoryData(type: 'INCOME' | 'EXPENSE', transactions: Transaction[]) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { userToken } = useAuth();

  const fetchCategories = async () => {
    if (!userToken) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = await getCategoriesByType(type);
      setCategories(data);
    } catch (err) {
      setError('Failed to load categories');
      console.error('useCategoryData error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [userToken, type, refreshTrigger]);

  useEffect(() => {
    if (categories.length === 0) {
      setCategoryData([]);
      return;
    }

    const data: CategoryData[] = categories.map(category => {
      const categoryTransactions = transactions.filter(
        transaction => transaction.category.id === category.id
      );
      
      const totalAmount = categoryTransactions.reduce(
        (sum, transaction) => sum + transaction.amount, 
        0
      );

      return {
        category,
        amount: totalAmount,
        transactionCount: categoryTransactions.length
      };
    });

    data.sort((a, b) => {
      if (a.amount > 0 && b.amount > 0) {
        return b.amount - a.amount;
      }
      if (a.amount > 0) return -1;
      if (b.amount > 0) return 1;
      return a.category.name.localeCompare(b.category.name);
    });

    setCategoryData(data);
  }, [categories, transactions]);

  const refetch = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return { 
    categoryData, 
    isLoading, 
    error,
    refetch
  };
}
