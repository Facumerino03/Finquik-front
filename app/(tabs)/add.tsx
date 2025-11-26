import DateTimePicker from '@react-native-community/datetimepicker';
import { router, useFocusEffect } from 'expo-router';
import * as LucideIcons from 'lucide-react-native';
import { ArrowLeft, ChevronDown, FileText, Pencil, Plus } from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
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
import CategoryIcon from '../../components/categories/CategoryIcon';
import AccountSelectorModal from '../../components/modal/AccountSelectorModal';
import CreateCategoryModal from '../../components/modal/CreateCategoryModal';
import DescriptionModal from '../../components/modal/DescriptionModal';
import { AVAILABLE_COLORS } from '../../core/constants/availableColors';
import { useAuth } from '../../core/contexts/AuthContext';
import { useAccounts } from '../../core/hooks/useAccounts';
import { useCreateTransaction } from '../../core/hooks/useCreateTransaction';
import { getCategoriesByType } from '../../core/services/categories';
import { Category } from '../../core/types/transactions';
import { useTransactions } from '../../core/hooks/useTransactions';

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
  const [description, setDescription] = useState('');
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [showCreateCategoryModal, setShowCreateCategoryModal] = useState(false);
  
  const { userToken, isLoading: authLoading } = useAuth();
  const { accounts, isLoading: accountsLoading, refresh: refreshAccounts } = useAccounts();
  const { createTransaction, isLoading: isCreating } = useCreateTransaction();
  const { refresh: refreshTransactions } = useTransactions();
  const insets = useSafeAreaInsets();

  // Load categories based on selected type
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
    setSelectedCategoryId(null);
  }, [selectedType, userToken]);

  useEffect(() => {
    if (accounts.length > 0 && selectedAccountId === null) {
      setSelectedAccountId(accounts[0].id);
    }
  }, [accounts]);

  useFocusEffect(
    useCallback(() => {
      loadCategories();
      refreshAccounts();
    }, [selectedType])
  );

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
    let cleanedText = text.replace(/\$/g, '');
    cleanedText = cleanedText.replace(/[^0-9.]/g, '');
    setAmount(cleanedText);
  };

  const handleAddCategory = () => {
    setShowCreateCategoryModal(true);
  };

  const handleCategoryCreated = () => {
    loadCategories(); 
    refreshTransactions(); 
  };

  const handleAccountCreated = () => {
    refreshAccounts(); 
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
        description: description || `${selectedType === 'INCOME' ? 'Income' : 'Expense'} transaction`,
        transactionDate: formatDateForAPI(selectedDate),
        accountId: selectedAccountId,
        categoryId: selectedCategoryId,
      });

      Alert.alert('Success', 'Transaction created successfully', [
        {
          text: 'OK',
          onPress: () => {
            setAmount('');
            setSelectedDate(new Date());
            setSelectedAccountId(accounts.length > 0 ? accounts[0].id : null);
            setSelectedCategoryId(null);
            setDescription('');
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

          {/* Empty space to center the title */}
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
                <View className="w-8 h-8 rounded-full bg-zinc-100 items-center justify-center ml-2">
                  <Pencil size={12} color="#71717a" strokeWidth={2} />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Spacer */}
          <View className="flex-1" />

          {/* Bottom Section - Description, Account, Category and Submit */}
          <View className="px-5 pb-8">
            {/* Add Note Button */}
            <View className="mb-6 items-center">
              <TouchableOpacity
                onPress={() => setShowDescriptionModal(true)}
                className="flex-row items-center rounded-full"
                style={{
                  backgroundColor: description ? '#f4f4f5' : '#ffffff',
                  borderWidth: 1,
                  borderColor: description ? '#09090b' : '#e4e4e7',
                  paddingLeft: 4,
                  paddingRight: 12,
                  paddingVertical: 4,
                }}
                activeOpacity={0.7}
              >
                <View
                  className="w-9 h-9 rounded-full items-center justify-center"
                  style={{
                    backgroundColor: description ? '#09090b' : '#f4f4f5',
                  }}
                >
                  <FileText
                    size={15}
                    color={description ? '#f4f4f5' : '#09090b'}
                    strokeWidth={2}
                  />
                </View>
                <Text className="text-sm font-geist-medium text-zinc-600 ml-2" numberOfLines={1}>
                  {description || 'Add note'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Account Card */}
            <View className="mb-6">
              {accounts.length > 0 ? (
                <TouchableOpacity
                  onPress={() => setShowAccountModal(true)}
                  className="flex-row items-center justify-between bg-zinc-50 rounded-xl px-4 py-5 border border-zinc-200"
                  activeOpacity={0.7}
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
                  {categories.map((category) => {
                    const isSelected = selectedCategoryId === category.id;
                    
                    const colorConfig = AVAILABLE_COLORS.find(c => c.value === category.iconColor);
                    const bgColor = colorConfig?.bg || '#f4f4f5';

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
                          paddingLeft: 6,
                          paddingRight: 14,
                          paddingTop: 6,
                          paddingBottom: 6,
                          marginRight: 8,
                        }}
                        activeOpacity={0.7}
                      >
                        {/* NOT selected */}
                        {!isSelected && (
                          <CategoryIcon
                            iconName={category.iconName}
                            iconColor={category.iconColor}
                            size={15}
                            containerSize={36}
                          />
                        )}
                        
                        {/* SELECTED - invert colors */}
                        {isSelected && IconComponent && (
                          <View 
                            className="rounded-full items-center justify-center"
                            style={{
                              width: 36,
                              height: 36,
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

        {/* Modals */}
        <CreateCategoryModal
          visible={showCreateCategoryModal}
          onClose={() => setShowCreateCategoryModal(false)}
          categoryType={selectedType}
          onCategoryCreated={handleCategoryCreated}
        />

        <DescriptionModal
          visible={showDescriptionModal}
          onClose={() => setShowDescriptionModal(false)}
          description={description}
          onSave={setDescription}
        />

        <AccountSelectorModal
          visible={showAccountModal}
          onClose={() => setShowAccountModal(false)}
          accounts={accounts}
          selectedAccountId={selectedAccountId}
          onSelectAccount={setSelectedAccountId}
          onAccountCreated={handleAccountCreated}
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
      </SafeAreaView>
    </View>
  );
}