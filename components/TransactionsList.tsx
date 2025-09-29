import { ArrowBigDown, ArrowBigUp } from 'lucide-react-native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { TransactionsListProps } from '../core/types/transactions';
import EmptyState from './EmptyState';

const TransactionsList: React.FC<TransactionsListProps> = ({
  transactions,
  showAllButton = true,
  onSeeAllPress,
  maxItems = 4,
  emptyStateType = 'all',
  showTitle = true // Por defecto mostrar el título
}) => {
  const displayTransactions = transactions.slice(0, maxItems);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(amount));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  };

  const getTransactionIcon = (type: 'INCOME' | 'EXPENSE') => {
    const iconProps = { size: 20 };
    
    if (type === 'INCOME') {
      return (
        <View className="w-14 h-14 bg-green-200 rounded-full items-center justify-center">
          <ArrowBigUp {...iconProps} color="#00c950" />
        </View>
      );
    } else {
      return (
        <View className="w-14 h-14 bg-red-200 rounded-full items-center justify-center">
          <ArrowBigDown {...iconProps} color="#fb2c36" />
        </View>
      );
    }
  };

  const getAmountColor = (type: 'INCOME' | 'EXPENSE') => {
    return type === 'INCOME' ? 'text-green-600' : 'text-red-600';
  };

  const getAmountPrefix = (type: 'INCOME' | 'EXPENSE') => {
    return type === 'INCOME' ? '+' : '-';
  };

  return (
    <View className="bg-white px-5">
      {/* Header - Solo mostrar si showTitle es true */}
      {showTitle && (
        <View 
          className="flex-row justify-between items-center"
          style={{ marginBottom: 24 }}
        >
          <Text className="text-zinc-950 text-2xl font-geist-semibold">
            Recent transactions
          </Text>
          {showAllButton && (
            <TouchableOpacity onPress={onSeeAllPress} activeOpacity={0.7}>
              <Text className="text-zinc-500 text-base font-geist-medium">
                See all
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Transactions List */}
      <View>
        {displayTransactions.length === 0 ? (
          <EmptyState type={emptyStateType} />
        ) : (
          displayTransactions.map((transaction, index) => (
            <View 
              key={transaction.id} 
              className="flex-row items-center justify-between"
              style={{ marginBottom: index === displayTransactions.length - 1 ? 0 : 15 }}
            >
              {/* Left side: Icon and Description/Date */}
              <View className="flex-row items-center flex-1">
                {getTransactionIcon(transaction.category.type)}
                <View className="ml-4 flex-1">
                  <Text className="text-zinc-950 text-lg font-geist-medium">
                    {transaction.description}
                  </Text>
                  <Text className="text-zinc-500 text-base font-geist">
                    {formatDate(transaction.transactionDate)}
                  </Text>
                </View>
              </View>

              {/* Right side: Amount */}
              <View className="items-end">
                <Text className={`text-lg font-geist-bold ${getAmountColor(transaction.category.type)}`}>
                  {getAmountPrefix(transaction.category.type)}{formatCurrency(transaction.amount)}
                </Text>
              </View>
            </View>
          ))
        )}
      </View>
    </View>
  );
};

export default TransactionsList;
