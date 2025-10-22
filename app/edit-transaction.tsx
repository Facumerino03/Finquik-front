import { Picker } from '@react-native-picker/picker';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../core/contexts/AuthContext';
import { useAccounts } from '../core/hooks/useAccounts';
import { useCategories } from '../core/hooks/useCategories';
import { useUpdateTransaction } from '../core/hooks/useUpdateTransaction';
import { getTransactionById } from '../core/services/transactions';
import { Transaction } from '../core/types/transactions';

export default function EditTransactionScreen() {
  const { transactionId } = useLocalSearchParams();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(null);
  const [transactionDate, setTransactionDate] = useState('');
  const [originalTransaction, setOriginalTransaction] = useState<Transaction | null>(null);
  const [isLoadingTransaction, setIsLoadingTransaction] = useState(true);

  const { userToken, isLoading: authLoading } = useAuth();
  const { categories, isLoading: categoriesLoading, error: categoriesError } = useCategories();
  const { accounts, isLoading: accountsLoading, error: accountsError } = useAccounts();
  const { updateTransaction, isLoading: isUpdating } = useUpdateTransaction();
  const insets = useSafeAreaInsets();

  // Cargar datos de la transacción original
  useEffect(() => {
    const loadTransaction = async () => {
      if (transactionId) {
        try {
          setIsLoadingTransaction(true);
          const transaction = await getTransactionById(Number(transactionId));
          setOriginalTransaction(transaction);
        } catch (error) {
          console.error('Error loading transaction:', error);
          Alert.alert('Error', 'Failed to load transaction');
        } finally {
          setIsLoadingTransaction(false);
        }
      }
    };

    loadTransaction();
  }, [transactionId]);

  // Pre-llenar formulario cuando se carga la transacción
  useEffect(() => {
    if (originalTransaction) {
      setAmount(originalTransaction.amount.toString());
      setDescription(originalTransaction.description);
      setSelectedCategoryId(originalTransaction.category.id);
      setSelectedAccountId(originalTransaction.account.id);
      setTransactionDate(originalTransaction.transactionDate);
    }
  }, [originalTransaction]);

  const handleBackPress = () => {
    router.back();
  };

  const handleSubmit = async () => {
    if (!amount || !description || !selectedCategoryId || !selectedAccountId || !transactionDate) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (isNaN(Number(amount)) || Number(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    try {
      await updateTransaction(Number(transactionId), {
        amount: Number(amount),
        description: description.trim(),
        transactionDate,
        accountId: selectedAccountId,
        categoryId: selectedCategoryId,
      });
      
      Alert.alert('Success', 'Transaction updated successfully', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to update transaction');
    }
  };

  if (authLoading || categoriesLoading || accountsLoading || isLoadingTransaction) {
    return (
      <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
        <SafeAreaView className="flex-1">
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#1F2937" />
            <Text className="mt-2 text-base text-gray-500">Loading...</Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 py-4">
          <TouchableOpacity
            onPress={handleBackPress}
            className="w-10 h-10 rounded-full bg-zinc-950 items-center justify-center"
            activeOpacity={0.7}
          >
            <ArrowLeft size={20} color="#FFFFFF" />
          </TouchableOpacity>
          
          <Text className="text-2xl font-geist-semibold text-zinc-950">
            Edit transaction
          </Text>
          
          <View className="w-10" />
        </View>

        {/* Form */}
        <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
          <View className="space-y-6">
            {/* Amount */}
            <View>
              <Text className="text-lg font-geist-semibold text-zinc-950 mb-3">
                Amount
              </Text>
              <TextInput
                value={amount}
                onChangeText={setAmount}
                placeholder="Enter amount"
                placeholderTextColor="#71717b"
                className="bg-zinc-50 rounded-lg px-4 py-4 text-base font-geist text-zinc-950"
                keyboardType="numeric"
              />
            </View>

            {/* Description */}
            <View>
              <Text className="text-lg font-geist-semibold text-zinc-950 mb-3">
                Description
              </Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Enter description"
                placeholderTextColor="#71717b"
                className="bg-zinc-50 rounded-lg px-4 py-4 text-base font-geist text-zinc-950"
                multiline
                numberOfLines={3}
              />
            </View>

            {/* Date */}
            <View>
              <Text className="text-lg font-geist-semibold text-zinc-950 mb-3">
                Date
              </Text>
              <TextInput
                value={transactionDate}
                onChangeText={setTransactionDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#71717b"
                className="bg-zinc-50 rounded-lg px-4 py-4 text-base font-geist text-zinc-950"
              />
            </View>

            {/* Category */}
            <View>
              <Text className="text-lg font-geist-semibold text-zinc-950 mb-3">
                Category
              </Text>
              <View className="bg-zinc-50 rounded-lg">
                <Picker
                  selectedValue={selectedCategoryId}
                  onValueChange={(value) => setSelectedCategoryId(value)}
                  style={{ height: 50 }}
                >
                  <Picker.Item label="Select category" value={null} />
                  {categories.map((category) => (
                    <Picker.Item
                      key={category.id}
                      label={category.name}
                      value={category.id}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            {/* Account */}
            <View>
              <Text className="text-lg font-geist-semibold text-zinc-950 mb-3">
                Account
              </Text>
              <View className="bg-zinc-50 rounded-lg">
                <Picker
                  selectedValue={selectedAccountId}
                  onValueChange={(value) => setSelectedAccountId(value)}
                  style={{ height: 50 }}
                >
                  <Picker.Item label="Select account" value={null} />
                  {accounts.map((account) => (
                    <Picker.Item
                      key={account.id}
                      label={account.name}
                      value={account.id}
                    />
                  ))}
                </Picker>
              </View>
            </View>
          </View>

          {/* Submit Button */}
          <View className="py-8">
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={isUpdating || !amount || !description || !selectedCategoryId || !selectedAccountId || !transactionDate}
              className={`py-4 rounded-lg ${
                isUpdating || !amount || !description || !selectedCategoryId || !selectedAccountId || !transactionDate
                  ? 'bg-zinc-300'
                  : 'bg-zinc-950'
              }`}
              activeOpacity={0.7}
            >
              {isUpdating ? (
                <View className="flex-row items-center justify-center">
                  <ActivityIndicator size="small" color="#FFFFFF" />
                  <Text className="ml-2 text-lg font-geist-semibold text-white">
                    Updating...
                  </Text>
                </View>
              ) : (
                <Text className="text-lg font-geist-semibold text-white text-center">
                  Update Transaction
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
