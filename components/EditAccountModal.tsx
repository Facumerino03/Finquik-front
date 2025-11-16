import { Banknote, Building2, CreditCard, Trash2, TrendingUp, Wallet, X } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useAccountsManager } from '../core/hooks/useAccountsManager';
import { Account, UpdateAccountPayload } from '../core/types/transactions';
import CategoryIcon from './CategoryIcon';
import IconPicker from './IconPicker';

interface EditAccountModalProps {
  visible: boolean;
  account: Account;
  onClose: () => void;
}

const ACCOUNT_TYPES = [
  { 
    value: 'CASH', 
    label: 'Cash',
    icon: 'Banknote',
    color: '#22c55e',
    bg: '#dcfce7'
  },
  { 
    value: 'BANK_ACCOUNT', 
    label: 'Bank account',
    icon: 'Building2',
    color: '#3b82f6',
    bg: '#dbeafe'
  },
  { 
    value: 'CREDIT_CARD', 
    label: 'Credit card',
    icon: 'CreditCard',
    color: '#f97316',
    bg: '#ffedd5'
  },
  { 
    value: 'SAVINGS', 
    label: 'Savings',
    icon: 'Wallet',
    color: '#8b5cf6',
    bg: '#ede9fe'
  },
  { 
    value: 'INVESTMENT', 
    label: 'Investment',
    icon: 'TrendingUp',
    color: '#a855f7',
    bg: '#f3e8ff'
  },
];

const getAccountTypeIcon = (iconName: string) => {
  switch (iconName) {
    case 'Banknote':
      return Banknote;
    case 'Building2':
      return Building2;
    case 'CreditCard':
      return CreditCard;
    case 'Wallet':
      return Wallet;
    case 'TrendingUp':
      return TrendingUp;
    default:
      return Wallet;
  }
};

