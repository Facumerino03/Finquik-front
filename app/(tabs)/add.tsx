import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import { ArrowLeft, Pencil } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../core/contexts/AuthContext';
import { useAccounts } from '../../core/hooks/useAccounts';
import { useCreateTransaction } from '../../core/hooks/useCreateTransaction';
import { getCategoriesByType } from '../../core/services/categories';
import { Category } from '../../core/types/transactions';

export default function AddTransactionScreen() {
  const [amount, setAmount] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedType, setSelectedType] = useState<'INCOME' | 'EXPENSE'>('INCOME');
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);

  const { userToken, isLoading: authLoading } = useAuth();
  const { accounts, isLoading: accountsLoading } = useAccounts();
  const { createTransaction, isLoading: isCreating } = useCreateTransaction();
  const insets = useSafeAreaInsets();

  // Cargar categorías según el tipo seleccionado
  useEffect(() => {
    const loadCategories = async () => {
      if (!userToken) return;

      try {
        setIsLoadingCategories(true);
        const data = await getCategoriesByType(selectedType);
        setCategories(data);
        // Reset category selection when type changes
        setSelectedCategoryId(null);
      } catch (error) {
        console.error('Error loading categories:', error);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    loadCategories();
  }, [selectedType, userToken]);

  const handleBackPress = () => {
    router.back();
  };

  const formatDateForDisplay = (date: Date): string => {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatDateForAPI = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setSelectedDate(selectedDate);
    }
  };

  const handleAmountChange = (text: string) => {
    // Remover el símbolo $ si el usuario lo escribe
    let cleanedText = text.replace(/\$/g, '');
    // Remover cualquier carácter que no sea número o punto decimal
    cleanedText = cleanedText.replace(/[^0-9.]/g, '');
    setAmount(cleanedText);
  };

  const handleSubmit = async () => {
    if (!amount || !selectedCategoryId || !selectedAccountId) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    try {
      await createTransaction({
        amount: amountValue,
        description: `${selectedType === 'INCOME' ? 'Income' : 'Expense'} transaction`,
        transactionDate: formatDateForAPI(selectedDate),
        accountId: selectedAccountId,
        categoryId: selectedCategoryId,
      });

      Alert.alert('Success', 'Transaction created successfully', [
        {
          text: 'OK',
          onPress: () => {
            // Reset form
            setAmount('');
            setSelectedDate(new Date());
            setSelectedAccountId(null);
            setSelectedCategoryId(null);
            router.back();
          },
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to create transaction');
    }
  };

  if (authLoading || accountsLoading) {
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
            Add transactions
          </Text>

          {/* Espacio vacío para centrar el título */}
          <View className="w-10" />
        </View>

        {/* Form */}
        <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View className="space-y-6">
            {/* Type Toggle */}
            <View className="items-center mt-6 mb-4">
              <View className="flex-row bg-zinc-50 rounded-full p-1" style={{ gap: 4 }}>
                <TouchableOpacity
                  onPress={() => setSelectedType('INCOME')}
                  className={`px-8 py-2 rounded-full ${
                    selectedType === 'INCOME' ? 'bg-green-100' : 'bg-transparent'
                  }`}
                  activeOpacity={0.7}
                >
                  <Text
                    className={`text-base font-geist-medium ${
                      selectedType === 'INCOME' ? 'text-green-700' : 'text-zinc-500'
                    }`}
                  >
                    Income
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setSelectedType('EXPENSE')}
                  className={`px-8 py-2 rounded-full ${
                    selectedType === 'EXPENSE' ? 'bg-red-100' : 'bg-transparent'
                  }`}
                  activeOpacity={0.7}
                >
                  <Text
                    className={`text-base font-geist-medium ${
                      selectedType === 'EXPENSE' ? 'text-red-700' : 'text-zinc-500'
                    }`}
                  >
                    Expense
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Amount Display */}
            <View className="items-center py-6">
              <View className="flex-row items-center justify-center" style={{ alignItems: 'baseline' }}>
                <Text 
                  className="text-6xl font-geist-bold"
                  style={{ color: amount ? '#09090b' : '#71717b' }}
                >
                  $
                </Text>
                <TextInput
                  value={amount}
                  onChangeText={handleAmountChange}
                  placeholder="0"
                  placeholderTextColor="#71717b"
                  className="text-6xl font-geist-bold text-zinc-950"
                  keyboardType="numeric"
                  style={{
                    padding: 0,
                    paddingVertical: 0,
                    paddingHorizontal: 0,
                    margin: 0,
                    minWidth: 50,
                    textAlign: 'left',
                    includeFontPadding: false,
                    textAlignVertical: 'center',
                    lineHeight: Platform.OS === 'android' ? 90 : undefined,
                  }}
                />
              </View>
              
              {/* Date with Edit Icon */}
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                className="flex-row items-center mt-4"
                activeOpacity={0.7}
              >
                <Text className="text-lg font-geist text-zinc-500">
                  {formatDateForDisplay(selectedDate)}
                </Text>
                <Pencil size={18} color="#71717a" style={{ marginLeft: 8 }} />
              </TouchableOpacity>
            </View>

            {/* Account */}
            <View className="mt-8">
              <Text className="text-lg font-geist-semibold text-zinc-950 mb-3">
                Account
              </Text>
              <View className="bg-zinc-50 rounded-lg">
                <Picker
                  selectedValue={selectedAccountId}
                  onValueChange={(value) => setSelectedAccountId(value)}
                  style={{ height: 50 }}
                >
                  <Picker.Item label="Select" value={null} color="#71717b" />
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
                  enabled={!isLoadingCategories}
                >
                  <Picker.Item 
                    label={isLoadingCategories ? "Loading..." : "Select"} 
                    value={null} 
                    color="#71717b" 
                  />
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
          </View>

          {/* Submit Button */}
          <View className="py-8">
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={
                isCreating ||
                !amount ||
                !selectedCategoryId ||
                !selectedAccountId
              }
              className={`py-4 rounded-lg ${
                isCreating ||
                !amount ||
                !selectedCategoryId ||
                !selectedAccountId
                  ? 'bg-zinc-300'
                  : 'bg-zinc-950'
              }`}
              activeOpacity={0.7}
            >
              {isCreating ? (
                <View className="flex-row items-center justify-center">
                  <ActivityIndicator size="small" color="#FFFFFF" />
                  <Text className="ml-2 text-lg font-geist-semibold text-white">
                    Creating...
                  </Text>
                </View>
              ) : (
                <Text className="text-lg font-geist-semibold text-white text-center">
                  Add Transaction
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
        />
      )}
    </View>
  );
}