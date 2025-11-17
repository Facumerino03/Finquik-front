import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View, Platform } from 'react-native';
import { usePasswordReset } from '../../core/hooks/usePasswordReset';
import { CheckCircle } from 'lucide-react-native';

export default function ResetPasswordScreen() {
  const params = useLocalSearchParams<{ token?: string }>();
  const [token, setToken] = useState<string>('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const { confirmReset, isLoading, error } = usePasswordReset();

  useEffect(() => {
    console.log('Reset Password Screen - Params:', params);
    console.log('Token from params:', params.token);
    
    if (params.token) {
      if (Array.isArray(params.token)) {
        setToken(params.token[0]);
      } else {
        setToken(params.token);
      }
    }
  }, [params]);

  const handleResetPassword = async () => {
    console.log('Starting password reset...');
    console.log('Token:', token);
    console.log('New password length:', newPassword.length);
    
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
      console.log('Calling confirmReset with token:', token);
      const success = await confirmReset(token, newPassword);
      console.log('Reset result:', success);
      
      if (success) {
        setShowSuccess(true);
        // Redirigir después de 3 segundos
        setTimeout(() => {
          router.replace('/(auth)/login');
        }, 3000);
      }
    } catch (err) {
      console.error('Error in handleResetPassword:', err);
    }
  };

  // Pantalla de éxito
  if (showSuccess) {
    return (
      <View className="flex-1 bg-white px-6 justify-center items-center">
        <View className="items-center">
          <View className="w-24 h-24 bg-green-100 rounded-full items-center justify-center mb-6">
            <CheckCircle size={48} color="#00c950" />
          </View>
          
          <Text className="text-3xl text-center mb-4 text-zinc-950 font-geist-bold">
            Password updated!
          </Text>
          
          <Text className="text-zinc-500 text-center text-base font-geist mb-8">
            Your password has been successfully updated. You can now sign in with your new password.
          </Text>
          
          <TouchableOpacity
            onPress={() => router.replace('/(auth)/login')}
            className="bg-zinc-900 rounded-lg py-4 px-8"
            activeOpacity={0.7}
          >
            <Text className="text-white text-center text-lg font-geist-medium">
              Go to Login
            </Text>
          </TouchableOpacity>
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
        
        {/* Debug: Mostrar si hay token (puedes quitarlo después) */}
        {__DEV__ && (
          <Text className="text-xs text-zinc-400 text-center mt-2">
            Token: {token ? 'Present' : 'Missing'}
          </Text>
        )}
      </View>

      <View className="space-y-6">
        <View>
          <Text className="text-zinc-950 mb-2 font-geist-medium">New password</Text>
          <TextInput
            className="border border-zinc-200 rounded-lg px-4 py-4 text-base bg-white text-zinc-500 mb-4"
            placeholder="Enter your new password"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            autoCapitalize="none"
            placeholderTextColor="#9CA3AF"
            style={{ fontFamily: 'Geist_400Regular', fontSize: 16 }}
          />
        </View>

        <View>
          <Text className="text-zinc-950 mb-2 font-geist-medium">Confirm password</Text>
          <TextInput
            className="border border-zinc-200 rounded-lg px-4 py-4 text-base bg-white text-zinc-500 mb-4"
            placeholder="Confirm your new password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            autoCapitalize="none"
            placeholderTextColor="#9CA3AF"
            style={{ fontFamily: 'Geist_400Regular', fontSize: 16 }}
          />
        </View>

        {/* Mostrar error si existe */}
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

        <TouchableOpacity
          onPress={() => router.replace('/(auth)/login')}
          className="py-2"
          activeOpacity={0.7}
        >
          <Text className="text-zinc-950 text-center text-base font-geist-medium">
            Back to login
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}