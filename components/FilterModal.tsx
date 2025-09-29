import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar, ChevronDown, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Modal, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Account, Category } from '../core/types/transactions';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApplyFilters: (filters: {
    type?: 'INCOME' | 'EXPENSE';
    startDate?: string;
    endDate?: string;
    accountId?: number;
    categoryId?: number;
  }) => void;
  onClearFilters: () => void;
  accounts: Account[];
  categories: Category[];
  isLoadingAccounts: boolean;
  isLoadingCategories: boolean;
  currentFilters?: {
    type?: 'INCOME' | 'EXPENSE';
    startDate?: string;
    endDate?: string;
    accountId?: number;
    categoryId?: number;
  };
}

export default function FilterModal({
  visible,
  onClose,
  onApplyFilters,
  onClearFilters,
  accounts,
  categories,
  isLoadingAccounts,
  isLoadingCategories,
  currentFilters = {}
}: FilterModalProps) {
  const [selectedType, setSelectedType] = useState<'INCOME' | 'EXPENSE' | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  
  // Estados para los date pickers
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [startDateValue, setStartDateValue] = useState(new Date());
  const [endDateValue, setEndDateValue] = useState(new Date());

  // Sincronizar el estado interno con los filtros actuales cuando se abre el modal
  useEffect(() => {
    if (visible) {
      setSelectedType(currentFilters.type || null);
      setStartDate(currentFilters.startDate || '');
      setEndDate(currentFilters.endDate || '');
      setSelectedAccountId(currentFilters.accountId || null);
      setSelectedCategoryId(currentFilters.categoryId || null);
      
      // Convertir strings de fecha a Date objects si existen
      if (currentFilters.startDate) {
        setStartDateValue(new Date(currentFilters.startDate));
      }
      if (currentFilters.endDate) {
        setEndDateValue(new Date(currentFilters.endDate));
      }
    }
  }, [visible, currentFilters]);

  const formatDateToString = (date: Date): string => {
    return date.toISOString().split('T')[0]; // Formato YYYY-MM-DD
  };

  const formatDateForDisplay = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setStartDateValue(selectedDate);
      setStartDate(formatDateToString(selectedDate));
    }
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setEndDateValue(selectedDate);
      setEndDate(formatDateToString(selectedDate));
    }
  };

  const handleApplyFilters = () => {
    const filters: any = {};
    
    if (selectedType) filters.type = selectedType;
    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;
    if (selectedAccountId) filters.accountId = selectedAccountId;
    if (selectedCategoryId) filters.categoryId = selectedCategoryId;
    
    onApplyFilters(filters);
    onClose();
  };

  const handleClearFilters = () => {
    setSelectedType(null);
    setStartDate('');
    setEndDate('');
    setSelectedAccountId(null);
    setSelectedCategoryId(null);
    setStartDateValue(new Date());
    setEndDateValue(new Date());
    onClearFilters();
    onClose();
  };

  const getSelectedAccountName = () => {
    const account = accounts.find(acc => acc.id === selectedAccountId);
    return account ? account.name : 'Select';
  };

  const getSelectedCategoryName = () => {
    const category = categories.find(cat => cat.id === selectedCategoryId);
    return category ? category.name : 'Select';
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-white rounded-t-3xl" style={{ height: '85%' }}>
          {/* Header */}
          <View className="flex-row items-center justify-between px-6 pt-10 pb-5">
            <Text className="text-2xl font-geist-semibold text-zinc-950">
              Filters
            </Text>
            <TouchableOpacity
              onPress={onClose}
              className="w-8 h-8 items-center justify-center"
              activeOpacity={0.7}
            >
              <X size={24} color="#09090b" />
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1 px-6 py-4" showsVerticalScrollIndicator={false}>
            {/* Type Filter */}
            <View className="mb-6">
              <Text className="text-lg font-geist-semibold text-zinc-950 mb-3">
                Type
              </Text>
              <View className="flex-row" style={{ gap: 5 }}>
                <TouchableOpacity
                  onPress={() => setSelectedType(selectedType === 'INCOME' ? null : 'INCOME')}
                  className={`py-3 px-6 rounded-full border ${
                    selectedType === 'INCOME' 
                      ? 'bg-green-100 border-green-300' 
                      : 'bg-white border-zinc-200'
                  }`}
                  activeOpacity={0.7}
                >
                  <Text className={`text-center font-geist-medium ${
                    selectedType === 'INCOME' ? 'text-green-700' : 'text-zinc-950'
                  }`}>
                    Incomes
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  onPress={() => setSelectedType(selectedType === 'EXPENSE' ? null : 'EXPENSE')}
                  className={`py-3 px-6 rounded-full border ${
                    selectedType === 'EXPENSE' 
                      ? 'bg-red-100 border-red-300' 
                      : 'bg-white border-gray-200'
                  }`}
                  activeOpacity={0.7}
                >
                  <Text className={`text-center font-geist-medium ${
                    selectedType === 'EXPENSE' ? 'text-red-700' : 'text-zinc-950'
                  }`}>
                    Expenses
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Date Filter */}
            <View className="mb-6">
              <Text className="text-lg font-geist-semibold text-zinc-950 mb-3">
                Date
              </Text>
              <View style={{ gap: 12 }}>
                {/* Start Date */}
                <TouchableOpacity
                  onPress={() => setShowStartDatePicker(true)}
                  className="flex-row items-center justify-between bg-white border border-zinc-200 rounded-lg px-4 py-4"
                  activeOpacity={0.7}
                >
                  <Text className={`text-base font-geist ${
                    startDate ? 'text-zinc-950' : 'text-zinc-400'
                  }`}>
                    {startDate ? formatDateForDisplay(startDate) : 'Start date'}
                  </Text>
                  <Calendar size={19} color="#71717b" />
                </TouchableOpacity>
                
                {/* End Date */}
                <TouchableOpacity
                  onPress={() => setShowEndDatePicker(true)}
                  className="flex-row items-center justify-between bg-white border border-zinc-200 rounded-lg px-4 py-4"
                  activeOpacity={0.7}
                >
                  <Text className={`text-base font-geist ${
                    endDate ? 'text-zinc-950' : 'text-zinc-400'
                  }`}>
                    {endDate ? formatDateForDisplay(endDate) : 'End date'}
                  </Text>
                  <Calendar size={19} color="#71717b" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Account Filter */}
            <View className="mb-6">
              <Text className="text-lg font-geist-semibold text-zinc-950 mb-3">
                Account
              </Text>
              <TouchableOpacity
                onPress={() => setShowAccountDropdown(!showAccountDropdown)}
                className="flex-row items-center justify-between bg-white border border-zinc-200 rounded-lg px-4 py-4"
                activeOpacity={0.7}
              >
                <Text className={`text-base font-geist ${
                  selectedAccountId ? 'text-zinc-950' : 'text-zinc-400'
                }`}>
                  {getSelectedAccountName()}
                </Text>
                <ChevronDown size={20} color="#71717b" />
              </TouchableOpacity>
              
              {showAccountDropdown && (
                <View className="mt-2 bg-white border border-zinc-200 rounded-lg max-h-40">
                  <ScrollView showsVerticalScrollIndicator={false}>
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedAccountId(null);
                        setShowAccountDropdown(false);
                      }}
                      className="px-4 py-3 border-b border-zinc-200"
                      activeOpacity={0.7}
                    >
                      <Text className="text-base font-geist text-zinc-400">All accounts</Text>
                    </TouchableOpacity>
                    {accounts.map((account) => (
                      <TouchableOpacity
                        key={account.id}
                        onPress={() => {
                          setSelectedAccountId(account.id);
                          setShowAccountDropdown(false);
                        }}
                        className="px-4 py-3 border-b border-zinc-200"
                        activeOpacity={0.7}
                      >
                        <Text className="text-base font-geist text-zinc-950">{account.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            {/* Category Filter */}
            <View className="mb-6">
              <Text className="text-lg font-geist-semibold text-zinc-950 mb-3">
                Category
              </Text>
              <TouchableOpacity
                onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
                className="flex-row items-center justify-between bg-white border border-zinc-200 rounded-lg px-4 py-4"
                activeOpacity={0.7}
              >
                <Text className={`text-base font-geist ${
                  selectedCategoryId ? 'text-zinc-950' : 'text-zinc-400'
                }`}>
                  {getSelectedCategoryName()}
                </Text>
                <ChevronDown size={20} color="#71717b" />
              </TouchableOpacity>
              
              {showCategoryDropdown && (
                <View className="mt-2 bg-white border border-zinc-200 rounded-lg max-h-40">
                  <ScrollView showsVerticalScrollIndicator={false}>
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedCategoryId(null);
                        setShowCategoryDropdown(false);
                      }}
                      className="px-4 py-3 border-b border-zinc-200"
                      activeOpacity={0.7}
                    >
                      <Text className="text-base font-geist text-zinc-400">All categories</Text>
                    </TouchableOpacity>
                    {categories.map((category) => (
                      <TouchableOpacity
                        key={category.id}
                        onPress={() => {
                          setSelectedCategoryId(category.id);
                          setShowCategoryDropdown(false);
                        }}
                        className="px-4 py-3 border-b border-zinc-200"
                        activeOpacity={0.7}
                      >
                        <Text className="text-base font-geist text-zinc-950">{category.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
          </ScrollView>

          {/* Footer Buttons */}
            <View className="flex-row px-6 py-5" style={{ gap: 12 }}>
            <TouchableOpacity
              onPress={handleClearFilters}
              className="flex-1 py-3 px-4 rounded-lg border border-zinc-200"
              activeOpacity={0.7}
            >
              <Text className="text-center text-lg font-geist-medium text-zinc-950">
                Clear
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={handleApplyFilters}
              className="flex-1 py-3 px-4 rounded-lg bg-zinc-950"
              activeOpacity={0.7}
            >
              <Text className="text-center text-lg font-geist-medium text-white">
                Apply
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Date Pickers */}
      {showStartDatePicker && (
        <DateTimePicker
          value={startDateValue}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleStartDateChange}
        />
      )}
      
      {showEndDatePicker && (
        <DateTimePicker
          value={endDateValue}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleEndDateChange}
        />
      )}
    </Modal>
  );
}
