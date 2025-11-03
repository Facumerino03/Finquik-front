import { useState } from 'react';
import {
    createAccount as createAccountService,
    deleteAccount as deleteAccountService,
    updateAccount as updateAccountService
} from '../services/accounts';
import { CreateAccountPayload, UpdateAccountPayload } from '../types/transactions';
import { useTransactions } from './useTransactions';

export function useAccountsManager() {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { refreshAccounts } = useTransactions();

  // Crear una nueva cuenta
  const createAccount = async (accountData: CreateAccountPayload) => {
    setIsCreating(true);
    setError(null);
    try {
      const newAccount = await createAccountService(accountData);
      await refreshAccounts(); // Refrescar la lista de cuentas
      return newAccount;
    } catch (err) {
      const errorMessage = 'Failed to create account';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsCreating(false);
    }
  };

  // Actualizar una cuenta existente
  const updateAccount = async (accountId: number, accountData: UpdateAccountPayload) => {
    setIsUpdating(true);
    setError(null);
    try {
      const updatedAccount = await updateAccountService(accountId, accountData);
      await refreshAccounts(); // Refrescar la lista de cuentas
      return updatedAccount;
    } catch (err) {
      const errorMessage = 'Failed to update account';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsUpdating(false);
    }
  };

  // Eliminar una cuenta
  const deleteAccount = async (accountId: number) => {
    setIsDeleting(true);
    setError(null);
    try {
      await deleteAccountService(accountId);
      await refreshAccounts(); // Refrescar la lista de cuentas
    } catch (err) {
      const errorMessage = 'Failed to delete account';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    createAccount,
    updateAccount,
    deleteAccount,
    isCreating,
    isUpdating,
    isDeleting,
    error,
  };
}