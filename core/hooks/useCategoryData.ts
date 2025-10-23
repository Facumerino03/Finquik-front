import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getCategoriesByType } from '../services/categories';
import { Category, Transaction } from '../types/transactions';

interface CategoryData {
  category: Category;
  amount: number;
  transactionCount: number; // Agregar esta línea
}

export function useCategoryData(type: 'INCOME' | 'EXPENSE', transactions: Transaction[]) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userToken } = useAuth();

  useEffect(() => {
    if (!userToken) {
      setIsLoading(false);
      return;
    }

    const fetchCategories = async () => {
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

    fetchCategories();
  }, [userToken, type]);

  // Calcular montos por categoría cuando cambien las transacciones o categorías
  useEffect(() => {
    if (categories.length === 0 || transactions.length === 0) {
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
        transactionCount: categoryTransactions.length // Agregar esta línea
      };
    }).filter(item => item.amount > 0); // Solo mostrar categorías con transacciones

    // Ordenar por monto descendente
    data.sort((a, b) => b.amount - a.amount);

    setCategoryData(data);
  }, [categories, transactions]);

  return {
    categoryData,
    isLoading,
    error,
    refresh: () => {
      if (userToken) {
        setIsLoading(true);
        fetchCategories();
      }
    }
  };
}
