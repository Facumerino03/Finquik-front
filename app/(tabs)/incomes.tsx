import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import Header from '../../components/Header';
import TransactionsList from '../../components/TransactionsList';
import { useTransactions } from '../../core/hooks/useTransactions';

export default function IncomesScreen() {
  const { incomeTransactions, isLoading, error } = useTransactions();

  const handleSeeAllPress = () => {
    // TODO: Navegar a pantalla de todas las transacciones con filtro de ingresos
    console.log('Navigate to all income transactions');
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-white">
        <Header />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#1F2937" />
          <Text className="text-zinc-500 mt-4">Loading incomes...</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <Header />
      <View className="flex-1 px-5 pt-6">
        <Text className="text-2xl font-geist-bold text-zinc-950 mb-6">
          Incomes
        </Text>
        {error ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-red-500 text-center">{error}</Text>
          </View>
        ) : (
          <TransactionsList
            transactions={incomeTransactions}
            showAllButton={true}
            onSeeAllPress={handleSeeAllPress}
            maxItems={10}
            emptyStateType="incomes"
          />
        )}
      </View>
    </View>
  );
}
