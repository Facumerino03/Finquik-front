import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import { ArrowLeft, ChevronDown, Pencil, Plus } from 'lucide-react-native';
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
import AccountSelectorModal from '../../components/AccountSelectorModal';
import CategoryIcon from '../../components/CategoryIcon';
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
  const [showAccountModal, setShowAccountModal] = useState(false);

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

  // Seleccionar la primera cuenta por defecto
  useEffect(() => {
    if (accounts.length > 0 && selectedAccountId === null) {
      setSelectedAccountId(accounts[0].id);
    }
  }, [accounts]);

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

  const handleAddCategory = () => {
    Alert.alert('Add Category', 'Feature coming soon!');
  };

  const handleCreateAccount = () => {
    Alert.alert('Create Account', 'Feature coming soon!');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const getSelectedAccountName = () => {
    const account = accounts.find(acc => acc.id === selectedAccountId);
    return account ? account.name : 'Select account';
  };

  const getSelectedAccountBalance = () => {
    const account = accounts.find(acc => acc.id === selectedAccountId);
    return account ? formatCurrency(account.currentBalance) : '';
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
            setSelectedAccountId(accounts.length > 0 ? accounts[0].id : null);
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

        {/* Content */}
        <View className="flex-1" style={{ paddingBottom: insets.bottom + 100 }}>
          {/* Top Section - Type Toggle, Amount and Date */}
          <View className="px-5">
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
            <View className="items-center py-12">
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
                className="flex-row items-center mt-6"
                activeOpacity={0.7}
              >
                <Text className="text-lg font-geist text-zinc-500">
                  {formatDateForDisplay(selectedDate)}
                </Text>
                <Pencil size={18} color="#71717a" style={{ marginLeft: 8 }} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Spacer */}
          <View className="flex-1" />

          {/* Bottom Section - Account, Category and Submit */}
          <View className="px-5 pb-8">
            {/* Account Card */}
            <View className="mb-6">
              {accounts.length > 0 ? (
                <TouchableOpacity
                  onPress={() => setShowAccountModal(true)}
                  className="flex-row items-center justify-between bg-zinc-50 rounded-2xl px-4 py-4"
                  activeOpacity={0.7}
                >
                  <View className="flex-1 flex-row items-center">
                    {/* Circle */}
                    <View 
                      className="rounded-full bg-zinc-300"
                      style={{ 
                        width: 40, 
                        height: 40,
                      }}
                    />

                    {/* Account Name and Balance */}
                    <View className="ml-3 flex-1">
                      <Text className="text-base font-geist-semibold text-zinc-950" numberOfLines={1}>
                        {getSelectedAccountName()}
                      </Text>
                      <Text className="text-lg font-geist-bold text-zinc-950 mt-1">
                        {getSelectedAccountBalance()}
                      </Text>
                    </View>
                  </View>

                  {/* Dropdown Arrow */}
                  <ChevronDown size={24} color="#09090b" />
                </TouchableOpacity>
              ) : (
                <View className="bg-zinc-50 rounded-2xl px-4 py-6 items-center">
                  <Text className="text-base font-geist text-zinc-500">
                    No accounts available
                  </Text>
                </View>
              )}
            </View>

            {/* Category Pills */}
            <View className="mb-6">
              {isLoadingCategories ? (
                <View className="py-4 items-center">
                  <ActivityIndicator size="small" color="#09090b" />
                </View>
              ) : (
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingVertical: 8 }}
                >
                  {/* Add Category Button */}
                  <TouchableOpacity
                    onPress={handleAddCategory}
                    className="w-14 h-14 rounded-full bg-zinc-100 items-center justify-center mr-2"
                    activeOpacity={0.7}
                  >
                    <Plus size={24} color="#09090b" />
                  </TouchableOpacity>

                  {/* Category Pills */}
                  {categories.map((category) => (
                    <TouchableOpacity
                      key={category.id}
                      onPress={() => setSelectedCategoryId(category.id)}
                      className={`flex-row items-center pl-2 pr-4 py-2 rounded-full mr-2 ${
                        selectedCategoryId === category.id
                          ? 'bg-zinc-950'
                          : 'bg-white border border-zinc-200'
                      }`}
                      activeOpacity={0.7}
                      style={{ height: 48 }}
                    >
                      {/* Icon Container */}
                      <View 
                        className="rounded-full items-center justify-center mr-3"
                        style={{ 
                          width: 32,
                          height: 32,
                          backgroundColor: selectedCategoryId === category.id ? '#ffffff' : '#f4f4f5'
                        }}
                      >
                        <CategoryIcon
                          iconName={category.iconName}
                          size={16}
                        />
                      </View>
                      
                      {/* Category Name */}
                      <Text 
                        className={`text-base font-geist-medium ${
                          selectedCategoryId === category.id
                            ? 'text-white'
                            : 'text-zinc-950'
                        }`}
                      >
                        {category.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>

            {/* Submit Button */}
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
        </View>
      </SafeAreaView>

      {/* Account Selector Modal */}
      <AccountSelectorModal
        visible={showAccountModal}
        onClose={() => setShowAccountModal(false)}
        accounts={accounts}
        selectedAccountId={selectedAccountId}
        onSelectAccount={setSelectedAccountId}
        onCreateAccount={handleCreateAccount}
      />

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