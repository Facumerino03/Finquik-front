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

const CURRENCIES = [
  { value: 'USD', label: 'USD - US Dollar' },
  { value: 'ARS', label: 'ARS - Argentine Peso' },
  { value: 'EUR', label: 'EUR - Euro' },
];

const PRESET_COLORS = [
  '#fb2c36', // Red
  '#00c950', // Green
  '#007AFF', // Blue
  '#FF9500', // Orange
  '#AF52DE', // Purple
  '#FF2D55', // Pink
  '#5856D6', // Indigo
  '#34C759', // Green 2
  '#FF3B30', // Red 2
  '#FFCC00', // Yellow
  '#71717a', // Gray
  '#09090b', // Black
];

export default function CreateAccountModal({ visible, onClose }: CreateAccountModalProps) {
  const { createAccount, isCreating } = useAccountsManager();

  const [name, setName] = useState('');
  const [selectedType, setSelectedType] = useState('BANK_ACCOUNT');
  const [balance, setBalance] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [selectedColor, setSelectedColor] = useState('#007AFF');

  const resetForm = () => {
    setName('');
    setSelectedType('BANK_ACCOUNT');
    setBalance('');
    setSelectedCurrency('USD');
    setSelectedColor('#007AFF');
  };

  const handleClose = () => {
    if (!isCreating) {
      resetForm();
      onClose();
    }
  };

  const handleCreate = async () => {
    // Validaciones
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
      initialBalance: parseFloat(balance), // Cambiado de currentBalance a initialBalance
      currency: selectedCurrency,
      iconColor: selectedColor,
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
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View className="flex-1 bg-white">
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 pt-5 pb-4 border-b border-zinc-200">
          <Text className="text-2xl font-geist-semibold text-zinc-950">
            New Account
          </Text>
          <TouchableOpacity
            onPress={handleClose}
            className="p-2"
            activeOpacity={0.7}
            disabled={isCreating}
          >
            <X size={24} color="#71717a" />
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 px-5 pt-6" showsVerticalScrollIndicator={false}>
          {/* Account Name */}
          <View className="mb-6">
            <Text className="text-base font-geist-medium text-zinc-950 mb-2">
              Account Name
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="e.g., Main Checking"
              placeholderTextColor="#a1a1aa"
              className="bg-zinc-50 rounded-xl px-4 py-3.5 text-base font-geist text-zinc-950"
              editable={!isCreating}
            />
          </View>

          {/* Account Type */}
          <View className="mb-6">
            <Text className="text-base font-geist-medium text-zinc-950 mb-2">
              Account Type
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {ACCOUNT_TYPES.map((type) => (
                <TouchableOpacity
                  key={type.value}
                  onPress={() => setSelectedType(type.value)}
                  className={`px-4 py-2.5 rounded-xl ${
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
            <Text className="text-base font-geist-medium text-zinc-950 mb-2">
              Initial Balance
            </Text>
            <TextInput
              value={balance}
              onChangeText={setBalance}
              placeholder="0.00"
              placeholderTextColor="#a1a1aa"
              keyboardType="decimal-pad"
              className="bg-zinc-50 rounded-xl px-4 py-3.5 text-base font-geist text-zinc-950"
              editable={!isCreating}
            />
          </View>

          {/* Currency */}
          <View className="mb-6">
            <Text className="text-base font-geist-medium text-zinc-950 mb-2">
              Currency
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {CURRENCIES.map((currency) => (
                <TouchableOpacity
                  key={currency.value}
                  onPress={() => setSelectedCurrency(currency.value)}
                  className={`px-4 py-2.5 rounded-xl ${
                    selectedCurrency === currency.value
                      ? 'bg-zinc-950'
                      : 'bg-zinc-50'
                  }`}
                  activeOpacity={0.7}
                  disabled={isCreating}
                >
                  <Text
                    className={`text-sm font-geist-medium ${
                      selectedCurrency === currency.value
                        ? 'text-white'
                        : 'text-zinc-950'
                    }`}
                  >
                    {currency.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Color Picker */}
          <View className="mb-6">
            <Text className="text-base font-geist-medium text-zinc-950 mb-2">
              Account Color
            </Text>
            <View className="flex-row flex-wrap gap-3">
              {PRESET_COLORS.map((color) => (
                <TouchableOpacity
                  key={color}
                  onPress={() => setSelectedColor(color)}
                  className="items-center justify-center"
                  activeOpacity={0.7}
                  disabled={isCreating}
                >
                  <View
                    className="rounded-full"
                    style={{
                      width: 48,
                      height: 48,
                      backgroundColor: color,
                      borderWidth: selectedColor === color ? 3 : 0,
                      borderColor: '#09090b',
                    }}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Create Button */}
        <View className="px-5 pb-8 pt-4 border-t border-zinc-200">
          <TouchableOpacity
            onPress={handleCreate}
            className="bg-zinc-950 rounded-2xl py-4 items-center justify-center"
            activeOpacity={0.7}
            disabled={isCreating}
          >
            {isCreating ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text className="text-white text-base font-geist-semibold">
                Create Account
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}