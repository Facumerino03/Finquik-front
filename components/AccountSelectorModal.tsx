import { Check, X } from 'lucide-react-native';
import React from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Account } from '../core/types/transactions';

interface AccountSelectorModalProps {
  visible: boolean;
  onClose: () => void;
  accounts: Account[];
  selectedAccountId: number | null;
  onSelectAccount: (accountId: number) => void;
  onCreateAccount: () => void;
}

export default function AccountSelectorModal({
  visible,
  onClose,
  accounts,
  selectedAccountId,
  onSelectAccount,
  onCreateAccount,
}: AccountSelectorModalProps) {
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-white rounded-t-3xl" style={{ height: '70%' }}>
          {/* Header */}
          <View className="flex-row items-center justify-between px-6 pt-10 pb-5">
            <Text className="text-2xl font-geist-semibold text-zinc-950">
              Select Account
            </Text>
            <TouchableOpacity
              onPress={onClose}
              className="w-8 h-8 items-center justify-center"
              activeOpacity={0.7}
            >
              <X size={24} color="#09090b" />
            </TouchableOpacity>
          </View>

          {/* Accounts List */}
          <ScrollView className="flex-1 px-6 py-4" showsVerticalScrollIndicator={false}>
            {accounts.map((account) => (
              <TouchableOpacity
                key={account.id}
                onPress={() => {
                  onSelectAccount(account.id);
                  onClose();
                }}
                className={`flex-row items-center justify-between px-4 py-4 mb-3 rounded-2xl ${
                  selectedAccountId === account.id ? 'bg-zinc-100' : 'bg-zinc-50'
                }`}
                activeOpacity={0.7}
              >
                <View className="flex-row items-center flex-1">
                  {/* Circle */}
                  <View 
                    className="rounded-full bg-zinc-300"
                    style={{ 
                      width: 40, 
                      height: 40,
                    }}
                  />

                  {/* Account Info */}
                  <View className="ml-3 flex-1">
                    <Text className="text-base font-geist-semibold text-zinc-950">
                      {account.name}
                    </Text>
                    <Text className="text-lg font-geist-bold text-zinc-950 mt-1">
                      {formatCurrency(account.currentBalance)}
                    </Text>
                  </View>
                </View>

                {/* Check Icon */}
                {selectedAccountId === account.id && (
                  <Check size={20} color="#09090b" />
                )}
              </TouchableOpacity>
            ))}

            {/* Create New Account Button */}
            <TouchableOpacity
              onPress={() => {
                onClose();
                onCreateAccount();
              }}
              className="flex-row items-center px-4 py-4 rounded-2xl border-2 border-dashed border-zinc-300 bg-white mt-2"
              activeOpacity={0.7}
            >
              <View 
                className="rounded-full bg-zinc-100 items-center justify-center"
                style={{ 
                  width: 40, 
                  height: 40,
                }}
              >
                <Text className="text-2xl font-geist-bold text-zinc-950">+</Text>
              </View>

              <Text className="ml-3 text-base font-geist-semibold text-zinc-950">
                Create new account
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}