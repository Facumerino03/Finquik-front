import React from 'react';
import { Text, View } from 'react-native';
import Header from '../../components/Header';
import TransactionsList from '../../components/TransactionsList';
import { useTransactions } from '../../core/hooks/useTransactions';

export default function ExpensesScreen() {
  const { expenseTransactions, isLoading } = useTransactions();

  const handleSeeAllPress = () => {
    // TODO: Navegar a pantalla de todas las transacciones con filtro de egresos
    console.log('Navigate to all expense transactions');
  };

  return (
    <View className="flex-1 bg-white">
      <Header />
      <View className="flex-1 px-5 pt-6">
        <Text className="text-2xl font-geist-bold text-zinc-950 mb-6">
          Expenses
        </Text>
        <TransactionsList
          transactions={expenseTransactions}
          showAllButton={true}
          onSeeAllPress={handleSeeAllPress}
          maxItems={10}
          emptyStateType="expenses"
        />
      </View>
    </View>
  );
}