import { useState } from 'react';
import { requestPasswordReset, resetPassword } from '../services/user';

export function usePasswordReset() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestReset = async (email: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await requestPasswordReset(email);
      return true;
    } catch (err) {
      setError('Failed to send reset link');
      console.error('requestPasswordReset error:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const confirmReset = async (token: string, newPassword: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await resetPassword(token, newPassword);
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.status === 400 
        ? 'This reset link is invalid or has expired. Please request a new one.'
        : 'Failed to reset password. Please try again.';
      setError(errorMessage);
      console.error('resetPassword error:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    requestReset,
    confirmReset,
    isLoading,
    error,
  };
}