import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Header from '../../components/Header';
import { useAuth } from '../../core/contexts/AuthContext';
import { useAccounts } from '../../core/hooks/useAccounts';
import { useCategories } from '../../core/hooks/useCategories';
import { useCreateTransaction } from '../../core/hooks/useCreateTransaction';

export default function AddScreen() {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(null);
  const [transactionDate, setTransactionDate] = useState(new Date().toISOString().split('T')[0]);

  const { userToken, isLoading: authLoading } = useAuth();
  const { categories, isLoading: categoriesLoading, error: categoriesError } = useCategories();
  const { accounts, isLoading: accountsLoading, error: accountsError } = useAccounts();
  const { createTransaction, isLoading: isCreating } = useCreateTransaction();

  // Debug logs más detallados
  console.log('AddScreen Debug:', {
    userToken: !!userToken,
    tokenLength: userToken?.length || 0,
    categoriesLoading,
    accountsLoading,
    categoriesCount: categories.length,
    accountsCount: accounts.length,
    categoriesError,
    accountsError,
    categoriesData: categories,
    accountsData: accounts
  });

  const handleSubmit = async () => {
    if (!amount || !description || !selectedCategoryId || !selectedAccountId) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    try {
      console.log('Creating transaction with data:', {
        amount: amountValue,
        description,
        transactionDate,
        accountId: selectedAccountId,
        categoryId: selectedCategoryId
      });

      await createTransaction({
        amount: amountValue,
        description,
        transactionDate,
        accountId: selectedAccountId,
        categoryId: selectedCategoryId
      });
      
      Alert.alert('Success', 'Transaction created successfully');
      // Reset form
      setAmount('');
      setDescription('');
      setSelectedCategoryId(null);
      setSelectedAccountId(null);
      setTransactionDate(new Date().toISOString().split('T')[0]);
    } catch (error) {
      console.error('Transaction creation error:', error);
      Alert.alert('Error', 'Failed to create transaction');
    }
  };

  // Mostrar loading mientras se cargan los datos
  if (authLoading || categoriesLoading || accountsLoading) {
    return (
      <View style={styles.container}>
        <Header />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1F2937" />
          <Text style={styles.loadingText}>Loading...</Text>
          <Text style={styles.debugText}>
            Auth: {authLoading ? 'Loading...' : 'Done'} | 
            Categories: {categoriesLoading ? 'Loading...' : `${categories.length} loaded`} | 
            Accounts: {accountsLoading ? 'Loading...' : `${accounts.length} loaded`}
          </Text>
        </View>
      </View>
    );
  }

  // Mostrar error si hay problemas de autenticación
  if (!userToken) {
    return (
      <View style={styles.container}>
        <Header />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Please log in to add transactions</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.title}>Add Transaction</Text>
          
          {/* Debug info más detallada */}
          <View style={styles.debugContainer}>
            <Text style={styles.debugText}>
              Token: {userToken ? `${userToken.substring(0, 20)}...` : 'None'}
            </Text>
            <Text style={styles.debugText}>
              Categories: {categories.length} | Accounts: {accounts.length}
            </Text>
            {categories.length > 0 && (
              <Text style={styles.debugText}>
                Categories: {categories.map(c => `${c.name}(${c.type})`).join(', ')}
              </Text>
            )}
            {accounts.length > 0 && (
              <Text style={styles.debugText}>
                Accounts: {accounts.map(a => `${a.name}(${a.type})`).join(', ')}
              </Text>
            )}
            {categoriesError && <Text style={styles.debugError}>Categories Error: {categoriesError}</Text>}
            {accountsError && <Text style={styles.debugError}>Accounts Error: {accountsError}</Text>}
          </View>
          
          {/* Mostrar errores si los hay */}
          {(categoriesError || accountsError) && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerText}>
                {categoriesError || accountsError}
              </Text>
            </View>
          )}
          
          {/* Amount Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Amount</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter amount"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Description Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter description"
              value={description}
              onChangeText={setDescription}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Category Picker */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category ({categories.length} available)</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedCategoryId}
                onValueChange={setSelectedCategoryId}
                style={styles.picker}
              >
                <Picker.Item label="Select a category" value={null} />
                {categories.map((category) => (
                  <Picker.Item
                    key={category.id}
                    label={`${category.name} (${category.type})`}
                    value={category.id}
                  />
                ))}
              </Picker>
            </View>
          </View>

          {/* Account Picker */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Account ({accounts.length} available)</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedAccountId}
                onValueChange={setSelectedAccountId}
                style={styles.picker}
              >
                <Picker.Item label="Select an account" value={null} />
                {accounts.map((account) => (
                  <Picker.Item
                    key={account.id}
                    label={`${account.name} (${account.type})`}
                    value={account.id}
                  />
                ))}
              </Picker>
            </View>
          </View>

          {/* Date Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date</Text>
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD"
              value={transactionDate}
              onChangeText={setTransactionDate}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, isCreating && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isCreating}
          >
            <Text style={styles.submitButtonText}>
              {isCreating ? 'Creating...' : 'Create Transaction'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
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
    padding: 20,
    paddingBottom: 100,
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
  debugContainer: {
    backgroundColor: '#F3F4F6',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  debugText: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  debugError: {
    fontSize: 12,
    color: '#EF4444',
    marginBottom: 4,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
  },
  errorBanner: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  errorBannerText: {
    color: '#DC2626',
    fontSize: 14,
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#374151',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  picker: {
    height: 50,
  },
  submitButton: {
    backgroundColor: '#1F2937',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});