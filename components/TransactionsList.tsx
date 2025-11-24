import { ArrowBigDown, ArrowBigUp } from 'lucide-react-native';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Transaction, TransactionsListProps } from '../core/types/transactions';
import EmptyState from './EmptyState';
import TransactionDetailsModal from './TransactionDetailsModal';

const TransactionsList: React.FC<TransactionsListProps> = ({
  transactions,
  showAllButton = true,
  onSeeAllPress,
  maxItems = 4,
  emptyStateType = 'all',
  showTitle = true,
  isFiltered = false,
  clickable = false,
  onTransactionPress
}) => {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

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

  const handleTransactionPress = (transaction: Transaction) => {
    if (clickable) {
      setSelectedTransaction(transaction);
      setModalVisible(true);
    }
    if (onTransactionPress) {
      onTransactionPress(transaction);
    }
  };

  const handleEditTransaction = (transaction: Transaction) => {
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedTransaction(null);
  };

  const TransactionItem = ({ transaction, index }: { transaction: Transaction; index: number }) => {
    const content = (
      <>
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

        <View className="items-end">
          <Text className={`text-lg font-geist-bold ${getAmountColor(transaction.category.type)}`}>
            {getAmountPrefix(transaction.category.type)}{formatCurrency(transaction.amount)}
          </Text>
        </View>
      </>
    );

    if (clickable) {
      return (
        <TouchableOpacity
          key={transaction.id}
          onPress={() => handleTransactionPress(transaction)}
          className="flex-row items-center justify-between"
          style={{ 
            marginBottom: index === displayTransactions.length - 1 ? 0 : 15,
            paddingVertical: 8,
          }}
          activeOpacity={0.7}
        >
          {content}
        </TouchableOpacity>
      );
    }

    return (
      <View 
        key={transaction.id}
        className="flex-row items-center justify-between"
        style={{ marginBottom: index === displayTransactions.length - 1 ? 0 : 15 }}
      >
        {content}
      </View>
    );
  };

  return (
    <>
      <View className="bg-white px-5">
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

        <View>
          {displayTransactions.length === 0 ? (
            <EmptyState type={emptyStateType} isFiltered={isFiltered} />
          ) : (
            displayTransactions.map((transaction, index) => (
              <TransactionItem 
                key={transaction.id}
                transaction={transaction} 
                index={index} 
              />
            ))
          )}
        </View>
      </View>

      {clickable && (
        <TransactionDetailsModal
          visible={modalVisible}
          transaction={selectedTransaction}
          onClose={handleCloseModal}
          onEdit={handleEditTransaction}
        />
      )}
    </>
  );
};

export default TransactionsList;
