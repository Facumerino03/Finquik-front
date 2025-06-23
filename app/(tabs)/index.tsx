import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import Chart from '../../components/Chart';
import Header from '../../components/Header';

export default function HomeScreen() {
  // Datos de ejemplo
  const incomeAmount = 2830;
  const expensesAmount = 18300;

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <View style={styles.content}>
        <Chart 
          income={incomeAmount}
          expenses={expensesAmount}
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