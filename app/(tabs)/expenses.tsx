import { router } from 'expo-router';
import React from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import CategoriesList from '../../components/CategoriesList';
import CategoryChart from '../../components/CategoryChart';
import Header from '../../components/Header';
import TransactionsList from '../../components/TransactionsList';
import { useCategoryData } from '../../core/hooks/useCategoryData';
import { useTransactions } from '../../core/hooks/useTransactions';
import { useTransactionsSummary } from '../../core/hooks/useTransactionsSummary';

export default function ExpensesScreen() {
  const { expenseTransactions, isLoading: transactionsLoading, error: transactionsError } = useTransactions();
  const { categoryData, isLoading: categoriesLoading, error: categoriesError } = useCategoryData('EXPENSE', expenseTransactions);
  const { totalExpenses } = useTransactionsSummary();

  const handleSeeAllPress = () => {
    router.push('/all-transactions');
  };

  const isLoading = transactionsLoading || categoriesLoading;
  const error = transactionsError || categoriesError;

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1F2937" />
          <Text style={styles.loadingText}>Loading expenses...</Text>
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
            color="#fb2c36"
          />
        </View>
        
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
        
        {/* Transactions List */}
        <View style={styles.transactionsContainer}>
          <TransactionsList
            transactions={expenseTransactions}
            showAllButton={true}
            onSeeAllPress={handleSeeAllPress}
            maxItems={10}
            emptyStateType="expenses"
          />
        </View>

        {/* Categories List */}
        <View style={styles.categoriesContainer}>
          <CategoriesList
            categories={categoryData}
            totalAmount={totalExpenses}
            type="EXPENSE"
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
  categoriesContainer: {
    marginTop: 30,
  },
  transactionsContainer: {
    marginTop: 30,
    marginBottom: 5,
  },
});
