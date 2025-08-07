import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../core/contexts/AuthContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      await login({ email, password });
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Error', 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // TODO: Implement forgot password functionality
  };

  return (
    <View className="flex-1 bg-white px-6 justify-center">
      <View className="mb-12">
        <Text className="text-4xl text-center mb-4 text-zinc-950 font-geist-bold">
          Welcome back
        </Text>
        <Text className="text-zinc-500 text-center text-base font-geist mb-2">
          Enter your email and password to sign in.
        </Text>
        <View className="flex-row justify-center mt-2">
          <Text className="text-zinc-950 font-geist">Don't have an account? </Text>
          <Link href="/(auth)/register" asChild>
            <TouchableOpacity>
              <Text className="text-zinc-950 font-geist-semibold underline">Create one</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>

      <View className="space-y-6">
        <View>
          <Text className="text-zinc-950 mb-2 font-geist-medium">Email address</Text>
          <TextInput
            className="border border-zinc-200 rounded-lg px-4 py-4 text-base bg-white text-zinc-500 mb-4"
            placeholder="Enter your email address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#9CA3AF"
            style={{ fontFamily: 'Geist_400Regular', fontSize: 16 }}
          />
        </View>

        <View>
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-zinc-950 font-geist-medium">Password</Text>
            <TouchableOpacity onPress={handleForgotPassword}>
              <Text className="text-zinc-950 font-geist-medium underline">Forgot password?</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            className="border border-zinc-200 rounded-lg px-4 py-4 text-base bg-white text-zinc-500 mb-10"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#9CA3AF"
            style={{ fontFamily: 'Geist_400Regular', fontSize: 16 }}
          />
        </View>

        <TouchableOpacity
          className={`bg-zinc-900 rounded-lg py-4 ${isLoading ? 'opacity-50' : ''}`}
          onPress={handleLogin}
          disabled={isLoading}
        >
          <Text className="text-white text-center text-lg font-geist-medium">
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}