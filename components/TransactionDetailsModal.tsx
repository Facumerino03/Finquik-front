import { router } from 'expo-router';
import { ArrowBigDown, ArrowBigUp, Edit, Trash2, X } from 'lucide-react-native';
import React from 'react';
import {
    ActivityIndicator,
    Alert,
    Modal,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useDeleteTransaction } from '../core/hooks/useDeleteTransaction';
import { Transaction } from '../core/types/transactions';

interface TransactionDetailsModalProps {
  visible: boolean;
  transaction: Transaction | null;
  onClose: () => void;
  onEdit: (transaction: Transaction) => void;
}

const TransactionDetailsModal: React.FC<TransactionDetailsModalProps> = ({
  visible,
  transaction,
  onClose,
  onEdit,
}) => {
  const { deleteTransaction, isLoading: isDeleting } = useDeleteTransaction();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Math.abs(amount));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getTransactionIcon = (type: 'INCOME' | 'EXPENSE') => {
    const iconProps = { size: 22 };
    
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

  const getTypeBadge = (type: 'INCOME' | 'EXPENSE') => {
    return (
      <View className={`px-3 py-1 rounded-full ${
        type === 'INCOME' 
          ? 'bg-green-100' 
          : 'bg-red-100'
      }`}>
        <Text className={`text-sm font-geist-medium ${
          type === 'INCOME' 
            ? 'text-green-700' 
            : 'text-red-700'
        }`}>
          {type === 'INCOME' ? 'Income' : 'Expense'}
        </Text>
      </View>
    );
  };

  const handleDelete = () => {
    if (!transaction) return;

    Alert.alert(
      'Delete Transaction',
      'Are you sure you want to delete this transaction? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTransaction(transaction.id);
              onClose();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete transaction');
            }
          },
        },
      ]
    );
  };

  const handleEdit = () => {
    if (transaction) {
      // Navegar a la pantalla de edición con el ID de la transacción
      router.push({
        pathname: '/edit-transaction',
        params: { transactionId: transaction.id.toString() }
      });
      onClose();
    }
  };

  if (!transaction) return null;

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
              Transaction details
            </Text>
            <TouchableOpacity
              onPress={onClose}
              className="w-8 h-8 items-center justify-center"
              activeOpacity={0.7}
            >
              <X size={24} color="#09090b" />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View className="flex-1 px-6 py-4">
            {/* Transaction Header */}
            <View className="flex-row items-center justify-between mb-8">
              <View className="flex-row items-center flex-1">
                {getTransactionIcon(transaction.category.type)}
                <View className="ml-4 flex-1">
                  <Text className="text-xl font-geist-semibold text-zinc-950">
                    {transaction.description}
                  </Text>
                  <Text className="text-base font-geist text-zinc-500 mt-1">
                    {formatDate(transaction.transactionDate)}
                  </Text>
                </View>
              </View>
              <Text className={`text-2xl font-geist-bold ${
                transaction.category.type === 'INCOME' ? 'text-green-600' : 'text-red-600'
              }`}>
                {transaction.category.type === 'INCOME' ? '+' : '-'}{formatCurrency(transaction.amount)}
              </Text>
            </View>

            {/* Type Badge */}
            <View className="mb-6">
              <View className="flex-row justify-between items-center py-4">
                <Text className="text-base font-geist-medium text-zinc-950">
                  Type
                </Text>
                {getTypeBadge(transaction.category.type)}
              </View>
            </View>

            {/* Transaction Details Section */}
            <View className="mb-6">
              <Text className="text-lg font-geist-semibold text-zinc-950 mb-3">
                Transaction details
              </Text>
              
              <View className="space-y-4">
                {/* Account */}
                <View className="flex-row justify-between items-center py-3">
                  <Text className="text-base font-geist-medium text-zinc-950">
                    Account
                  </Text>
                  <Text className="text-base font-geist text-zinc-500">
                    {transaction.account.name}
                  </Text>
                </View>

                {/* Category */}
                <View className="flex-row justify-between items-center py-3">
                  <Text className="text-base font-geist-medium text-zinc-950">
                    Category
                  </Text>
                  <Text className="text-base font-geist text-zinc-500">
                    {transaction.category.name}
                  </Text>
                </View>
              </View>
            </View>

            {/* Additional Information Section */}
            <View className="mb-6">
              <Text className="text-lg font-geist-semibold text-zinc-950 mb-3">
                Additional information
              </Text>
              
              <View className="space-y-4">
                {/* Transaction ID */}
                <View className="flex-row justify-between items-center py-3">
                  <Text className="text-base font-geist-medium text-zinc-950">
                    Transaction ID
                  </Text>
                  <Text className="text-base font-geist text-zinc-500">
                    TXN-{transaction.id.toString().padStart(10, '0')}
                  </Text>
                </View>

                {/* Created Date */}
                <View className="flex-row justify-between items-center py-3">
                  <Text className="text-base font-geist-medium text-zinc-950">
                    Created
                  </Text>
                  <Text className="text-base font-geist text-zinc-500">
                    {formatDate(transaction.createdAt)}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Footer Buttons */}
          <View className="flex-row px-6 py-5" style={{ gap: 12 }}>
            <TouchableOpacity
              onPress={handleDelete}
              className="flex-1 py-3 px-4 rounded-lg border border-zinc-200"
              activeOpacity={0.7}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <View className="flex-row items-center justify-center">
                  <ActivityIndicator size="small" color="#09090b" />
                  <Text className="ml-2 text-lg font-geist-medium text-zinc-950">
                    Deleting...
                  </Text>
                </View>
              ) : (
                <View className="flex-row items-center justify-center">
                  <Trash2 size={20} color="#09090b" />
                  <Text className="ml-2 text-lg font-geist-medium text-zinc-950">
                    Delete
                  </Text>
                </View>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={handleEdit}
              className="flex-1 py-3 px-4 rounded-lg bg-zinc-950"
              activeOpacity={0.7}
            >
              <View className="flex-row items-center justify-center">
                <Edit size={20} color="#FFFFFF" />
                <Text className="ml-2 text-lg font-geist-medium text-white">
                  Edit
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default TransactionDetailsModal;