import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getCategories } from '../services/categories';
import { Category } from '../types/transactions';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
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
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        setError('Failed to load categories');
        console.error('useCategories error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [userToken]);

  return {
    categories,
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