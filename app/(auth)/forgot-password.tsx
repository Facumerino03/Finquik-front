import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { usePasswordReset } from '../../core/hooks/usePasswordReset';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const { requestReset, isLoading } = usePasswordReset();

  const handleSendResetLink = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    const success = await requestReset(email);
    
    if (success) {
      Alert.alert(
        'Check your email',
        'If an account exists with that email, you will receive a password reset link.',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    }
  };

  return (
    <View className="flex-1 bg-white px-6 justify-center">
      {/* Back Button */}
      <TouchableOpacity
        onPress={() => router.back()}
        className="absolute top-12 left-6 w-10 h-10 rounded-full bg-zinc-100 items-center justify-center"
        activeOpacity={0.7}
      >
        <ArrowLeft size={20} color="#09090b" />
      </TouchableOpacity>

      <View className="mb-10">
        <Text className="text-4xl text-center mb-4 text-zinc-950 font-geist-bold">
          Forgot password?
        </Text>
        <Text className="text-zinc-500 text-center text-base font-geist mb-2">
          Enter your email address and we'll send you a link to reset your password.
        </Text>
      </View>

      <View className="space-y-6">
        <View>
          <Text className="text-zinc-950 mb-2 font-geist-medium">Email address</Text>
          <TextInput
            className="border border-zinc-200 rounded-lg px-4 py-4 text-base bg-white text-zinc-500 mb-10"
            placeholder="Enter your email address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#9CA3AF"
            style={{ fontFamily: 'Geist_400Regular', fontSize: 16 }}
          />
        </View>

        <TouchableOpacity
          className={`bg-zinc-900 rounded-lg py-4 ${isLoading ? 'opacity-50' : ''}`}
          onPress={handleSendResetLink}
          disabled={isLoading}
        >
          <Text className="text-white text-center text-lg font-geist-medium">
            {isLoading ? 'Sending...' : 'Send reset link'}
          </Text>
        </TouchableOpacity>

        {/* Back to login - Mismo estilo que "Create one" */}
        <View className="flex-row justify-center mt-6">
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-zinc-950 font-geist-semibold underline">Back to login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}