import DateTimePicker from '@react-native-community/datetimepicker';
import { router, useLocalSearchParams } from 'expo-router';
import * as LucideIcons from 'lucide-react-native';
import { ArrowLeft, Calendar, ChevronDown } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AccountSelectorModal from '../components/AccountSelectorModal';
import CategoryIcon from '../components/CategoryIcon';
import { AVAILABLE_COLORS } from '../core/constants/availableColors';
import { useAuth } from '../core/contexts/AuthContext';
import { useAccounts } from '../core/hooks/useAccounts';
import { useUpdateTransaction } from '../core/hooks/useUpdateTransaction';
import { getCategoriesByType } from '../core/services/categories';
import { getTransactionById } from '../core/services/transactions';
import { Category, Transaction } from '../core/types/transactions';

export default function EditTransactionScreen() {
  const { transactionId } = useLocalSearchParams();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedType, setSelectedType] = useState<'INCOME' | 'EXPENSE'>('INCOME');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(null);
  const [transactionDate, setTransactionDate] = useState('');
  const [transactionDateValue, setTransactionDateValue] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [originalTransaction, setOriginalTransaction] = useState<Transaction | null>(null);
  const [isLoadingTransaction, setIsLoadingTransaction] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);

  const { userToken, isLoading: authLoading } = useAuth();
  const { accounts, isLoading: accountsLoading } = useAccounts();
  const { updateTransaction, isLoading: isUpdating } = useUpdateTransaction();
  const insets = useSafeAreaInsets();

  // Cargar categorías según el tipo seleccionado
  const loadCategories = async () => {
    if (!userToken) return;

    try {
      setIsLoadingCategories(true);
      const data = await getCategoriesByType(selectedType);
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setIsLoadingCategories(false);
    }
  };

  useEffect(() => {
    loadCategories();
    // Reset category selection when type changes
    setSelectedCategoryId(null);
  }, [selectedType, userToken]);

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
      setSelectedType(originalTransaction.category.type);
      setSelectedCategoryId(originalTransaction.category.id);
      setSelectedAccountId(originalTransaction.account.id);
      setTransactionDate(originalTransaction.transactionDate);
      setTransactionDateValue(new Date(originalTransaction.transactionDate));
    }
  }, [originalTransaction]);

  const handleBackPress = () => {
    router.back();
  };

  const formatDateForDisplay = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatDateToString = (date: Date): string => {
    return date.toISOString().split('T')[0]; // Formato YYYY-MM-DD
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setTransactionDateValue(selectedDate);
      setTransactionDate(formatDateToString(selectedDate));
    }
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

  if (authLoading || accountsLoading || isLoadingTransaction) {
    return (
      <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
        <SafeAreaView className="flex-1">
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#09090b" />
            <Text className="mt-2 text-base font-geist text-zinc-500">Loading...</Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 pt-4 pb-8">
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

        {/* Content */}
        <ScrollView 
          className="flex-1 px-6" 
          showsVerticalScrollIndicator={false}
        >
          {/* Type Toggle */}
          <View className="items-center mb-8">
            <View className="flex-row bg-zinc-50 rounded-full p-1" style={{ gap: 4 }}>
              <TouchableOpacity
                onPress={() => setSelectedType('INCOME')}
                className={`px-8 py-2 rounded-full ${
                  selectedType === 'INCOME' ? 'bg-green-100' : 'bg-transparent'
                }`}
                activeOpacity={0.7}
                disabled={isUpdating}
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
                disabled={isUpdating}
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

          {/* Amount */}
          <View className="mb-8">
            <Text className="text-sm font-geist-medium text-zinc-950 mb-2">
              Amount
            </Text>
            <View className="bg-white border border-zinc-200 rounded-lg px-4 py-4 flex-row items-center">
              <Text className="text-base font-geist-medium text-zinc-500 mr-2">$</Text>
              <TextInput
                value={amount}
                onChangeText={setAmount}
                placeholder="0.00"
                placeholderTextColor="#a1a1aa"
                keyboardType="decimal-pad"
                className="flex-1 text-base font-geist-medium text-zinc-950"
                style={{ 
                  paddingVertical: 0,
                  paddingHorizontal: 0,
                  includeFontPadding: false,
                  textAlignVertical: 'center',
                }}
                editable={!isUpdating}
              />
              <Image
                source={require('../shared/assets/icons/us.png')}
                style={{ width: 24, height: 24, marginLeft: 8 }}
                resizeMode="contain"
              />
            </View>
          </View>

          {/* Description */}
          <View className="mb-8">
            <Text className="text-sm font-geist-medium text-zinc-950 mb-2">
              Description
            </Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Enter description"
              placeholderTextColor="#a1a1aa"
              className="bg-white border border-zinc-200 rounded-lg px-4 py-4 text-base font-geist text-zinc-950"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              editable={!isUpdating}
            />
          </View>

          {/* Date */}
          <View className="mb-8">
            <Text className="text-sm font-geist-medium text-zinc-950 mb-2">
              Date
            </Text>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              className="flex-row items-center justify-between bg-white border border-zinc-200 rounded-lg px-4 py-4"
              activeOpacity={0.7}
              disabled={isUpdating}
            >
              <Text className={`text-base font-geist ${
                transactionDate ? 'text-zinc-950' : 'text-zinc-400'
              }`}>
                {transactionDate ? formatDateForDisplay(transactionDate) : 'Select date'}
              </Text>
              <Calendar size={20} color="#71717b" />
            </TouchableOpacity>
          </View>

          {/* Account */}
          <View className="mb-8">
            <Text className="text-sm font-geist-medium text-zinc-950 mb-2">
              Account
            </Text>
            {accounts.length > 0 ? (
              <TouchableOpacity
                onPress={() => setShowAccountModal(true)}
                className="flex-row items-center justify-between bg-zinc-50 rounded-xl px-4 py-5 border border-zinc-200"
                activeOpacity={0.7}
                disabled={isUpdating}
              >
                <View className="flex-1 flex-row items-center">
                  {/* Account Icon */}
                  {(() => {
                    const selectedAccount = accounts.find(acc => acc.id === selectedAccountId);
                    return selectedAccount?.iconName && selectedAccount?.iconColor ? (
                      <CategoryIcon
                        iconName={selectedAccount.iconName}
                        iconColor={selectedAccount.iconColor}
                        size={20}
                        containerSize={40}
                      />
                    ) : (
                      <View 
                        className="rounded-full"
                        style={{ 
                          width: 40, 
                          height: 40,
                          backgroundColor: selectedAccount?.iconColor || '#d4d4d8',
                        }}
                      />
                    );
                  })()}

                  {/* Account Name and Balance */}
                  <View className="ml-3 flex-1">
                    <Text className="text-base font-geist-semibold text-zinc-950" numberOfLines={1}>
                      {getSelectedAccountName()}
                    </Text>
                    <Text className="text-base font-geist-medium text-zinc-500 mt-1">
                      {getSelectedAccountBalance()}
                    </Text>
                  </View>
                </View>

                {/* Dropdown Arrow */}
                <ChevronDown size={24} color="#09090b" />
              </TouchableOpacity>
            ) : (
              <View className="bg-zinc-50 rounded-lg px-4 py-6 items-center border border-zinc-200">
                <Text className="text-base font-geist text-zinc-500">
                  No accounts available
                </Text>
              </View>
            )}
          </View>

          {/* Category */}
          <View className="mb-8">
            <Text className="text-sm font-geist-medium text-zinc-950 mb-2">
              Category
            </Text>
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
                {categories.map((category) => {
                  const isSelected = selectedCategoryId === category.id;
                  
                  // Buscar el color de fondo en AVAILABLE_COLORS
                  const colorConfig = AVAILABLE_COLORS.find(c => c.value === category.iconColor);
                  const bgColor = colorConfig?.bg || '#f4f4f5';
                  
                  // Obtener el componente de icono de Lucide
                  const IconComponent = LucideIcons[category.iconName as keyof typeof LucideIcons] as React.ComponentType<any>;
                  
                  return (
                    <TouchableOpacity
                      key={category.id}
                      onPress={() => setSelectedCategoryId(category.id)}
                      className="flex-row items-center rounded-full"
                      style={{
                        backgroundColor: isSelected ? bgColor : '#ffffff',
                        borderWidth: 1,
                        borderColor: isSelected ? (category.iconColor || '#e4e4e7') : '#e4e4e7',
                        paddingLeft: 4,
                        paddingRight: 12,
                        paddingVertical: 4,
                        marginRight: 8,
                      }}
                      activeOpacity={0.7}
                      disabled={isUpdating}
                    >
                      {/* NO seleccionado */}
                      {!isSelected && (
                        <CategoryIcon
                          iconName={category.iconName}
                          iconColor={category.iconColor}
                          size={15}
                          containerSize={36}
                        />
                      )}
                      
                      {/* SELECCIONADO - invertir colores */}
                      {isSelected && IconComponent && (
                        <View 
                          className="w-9 h-9 rounded-full items-center justify-center"
                          style={{
                            backgroundColor: category.iconColor || '#71717a',
                          }}
                        >
                          <IconComponent
                            size={15}
                            color={bgColor}
                            strokeWidth={2}
                          />
                        </View>
                      )}
                      
                      {/* Category Name */}
                      <Text className="text-sm font-geist-medium text-zinc-600 ml-2">
                        {category.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}
          </View>
        </ScrollView>

        {/* Update Button */}
        <View className="px-6 pb-8 pt-4">
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
                Update transaction
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Account Selector Modal */}
      <AccountSelectorModal
        visible={showAccountModal}
        onClose={() => setShowAccountModal(false)}
        accounts={accounts}
        selectedAccountId={selectedAccountId}
        onSelectAccount={setSelectedAccountId}
      />

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={transactionDateValue}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
        />
      )}
    </View>
  );
}
