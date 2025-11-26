import { ChevronRight } from 'lucide-react-native';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Account } from '../../core/types/transactions';
import CategoryIcon from '../categories/CategoryIcon';
import CreateAccountModal from '../modal/CreateAccountModal';
import EditAccountModal from '../modal/EditAccountModal';

interface AccountsListProps {
  accounts: Account[];
  totalBalance: number;
  onRefresh?: () => void;
}

export default function AccountsList({ accounts, totalBalance, onRefresh }: AccountsListProps) {
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const handleAccountPress = (account: Account) => {
    setSelectedAccount(account);
    setShowEditModal(true);
  };

  const AccountItem = ({ account }: { account: Account }) => (
    <TouchableOpacity
      onPress={() => handleAccountPress(account)}
      className="flex-row items-center justify-between bg-zinc-50 rounded-xl px-4 py-5 mb-3 border border-zinc-200"
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
          <View
            className="rounded-full"
            style={{
              width: 40,
              height: 40,
              backgroundColor: account.iconColor || '#71717a',
            }}
          />
        )}

        {/* Account Info */}
        <View className="ml-3 flex-1">
          <Text 
            className="text-base font-geist-semibold text-zinc-950 mb-1"
            numberOfLines={1}
          >
            {account.name}
          </Text>
          <Text className="text-sm font-geist text-zinc-500">
            {account.type.replace('_', ' ')}
          </Text>
        </View>
      </View>

      {/* Balance and Arrow */}
      <View className="flex-row items-center">
        <Text className="text-lg font-geist-bold text-zinc-950 mr-2">
          {formatCurrency(account.currentBalance)}
        </Text>
        <ChevronRight size={20} color="#71717a" />
      </View>
    </TouchableOpacity>
  );

  const handleAccountUpdated = () => {
    if (onRefresh) {
      onRefresh();
    }
  };

  const handleAccountCreated = () => {
    if (onRefresh) {
      onRefresh();
    }
  };

  return (
    <View className="bg-white px-5">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-zinc-950 text-2xl font-geist-semibold">
          Accounts
        </Text>
        
        {/* Add Account Button */}
        <TouchableOpacity
          onPress={() => setShowCreateModal(true)}
          activeOpacity={0.7}
        >
          <Text className="text-zinc-500 text-base font-geist-medium">
            Add new
          </Text>
        </TouchableOpacity>
      </View>

      {/* Accounts List */}
      <View>
        {accounts.length === 0 ? (
          <View className="items-center justify-center py-16 px-8">
            <Text className="text-zinc-950 text-xl font-geist-semibold text-center">
              No accounts yet
            </Text>
            <Text className="text-zinc-500 text-base font-geist mt-2 text-center">
              Create your first account to start tracking your finances
            </Text>
          </View>
        ) : (
          accounts.map((account) => (
            <AccountItem key={account.id} account={account} />
          ))
        )}
      </View>

      {/* Edit Account Modal */}
      {selectedAccount && (
        <EditAccountModal
          visible={showEditModal}
          account={selectedAccount}
          onClose={() => {
            setShowEditModal(false);
            setSelectedAccount(null);
            handleAccountUpdated(); 
          }}
        />
      )}

      {/* Create Account Modal */}
      <CreateAccountModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onAccountCreated={handleAccountCreated} 
      />
    </View>
  );
}