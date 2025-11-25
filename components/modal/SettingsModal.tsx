import { router } from 'expo-router';
import { LogOut, X } from 'lucide-react-native';
import React from 'react';
import { Alert, Modal, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../core/contexts/AuthContext';

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function SettingsModal({ visible, onClose }: SettingsModalProps) {
  const { logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Log out',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Log out',
          style: 'destructive',
          onPress: async () => {
            await logout();
            onClose();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-white rounded-t-3xl" style={{ height: '35%' }}>
          {/* Header */}
          <View className="flex-row items-center justify-between px-6 pt-10 pb-8">
            <Text className="text-2xl font-geist-semibold text-zinc-950">
              Settings
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
          <View className="flex-1 px-6">
            {/* Log out */}
            <TouchableOpacity
              onPress={handleLogout}
              className="flex-row items-center py-3"
              activeOpacity={0.7}
            >
              <LogOut size={20} color="#ef4444" strokeWidth={2} />
              <Text className="text-lg font-geist-semibold text-red-500 ml-2.5">
                Log out
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}