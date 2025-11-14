import { X } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useAccountsManager } from '../core/hooks/useAccountsManager';
import { CreateAccountPayload } from '../core/types/transactions';
import CategoryIcon from './CategoryIcon';
import IconPicker from './IconPicker';

interface CreateAccountModalProps {
  visible: boolean;
  onClose: () => void;
}

const ACCOUNT_TYPES = [
  { value: 'BANK_ACCOUNT', label: 'Bank Account' },
  { value: 'CREDIT_CARD', label: 'Credit Card' },
  { value: 'CASH', label: 'Cash' },
  { value: 'SAVINGS', label: 'Savings' },
  { value: 'INVESTMENT', label: 'Investment' },
];

export default function CreateAccountModal({ visible, onClose }: CreateAccountModalProps) {
  const { createAccount, isCreating } = useAccountsManager();

  const [name, setName] = useState('');
  const [selectedType, setSelectedType] = useState('BANK_ACCOUNT');
  const [balance, setBalance] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [showIconPicker, setShowIconPicker] = useState(false);

  const resetForm = () => {
    setName('');
    setSelectedType('BANK_ACCOUNT');
    setBalance('');
    setSelectedIcon(null);
    setSelectedColor(null);
  };

  const handleClose = () => {
    if (!isCreating) {
      resetForm();
      onClose();
    }
  };

  const handleSelectIcon = (iconName: string, color: string) => {
    setSelectedIcon(iconName);
    setSelectedColor(color);
  };

  const handleCreate = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter an account name');
      return;
    }

    if (!balance.trim() || isNaN(parseFloat(balance))) {
      Alert.alert('Error', 'Please enter a valid balance');
      return;
    }

    const accountData: CreateAccountPayload = {
      name: name.trim(),
      type: selectedType,
      initialBalance: parseFloat(balance),
      currency: 'USD', // Fijo en USD
      iconName: selectedIcon || undefined,
      iconColor: selectedColor || undefined,
    };

    try {
      await createAccount(accountData);
      Alert.alert('Success', 'Account created successfully');
      resetForm();
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to create account. Please try again.');
    }
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
          <View className="bg-white rounded-t-3xl" style={{ height: '70%' }}>
            {/* Header */}
            <View className="flex-row items-center justify-between px-6 pt-10 pb-5">
              <Text className="text-2xl font-geist-semibold text-zinc-950">
                Create Account
              </Text>
              <TouchableOpacity
                onPress={handleClose}
                className="w-8 h-8 items-center justify-center"
                activeOpacity={0.7}
                disabled={isCreating}
              >
                <X size={24} color="#09090b" />
              </TouchableOpacity>
            </View>

            {/* Content */}
            <ScrollView 
              className="flex-1 px-6"
              showsVerticalScrollIndicator={false}
            >
              {/* Icon Selector */}
              <View className="mb-6">
                <Text className="text-sm font-geist text-zinc-500 mb-2">
                  Icon & Color
                </Text>
                <TouchableOpacity
                  onPress={() => setShowIconPicker(true)}
                  className="bg-zinc-50 rounded-2xl px-4 py-4 flex-row items-center justify-between"
                  activeOpacity={0.7}
                  disabled={isCreating}
                >
                  <View className="flex-row items-center">
                    {selectedIcon && selectedColor ? (
                      <>
                        <View 
                          className="w-14 h-14 rounded-full items-center justify-center mr-4"
                          style={{ 
                            backgroundColor: `${selectedColor}20` // 20 es opacidad en hex
                          }}
                        >
                          <CategoryIcon
                            iconName={selectedIcon}
                            size={24}
                            color={selectedColor}
                          />
                        </View>
                        <Text className="text-base font-geist text-zinc-950">
                          {selectedIcon}
                        </Text>
                      </>
                    ) : (
                      <Text className="text-base font-geist text-zinc-500">
                        Select icon and color
                      </Text>
                    )}
                  </View>
                  <Text className="text-base font-geist text-zinc-400">›</Text>
                </TouchableOpacity>
              </View>

              {/* Account Name */}
              <View className="mb-6">
                <Text className="text-sm font-geist text-zinc-500 mb-2">
                  Account Name
                </Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="e.g., Main Checking"
                  placeholderTextColor="#a1a1aa"
                  className="bg-zinc-50 rounded-2xl px-4 py-4 text-base font-geist text-zinc-950"
                  editable={!isCreating}
                />
              </View>

              {/* Account Type */}
              <View className="mb-6">
                <Text className="text-sm font-geist text-zinc-500 mb-2">
                  Account Type
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {ACCOUNT_TYPES.map((type) => (
                    <TouchableOpacity
                      key={type.value}
                      onPress={() => setSelectedType(type.value)}
                      className={`px-4 py-3 rounded-xl ${
                        selectedType === type.value
                          ? 'bg-zinc-950'
                          : 'bg-zinc-50'
                      }`}
                      activeOpacity={0.7}
                      disabled={isCreating}
                    >
                      <Text
                        className={`text-sm font-geist-medium ${
                          selectedType === type.value
                            ? 'text-white'
                            : 'text-zinc-950'
                        }`}
                      >
                        {type.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Initial Balance */}
              <View className="mb-6">
                <Text className="text-sm font-geist text-zinc-500 mb-2">
                  Initial Balance
                </Text>
                <View className="bg-zinc-50 rounded-2xl px-4 py-4 flex-row items-center">
                  <Text className="text-base font-geist text-zinc-500 mr-2">$</Text>
                  <TextInput
                    value={balance}
                    onChangeText={setBalance}
                    placeholder="0.00"
                    placeholderTextColor="#a1a1aa"
                    keyboardType="decimal-pad"
                    className="flex-1 text-base font-geist text-zinc-950"
                    editable={!isCreating}
                  />
                  <Text className="text-sm font-geist text-zinc-500">USD</Text>
                </View>
              </View>
            </ScrollView>

            {/* Create Button */}
            <View className="px-6 pb-8 pt-4">
              <TouchableOpacity
                onPress={handleCreate}
                disabled={isCreating || !name.trim() || !balance.trim()}
                className={`py-4 rounded-xl ${
                  isCreating || !name.trim() || !balance.trim()
                    ? 'bg-zinc-300'
                    : 'bg-zinc-950'
                }`}
                activeOpacity={0.7}
              >
                {isCreating ? (
                  <View className="flex-row items-center justify-center">
                    <ActivityIndicator size="small" color="#FFFFFF" />
                    <Text className="ml-2 text-lg font-geist-semibold text-white">
                      Creating...
                    </Text>
                  </View>
                ) : (
                  <Text className="text-lg font-geist-semibold text-white text-center">
                    Create Account
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