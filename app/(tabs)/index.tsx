import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import Chart from '../../components/Chart';
import Header from '../../components/Header';
import { useTransactionsSummary } from '../../core/hooks/useTransactionsSummary';

export default function HomeScreen() {
  const { totalIncome, totalExpenses, balance, isLoading, error, refresh } = useTransactionsSummary();

  console.log('HomeScreen data:', { totalIncome, totalExpenses, balance, isLoading, error });

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <View style={styles.content}>
        <Chart 
          income={totalIncome}
          expenses={totalExpenses}
          size={320}
          strokeWidth={30}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    marginTop: 30,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
});