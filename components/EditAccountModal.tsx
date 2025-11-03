import { Trash2, X } from 'lucide-react-native';
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
import { Account, UpdateAccountPayload } from '../core/types/transactions';

interface EditAccountModalProps {
  visible: boolean;
  account: Account;
  onClose: () => void;
}

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

export default function EditAccountModal({ visible, account, onClose }: EditAccountModalProps) {
  const { updateAccount, deleteAccount, isUpdating, isDeleting } = useAccountsManager();

  const [name, setName] = useState(account.name);
  const [selectedColor, setSelectedColor] = useState(account.iconColor || '#007AFF');

  const isLoading = isUpdating || isDeleting;

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  const handleUpdate = async () => {
    // Validaciones
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter an account name');
      return;
    }

    const accountData: UpdateAccountPayload = {
      name: name.trim(),
      type: account.type,
      initialBalance: account.currentBalance, // Agregado: enviar el balance actual como initialBalance
      currentBalance: account.currentBalance,
      currency: account.currency,
      iconColor: selectedColor,
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
            Edit Account
          </Text>
          <TouchableOpacity
            onPress={handleClose}
            className="p-2"
            activeOpacity={0.7}
            disabled={isLoading}
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
              editable={!isLoading}
            />
          </View>

          {/* Account Info (Read Only) */}
          <View className="mb-6">
            <Text className="text-base font-geist-medium text-zinc-950 mb-2">
              Account Type
            </Text>
            <View className="bg-zinc-50 rounded-xl px-4 py-3.5">
              <Text className="text-base font-geist text-zinc-500">
                {account.type.replace('_', ' ')}
              </Text>
            </View>
          </View>

          <View className="mb-6">
            <Text className="text-base font-geist-medium text-zinc-950 mb-2">
              Current Balance
            </Text>
            <View className="bg-zinc-50 rounded-xl px-4 py-3.5">
              <Text className="text-base font-geist-semibold text-zinc-950">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: account.currency,
                  minimumFractionDigits: 2,
                }).format(account.currentBalance)}
              </Text>
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
                  disabled={isLoading}
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

          {/* Delete Button */}
          <View className="mb-6">
            <TouchableOpacity
              onPress={handleDelete}
              className="bg-red-50 rounded-2xl py-4 flex-row items-center justify-center"
              activeOpacity={0.7}
              disabled={isLoading}
            >
              {isDeleting ? (
                <ActivityIndicator color="#DC2626" />
              ) : (
                <>
                  <Trash2 size={20} color="#DC2626" />
                  <Text className="text-red-600 text-base font-geist-semibold ml-2">
                    Delete Account
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Save Button */}
        <View className="px-5 pb-8 pt-4 border-t border-zinc-200">
          <TouchableOpacity
            onPress={handleUpdate}
            className="bg-zinc-950 rounded-2xl py-4 items-center justify-center"
            activeOpacity={0.7}
            disabled={isLoading}
          >
            {isUpdating ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text className="text-white text-base font-geist-semibold">
                Save Changes
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}