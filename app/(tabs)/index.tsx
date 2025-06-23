import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import Chart from '../../components/Chart';

export default function HomeScreen() {
  // Datos de ejemplo
  const incomeAmount = 2830;
  const expensesAmount = 1830;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Chart 
          income={incomeAmount}
          expenses={expensesAmount}
          size={320}
          strokeWidth={28}
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
});