import React from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import Chart from '../../components/Chart';
import Header from '../../components/Header';
import TransactionsList from '../../components/TransactionsList';
import { useTransactions } from '../../core/hooks/useTransactions';
import { useTransactionsSummary } from '../../core/hooks/useTransactionsSummary';

export default function HomeScreen() {
  const { totalIncome, totalExpenses, balance, isLoading, error } = useTransactionsSummary();
  const { recentTransactions, isLoading: transactionsLoading, error: transactionsError } = useTransactions();

  console.log('HomeScreen data:', { 
    totalIncome, 
    totalExpenses, 
    balance, 
    isLoading, 
    error,
    transactionsCount: recentTransactions.length,
    transactionsLoading,
    transactionsError
  });

  const handleSeeAllPress = () => {
    // TODO: Navegar a pantalla de todas las transacciones
    console.log('Navigate to all transactions');
  };

  // Mostrar loading si están cargando los datos principales
  if (isLoading || transactionsLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1F2937" />
          <Text style={styles.loadingText}>Loading your financial data...</Text>
        </View>
      </SafeAreaView>
    );
  }

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
        
        {/* Mostrar error si hay problemas con las transacciones */}
        {transactionsError && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{transactionsError}</Text>
          </View>
        )}
        
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6B7280',
  },
  errorContainer: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 20,
    marginTop: 20,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  transactionsContainer: {
    marginTop: 30,
    marginBottom: 100, // Espacio para la barra de navegación flotante
  },
});