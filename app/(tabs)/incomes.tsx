import React from 'react';
import { Text, View } from 'react-native';
import Header from '../../components/Header';
import TransactionsList from '../../components/TransactionsList';
import { useTransactions } from '../../core/hooks/useTransactions';

export default function IncomesScreen() {
  const { incomeTransactions, isLoading } = useTransactions();

  const handleSeeAllPress = () => {
    // TODO: Navegar a pantalla de todas las transacciones con filtro de ingresos
    console.log('Navigate to all income transactions');
  };

  return (
    <View className="flex-1 bg-white">
      <Header />
      <View className="flex-1 px-5 pt-6">
        <Text className="text-2xl font-geist-bold text-zinc-950 mb-6">
          Incomes
        </Text>
        <TransactionsList
          transactions={incomeTransactions}
          showAllButton={true}
          onSeeAllPress={handleSeeAllPress}
          maxItems={10}
          emptyStateType="incomes"
        />
      </View>
    </View>
  );
}