import { useLocalSearchParams } from 'expo-router';
import { CheckCircle } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import PasswordStrengthIndicator from '../../components/common/PasswordStrengthIndicator';
import { usePasswordReset } from '../../core/hooks/usePasswordReset';

export default function ResetPasswordScreen() {
  const params = useLocalSearchParams<{ token?: string }>();
  const [token, setToken] = useState<string>('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const { confirmReset, isLoading, error } = usePasswordReset();

  useEffect(() => {
    if (params.token) {
      if (Array.isArray(params.token)) {
        setToken(params.token[0]);
      } else {
        setToken(params.token);
      }
    }
  }, [params]);

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      if (Platform.OS === 'web') {
        alert('Please fill in all fields');
      } else {
        Alert.alert('Error', 'Please fill in all fields');
      }
      return;
    }

    if (newPassword !== confirmPassword) {
      if (Platform.OS === 'web') {
        alert('Passwords do not match');
      } else {
        Alert.alert('Error', 'Passwords do not match');
      }
      return;
    }

    if (newPassword.length < 8) {
      if (Platform.OS === 'web') {
        alert('Password must be at least 8 characters long');
      } else {
        Alert.alert('Error', 'Password must be at least 8 characters long');
      }
      return;
    }

    if (!token) {
      if (Platform.OS === 'web') {
        alert('Invalid reset link. Please request a new password reset.');
      } else {
        Alert.alert('Error', 'Invalid reset link. Please request a new password reset.');
      }
      return;
    }

    try {
      const success = await confirmReset(token, newPassword);
      
      if (success) {
        setShowSuccess(true);
      }
    } catch (err) {
      console.error('Error in handleResetPassword:', err);
    }
  };

  if (showSuccess) {
    return (
      <View className="flex-1 bg-white px-6 justify-center items-center">
        <View className="items-center">
          <View className="w-24 h-24 bg-green-100 rounded-full items-center justify-center mb-6">
            <CheckCircle size={48} color="#22c55e" />
          </View>
          
          <Text className="text-3xl text-center mb-4 text-zinc-950 font-geist-bold">
            Password updated!
          </Text>
          
          <Text className="text-zinc-500 text-center text-base font-geist mb-8 px-4">
            Your password has been successfully updated. You can now close this window and sign in with your new password in the app.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white px-6 justify-center">
      <View className="mb-12">
        <Text className="text-4xl text-center mb-4 text-zinc-950 font-geist-bold">
          Reset password
        </Text>
        <Text className="text-zinc-500 text-center text-base font-geist mb-2">
          Enter your new password below.
        </Text>
      </View>

      <View className="space-y-6">
        <View>
          <Text className="text-zinc-950 mb-2 font-geist-medium">New password</Text>
          <TextInput
            className="border border-zinc-200 rounded-lg px-4 py-4 text-base bg-white text-zinc-500"
            placeholder="Enter your new password"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            autoCapitalize="none"
            placeholderTextColor="#9CA3AF"
            style={{ fontFamily: 'Geist_400Regular', fontSize: 16 }}
          />
          <PasswordStrengthIndicator password={newPassword} />
        </View>

        <View>
          <Text className="text-zinc-950 mb-2 font-geist-medium">Confirm password</Text>
          <TextInput
            className="border border-zinc-200 rounded-lg px-4 py-4 text-base bg-white text-zinc-500 mb-10"
            placeholder="Confirm your new password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            autoCapitalize="none"
            placeholderTextColor="#9CA3AF"
            style={{ fontFamily: 'Geist_400Regular', fontSize: 16 }}
          />
        </View>

        {error && (
          <View className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            <Text className="text-red-600 text-sm font-geist">{error}</Text>
          </View>
        )}

        <TouchableOpacity
          className={`bg-zinc-900 rounded-lg py-4 ${isLoading ? 'opacity-50' : ''}`}
          onPress={handleResetPassword}
          disabled={isLoading}
        >
          <Text className="text-white text-center text-lg font-geist-medium">
            {isLoading ? 'Resetting...' : 'Save new password'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}