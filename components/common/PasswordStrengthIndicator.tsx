import React from 'react';
import { View, Text } from 'react-native';

interface PasswordStrengthIndicatorProps {
  password: string;
}

interface StrengthLevel {
  score: number;
  label: string;
  color: string;
  bgColor: string;
}

export default function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  
  const calculateStrength = (password: string): StrengthLevel => {
    let score = 0;
    
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    
    if (score <= 2) {
      return {
        score: 1,
        label: 'Weak',
        color: '#fb2c36',
        bgColor: '#fb2c36'
      };
    } else if (score <= 4) {
      return {
        score: 2,
        label: 'Medium',
        color: '#ffdf20',
        bgColor: '#ffdf20'
      };
    } else {
      return {
        score: 3,
        label: 'Strong',
        color: '#05df72',
        bgColor: '#05df72'
      };
    }
  };

  const strength = password.length > 0 ? calculateStrength(password) : null;

  const renderStrengthBars = () => {
    const bars = [];
    for (let i = 1; i <= 3; i++) {
      const isActive = strength && strength.score >= i;
      const barColor = isActive ? strength.color : '#e4e4e7';
      
      bars.push(
        <View
          key={i}
          className="flex-1 h-1.5 rounded-full mx-0.5"
          style={{ backgroundColor: barColor }}
        />
      );
    }
    return bars;
  };

  if (!password) return null;

  return (
    <View className="mt-2">
      {/* Strength bar */}
      <View className="flex-row mb-2">
        {renderStrengthBars()}
      </View>
      
      {/* Descriptive text */}
      <Text className="text-sm text-zinc-500 font-geist">
        Use 8 or more characters, including letters, numbers and symbols
      </Text>
    </View>
  );
}