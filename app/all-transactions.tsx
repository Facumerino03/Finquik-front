import { router } from 'expo-router';
import { ArrowLeft, Filter, Search, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FilterModal from '../components/modal/FilterModal';
import TransactionsList from '../components/transactions/TransactionsList';
import { useAccounts } from '../core/hooks/useAccounts';
import { useCategories } from '../core/hooks/useCategories';
import { useTransactions } from '../core/hooks/useTransactions';
import { getTransactionsWithFilters, TransactionFilters } from '../core/services/transactions';
import { Transaction } from '../core/types/transactions';

export default function AllTransactionsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [isFiltered, setIsFiltered] = useState(false);
  const [isLoadingFiltered, setIsLoadingFiltered] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<TransactionFilters>({});
  const [showSearchInput, setShowSearchInput] = useState(false);
  
  const { transactions, isLoading, error } = useTransactions();
  const { accounts, isLoading: isLoadingAccounts } = useAccounts();
  const { categories, isLoading: isLoadingCategories } = useCategories();
  const insets = useSafeAreaInsets();

  // Search only when filters change (not by debounce)
  useEffect(() => {
    if (Object.keys(currentFilters).length > 0) {
      handleSearch();
    } else if (!searchQuery.trim()) {
      setIsFiltered(false);
      setFilteredTransactions([]);
    }
  }, [currentFilters]);

  const handleBackPress = () => {
    router.back();
  };

  const handleSearchPress = () => {
    setShowSearchInput(true);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setShowSearchInput(false);
    setIsFiltered(false);
    setFilteredTransactions([]);
  };

  const handleSearch = async () => {
    try {
      setIsLoadingFiltered(true);
      const filters: TransactionFilters = {
        ...currentFilters,
        ...(searchQuery.trim() && { description: searchQuery.trim() })
      };
      
      const filtered = await getTransactionsWithFilters(filters);
      setFilteredTransactions(filtered);
      setIsFiltered(true);
    } catch (err) {
      console.error('Error searching transactions:', err);
    } finally {
      setIsLoadingFiltered(false);
    }
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      handleSearch();
    } else {
      setIsFiltered(false);
      setFilteredTransactions([]);
    }
  };

  const handleFilterPress = () => {
    setShowFilterModal(true);
  };

  const handleApplyFilters = async (filters: TransactionFilters) => {
    try {
      setIsLoadingFiltered(true);
      const combinedFilters = {
        ...filters,
        ...(searchQuery.trim() && { description: searchQuery.trim() })
      };
      
      const filtered = await getTransactionsWithFilters(combinedFilters);
      setFilteredTransactions(filtered);
      setCurrentFilters(filters);
      setIsFiltered(true);
    } catch (err) {
      console.error('Error applying filters:', err);
    } finally {
      setIsLoadingFiltered(false);
    }
  };

  const handleClearFilters = () => {
    setIsFiltered(false);
    setFilteredTransactions([]);
    setCurrentFilters({});
    setSearchQuery('');
    setShowSearchInput(false);
  };

  const displayTransactions = isFiltered ? filteredTransactions : transactions;
  const displayLoading = isLoading || isLoadingFiltered;

  if (displayLoading) {
    return (
      <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
        <SafeAreaView className="flex-1">
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#1F2937" />
            <Text className="mt-2 text-base text-gray-500">Loading transactions...</Text>
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
            All transactions
          </Text>
          
          {/* Empty space to center the title */}
          <View className="w-10" />
        </View>

        {/* Search Bar and Filter */}
        <View className="flex-row items-center px-5 py-4">
          {/* Search Bar */}
          {showSearchInput ? (
            <View className="flex-1 flex-row items-center bg-zinc-50 rounded-full px-4">
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search transactions..."
                placeholderTextColor="#71717b"
                className="flex-1 text-base font-geist text-zinc-950"
                autoFocus={true}
                onSubmitEditing={handleSearchSubmit}
                returnKeyType="search"
                onBlur={() => {
                  if (!searchQuery.trim()) {
                    setShowSearchInput(false);
                  }
                }}
              />
              <TouchableOpacity
                onPress={handleClearSearch}
                className="ml-2"
                activeOpacity={0.7}
              >
                <X size={20} color="#71717b" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              onPress={handleSearchPress}
              className="flex-1 flex-row items-center bg-zinc-50 rounded-full px-4 py-3"
              activeOpacity={0.7}
            >
              <Search size={20} color="#09090b" />
              <Text className="ml-3 text-base text-zinc-400 font-geist">
                Search
              </Text>
            </TouchableOpacity>
          )}

          {/* Filter Button */}
          <TouchableOpacity
            onPress={handleFilterPress}
            className={`w-12 h-12 rounded-full items-center justify-center ml-2 ${
              isFiltered ? 'bg-orange-50' : 'bg-zinc-50'
            }`}
            activeOpacity={0.7}
          >
            <Filter size={20} color={isFiltered ? "#FF8904" : "#09090b"} />
          </TouchableOpacity>
        </View>

        {/* Error State */}
        {error && (
          <View className="bg-red-50 border border-red-200 rounded-lg p-3 mx-5 mb-4">
            <Text className="text-red-600 text-sm text-center font-medium">
              {error}
            </Text>
          </View>
        )}

        {/* Transactions List */}
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="pb-8 pt-5">
            <TransactionsList
              transactions={displayTransactions}
              showAllButton={false}
              showTitle={false}
              maxItems={displayTransactions.length}
              emptyStateType="all"
              isFiltered={isFiltered}
              clickable={true}
            />
          </View>
        </ScrollView>

        {/* Filter Modal */}
        <FilterModal
          visible={showFilterModal}
          onClose={() => setShowFilterModal(false)}
          onApplyFilters={handleApplyFilters}
          onClearFilters={handleClearFilters}
          accounts={accounts}
          categories={categories}
          isLoadingAccounts={isLoadingAccounts}
          isLoadingCategories={isLoadingCategories}
          currentFilters={currentFilters}
        />
      </SafeAreaView>
    </View>
  );
}