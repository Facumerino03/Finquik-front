import { router } from 'expo-router';
import { ArrowLeft, Filter, Search } from 'lucide-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FilterModal from '../components/FilterModal';
import TransactionsList from '../components/TransactionsList';
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
  
  const { transactions, isLoading, error } = useTransactions();
  const { accounts, isLoading: isLoadingAccounts } = useAccounts();
  const { categories, isLoading: isLoadingCategories } = useCategories();
  const insets = useSafeAreaInsets();

  const handleBackPress = () => {
    router.back();
  };

  const handleSearchPress = () => {
    // TODO: Implementar funcionalidad de búsqueda
    console.log('Search pressed');
  };

  const handleFilterPress = () => {
    setShowFilterModal(true);
  };

  const handleApplyFilters = async (filters: TransactionFilters) => {
    try {
      setIsLoadingFiltered(true);
      const filtered = await getTransactionsWithFilters(filters);
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
          
          {/* Espacio vacío para centrar el título */}
          <View className="w-10" />
        </View>

        {/* Search Bar y Filter */}
        <View className="flex-row items-center px-5 py-4">
          {/* Search Bar */}
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

          {/* Filter Button */}
          <TouchableOpacity
            onPress={handleFilterPress}
            className={`w-12 h-12 rounded-full items-center justify-center ml-4 ${
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