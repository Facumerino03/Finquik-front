import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OnboardingScreen() {
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  
  const words = [
    { text: 'incomes', color: 'text-green-500', bg: 'bg-green-50' },
    { text: 'expenses', color: 'text-red-500', bg: 'bg-red-50' },
    { text: 'accounts', color: 'text-blue-500', bg: 'bg-blue-50' }
  ];

  useEffect(() => {
    const currentWord = words[wordIndex].text;
    
    const timeout = setTimeout(() => {
      if (!isDeleting && text === currentWord) {
        // Palabra completa, esperar y empezar a borrar
        setTimeout(() => setIsDeleting(true), 1500);
      } else if (isDeleting && text === '') {
        // Palabra borrada, cambiar a la siguiente
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % words.length);
      } else if (isDeleting) {
        // Borrando
        setText(currentWord.substring(0, text.length - 1));
      } else {
        // Escribiendo
        setText(currentWord.substring(0, text.length + 1));
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [text, isDeleting, wordIndex]);

  const handleGetStarted = () => {
    router.replace('/(auth)/login');
  };

  const currentWordData = words[wordIndex];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-between px-6 py-10">
        {/* Content */}
        <View className="flex-1 justify-center">
          {/* Logo */}
          <View className="mb-12">
            <Image 
              source={require('../../shared/assets/icons/finquik_logo.png')} 
              className="w-24 h-24 rounded-xl"
              resizeMode="contain"
            />
          </View>

          {/* Title */}
          <View className="mb-8">
            <View className="flex-row items-center flex-wrap">
              <Text className="text-5xl font-geist-bold text-zinc-950">
                Your{' '}
              </Text>
              <View className={`px-4 py-2 rounded-2xl ${currentWordData.bg}`}>
                <Text className={`text-5xl font-geist-bold ${currentWordData.color}`}>
                  {text}
                  <Text className="opacity-50">|</Text>
                </Text>
              </View>
            </View>
            <Text className="text-5xl font-geist-bold text-zinc-950 leading-tight">
              finally simple.
            </Text>
          </View>

          {/* Description */}
          <Text className="text-zinc-500 text-xl font-geist leading-relaxed mt-4">
            Take control of your finances with simple and intuitive tools to manage your money.
          </Text>
        </View>

        {/* Get Started Button */}
        <TouchableOpacity
          className="bg-zinc-950 rounded-lg py-4 px-6"
          onPress={handleGetStarted}
          activeOpacity={0.8}
        >
          <Text className="text-white text-center text-lg font-geist-semibold">
            Get Started
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}