import { useEffect, useState } from 'react';
import { getCurrentUser, User } from '../services/user';

export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getCurrentUser();
        setUser(data);
      } catch (err) {
        setError('Failed to load user data');
        console.error('useCurrentUser error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  return {
    user,
    isLoading,
    error,
    refresh: () => {
      setIsLoading(true);
      fetchUser();
    }
  };
}
