import React from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import CategoryChart from '../../components/CategoryChart';
import Header from '../../components/Header';
import TransactionsList from '../../components/TransactionsList';
import { useCategoryData } from '../../core/hooks/useCategoryData';
import { useTransactions } from '../../core/hooks/useTransactions';

export default function IncomesScreen() {
  const { incomeTransactions, isLoading: transactionsLoading, error: transactionsError } = useTransactions();
  const { categoryData, isLoading: categoriesLoading, error: categoriesError } = useCategoryData('INCOME', incomeTransactions);

  const handleSeeAllPress = () => {
    // TODO: Navegar a pantalla de todas las transacciones con filtro de ingresos
    console.log('Navigate to all income transactions');
  };

  const isLoading = transactionsLoading || categoriesLoading;
  const error = transactionsError || categoriesError;

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1F2937" />
          <Text style={styles.loadingText}>Loading incomes...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <CategoryChart 
            categories={categoryData}
            size={320}
            strokeWidth={30}
            color="#00c950" // Color verde para incomes
          />
        </View>
        
        {/* Mostrar error si hay problemas */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
        
        {/* Transactions List */}
        <View style={styles.transactionsContainer}>
          <TransactionsList
            transactions={incomeTransactions}
            showAllButton={true}
            onSeeAllPress={handleSeeAllPress}
            maxItems={10}
            emptyStateType="incomes"
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
