import { Check, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Account } from '../core/types/transactions';
import CategoryIcon from './CategoryIcon';
import CreateAccountModal from './CreateAccountModal';

interface AccountSelectorModalProps {
  visible: boolean;
  onClose: () => void;
  accounts: Account[];
  selectedAccountId: number | null;
  onSelectAccount: (accountId: number) => void;
}

export default function AccountSelectorModal({
  visible,
  onClose,
  accounts,
  selectedAccountId,
  onSelectAccount,
}: AccountSelectorModalProps) {
  const [showCreateAccountModal, setShowCreateAccountModal] = useState(false);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const handleCreateAccount = () => {
    onClose();
    setShowCreateAccountModal(true);
  };

  return (
    <>
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
                    {/* Icon with account color */}
                    {account.iconName && account.iconColor ? (
                      <CategoryIcon
                        iconName={account.iconName}
                        iconColor={account.iconColor}
                        size={20}
                        containerSize={40}
                      />
                    ) : (
                      // Fallback: círculo con color sólido si no hay icono
                      <View 
                        className="rounded-full"
                        style={{ 
                          width: 40, 
                          height: 40,
                          backgroundColor: account.iconColor || '#d4d4d8',
                        }}
                      />
                    )}

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
                onPress={handleCreateAccount}
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

      {/* Create Account Modal */}
      <CreateAccountModal
        visible={showCreateAccountModal}
        onClose={() => setShowCreateAccountModal(false)}
      />
    </>
  );
}