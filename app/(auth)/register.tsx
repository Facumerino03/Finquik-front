import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import PasswordStrengthIndicator from '../../components/common/PasswordStrengthIndicator';
import { useAuth } from '../../core/contexts/AuthContext';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();

  const handleRegister = async () => {
    if (!name || !lastName || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);
    try {
      await register({ firstName: name, lastName, email, password });
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Error', 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white px-6 justify-center">
      <View className="mb-12">
        <Text className="text-4xl text-center mb-4 text-zinc-950 font-geist-bold">
          Create account
        </Text>
        <Text className="text-zinc-500 text-center text-base font-geist mb-2">
          Fill in your email below to register your account.
        </Text>
        <View className="flex-row justify-center mt-2">
          <Text className="text-zinc-950 font-geist">Already have an account? </Text>
          <Link href="/(auth)/login" asChild>
            <TouchableOpacity>
              <Text className="text-zinc-950 font-geist-semibold underline">Sign in</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>

      <View className="space-y-6">
        <View className="flex-row gap-4">
          <View className="flex-1">
            <Text className="text-zinc-950 mb-2 font-geist-medium">First name</Text>
            <TextInput
              className="border border-zinc-200 rounded-lg px-4 py-4 text-base bg-white text-zinc-500 mb-4"
              placeholder="Enter your first name"
              value={name}
              onChangeText={setName}
              placeholderTextColor="#9CA3AF"
              style={{ fontFamily: 'Geist_400Regular', fontSize: 14 }}
            />
          </View>
          <View className="flex-1">
            <Text className="text-zinc-950 mb-2 font-geist-medium">Last name</Text>
            <TextInput
              className="border border-zinc-200 rounded-lg px-4 py-4 text-base bg-white text-zinc-500 mb-4"
              placeholder="Enter your last name"
              value={lastName}
              onChangeText={setLastName}
              placeholderTextColor="#9CA3AF"
              style={{ fontFamily: 'Geist_400Regular', fontSize: 14 }}
            />
          </View>
        </View>

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
            style={{ fontFamily: 'Geist_400Regular', fontSize: 14 }}
          />
        </View>

        <View>
          <Text className="text-zinc-950 mb-2 font-geist-medium">Password</Text>
          <TextInput
            className="border border-zinc-200 rounded-lg px-4 py-4 text-base bg-white text-zinc-500"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#9CA3AF"
            style={{ fontFamily: 'Geist_400Regular', fontSize: 14 }}
          />
          <PasswordStrengthIndicator password={password} />
        </View>

        <View>
          <Text className="text-zinc-950 mb-2 font-geist-medium mt-4">Confirm password</Text>
          <TextInput
            className="border border-zinc-200 rounded-lg px-4 py-4 text-base bg-white text-zinc-500 mb-10"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            placeholderTextColor="#9CA3AF"
            style={{ fontFamily: 'Geist_400Regular', fontSize: 14 }}
          />
        </View>

        <TouchableOpacity
          className={`bg-zinc-900 rounded-lg py-4 ${isLoading ? 'opacity-50' : ''}`}
          onPress={handleRegister}
          disabled={isLoading}
        >
          <Text className="text-white text-center text-lg font-geist-medium">
            {isLoading ? 'Creating account...' : 'Create account'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}