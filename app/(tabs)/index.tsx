import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import Chart from '../../components/Chart';
import Header from '../../components/Header';
import TransactionsList from '../../components/TransactionsList';
import { useTransactions } from '../../core/hooks/useTransactions';
import { useTransactionsSummary } from '../../core/hooks/useTransactionsSummary';

export default function HomeScreen() {
  const { totalIncome, totalExpenses, balance, isLoading, error, refresh } = useTransactionsSummary();
  const { recentTransactions, isLoading: transactionsLoading } = useTransactions();

  console.log('HomeScreen data:', { totalIncome, totalExpenses, balance, isLoading, error });

  const handleSeeAllPress = () => {
    // TODO: Navegar a pantalla de todas las transacciones
    console.log('Navigate to all transactions');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Chart 
            income={totalIncome}
            expenses={totalExpenses}
            size={320}
            strokeWidth={30}
          />
        </View>
        
        {/* Transactions List */}
        <View style={styles.transactionsContainer}>
          <TransactionsList
            transactions={recentTransactions}
            showAllButton={true}
            onSeeAllPress={handleSeeAllPress}
            maxItems={4}
            emptyStateType="all"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    marginTop: 30,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  transactionsContainer: {
    marginTop: 30,
    marginBottom: 100, // Espacio para la barra de navegación flotante
  },
});