export default function EditAccountModal({ visible, account, onClose }: EditAccountModalProps) {
  const { updateAccount, deleteAccount, isUpdating, isDeleting } = useAccountsManager();

  const [name, setName] = useState(account.name);
  const [selectedType, setSelectedType] = useState(account.type);
  const [selectedIcon, setSelectedIcon] = useState<string | null>(account.iconName || null);
  const [selectedColor, setSelectedColor] = useState<string | null>(account.iconColor || null);
  const [showIconPicker, setShowIconPicker] = useState(false);

  const isLoading = isUpdating || isDeleting;

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  const handleSelectIcon = (iconName: string, color: string) => {
    setSelectedIcon(iconName);
    setSelectedColor(color);
  };

  const handleUpdate = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter an account name');
      return;
    }

    const accountData: UpdateAccountPayload = {
      name: name.trim(),
      type: selectedType,
      initialBalance: account.currentBalance,
      currentBalance: account.currentBalance,
      currency: account.currency,
      iconName: selectedIcon || undefined,
      iconColor: selectedColor || undefined,
    };

    try {
      await updateAccount(account.id, accountData);
      Alert.alert('Success', 'Account updated successfully');
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to update account. Please try again.');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Account',
      `Are you sure you want to delete "${account.name}"? This will also delete all associated transactions.`,
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
              await deleteAccount(account.id);
              Alert.alert('Success', 'Account deleted successfully');
              onClose();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete account. Please try again.');
            }
          },
        },
      ]
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: account.currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <>
      <Modal
        visible={visible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleClose}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl" style={{ height: '80%' }}>
            {/* Header */}
            <View className="flex-row items-center justify-between px-6 pt-10 pb-8">
              <Text className="text-2xl font-geist-semibold text-zinc-950">
                Edit account
              </Text>
              <TouchableOpacity
                onPress={handleClose}
                className="w-8 h-8 items-center justify-center"
                activeOpacity={0.7}
                disabled={isLoading}
              >
                <X size={24} color="#09090b" />
              </TouchableOpacity>
            </View>

            {/* Content */}
            <ScrollView 
              className="flex-1 px-6"
              showsVerticalScrollIndicator={false}
            >
              {/* Icon Display - Grande y centrado */}
              <View className="items-center mb-8">
                <TouchableOpacity
                  onPress={() => setShowIconPicker(true)}
                  activeOpacity={0.7}
                  disabled={isLoading}
                >
                  {selectedIcon && selectedColor ? (
                    <CategoryIcon
                      iconName={selectedIcon}
                      iconColor={selectedColor}
                      size={28}
                      containerSize={76}
                    />
                  ) : (
                    <View className="w-20 h-20 rounded-full bg-zinc-100 items-center justify-center border-2 border-dashed border-zinc-300">
                      <Text className="text-3xl">+</Text>
                    </View>
                  )}
                </TouchableOpacity>
                <Text className="text-sm font-geist text-zinc-500 mt-3">
                  Tap to {selectedIcon ? 'change' : 'select'} icon
                </Text>
              </View>

              {/* Account Name */}
              <View className="mb-8">
                <Text className="text-sm font-geist-medium text-zinc-950 mb-2">
                  Account name
                </Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter account name"
                  placeholderTextColor="#a1a1aa"
                  className="bg-white border border-zinc-200 rounded-lg px-4 py-4 text-base font-geist text-zinc-950"
                  editable={!isLoading}
                />
              </View>

              {/* Account Type */}
              <View className="mb-8">
                <Text className="text-sm font-geist-medium text-zinc-950 mb-2">
                  Account type
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {ACCOUNT_TYPES.map((type) => {
                    const IconComponent = getAccountTypeIcon(type.icon);
                    const isSelected = selectedType === type.value;
                    
                    return (
                      <TouchableOpacity
                        key={type.value}
                        onPress={() => setSelectedType(type.value)}
                        className="flex-row items-center rounded-full"
                        style={{
                          backgroundColor: isSelected ? type.bg : '#ffffff',
                          borderWidth: 1,
                          borderColor: isSelected ? type.color : '#e4e4e7',
                          paddingLeft: 4,
                          paddingRight: 12,
                          paddingVertical: 4,
                        }}
                        activeOpacity={0.7}
                        disabled={isLoading}
                      >
                        <View
                          className="w-9 h-9 rounded-full items-center justify-center"
                          style={{
                            backgroundColor: isSelected ? type.color : type.bg,
                          }}
                        >
                          <IconComponent
                            size={15}
                            color={isSelected ? type.bg : type.color}
                            strokeWidth={2}
                          />
                        </View>
                        <Text className="text-sm font-geist-medium text-zinc-600 ml-2">
                          {type.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Current Balance (Read Only) */}
              <View className="mb-8">
                <Text className="text-sm font-geist-medium text-zinc-950 mb-2">
                  Current balance
                </Text>
                <View className="bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-4 flex-row items-center">
                  <Text className="text-base font-geist-medium text-zinc-500 mr-2">$</Text>
                  <Text className="flex-1 text-base font-geist-medium text-zinc-950">
                    {formatCurrency(account.currentBalance).replace('$', '')}
                  </Text>
                  <Image
                    source={require('../shared/assets/icons/us.png')}
                    style={{ width: 24, height: 24, marginLeft: 8 }}
                    resizeMode="contain"
                  />
                </View>
              </View>
            </ScrollView>

            {/* Save and Delete Buttons */}
            <View className="px-6 pb-8 pt-4 flex-row gap-3">
              {/* Delete Button */}
              <TouchableOpacity
                onPress={handleDelete}
                disabled={isLoading}
                className={`w-14 h-14 rounded-full items-center justify-center ${
                  isLoading ? 'bg-red-200' : 'bg-red-500'
                }`}
                activeOpacity={0.7}
              >
                {isDeleting ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Trash2 size={22} color="#FFFFFF" strokeWidth={2} />
                )}
              </TouchableOpacity>

              {/* Save Button */}
              <TouchableOpacity
                onPress={handleUpdate}
                disabled={isLoading || !name.trim()}
                className={`flex-1 py-4 rounded-lg ${
                  isLoading || !name.trim()
                    ? 'bg-zinc-300'
                    : 'bg-zinc-950'
                }`}
                activeOpacity={0.7}
              >
                {isUpdating ? (
                  <View className="flex-row items-center justify-center">
                    <ActivityIndicator size="small" color="#FFFFFF" />
                    <Text className="ml-2 text-lg font-geist-semibold text-white">
                      Saving...
                    </Text>
                  </View>
                ) : (
                  <Text className="text-lg font-geist-semibold text-white text-center">
                    Save changes
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Icon Picker Modal */}
      <IconPicker
        visible={showIconPicker}
        onClose={() => setShowIconPicker(false)}
        onSelectIcon={handleSelectIcon}
        selectedIcon={selectedIcon}
        selectedColor={selectedColor}
      />
    </>
  );
}