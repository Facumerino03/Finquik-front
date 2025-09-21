import { ArrowBigDown, ArrowBigUp } from 'lucide-react-native';
import React from 'react';
import { Text, View } from 'react-native';

interface EmptyStateProps {
  type: 'all' | 'incomes' | 'expenses';
}

const EmptyState: React.FC<EmptyStateProps> = ({ type }) => {
  const getContent = () => {
    switch (type) {
      case 'all':
        return {
          title: 'No transactions found',
          description: 'Start by adding your first transaction to track your finances',
          icons: (
            <View className="flex-row">
              <View className="w-16 h-16 bg-red-200 rounded-full items-center justify-center">
                <ArrowBigUp size={24} color="#fb2c36" />
              </View>
              <View className="w-16 h-16 bg-green-200 rounded-full items-center justify-center ml-2">
                <ArrowBigDown size={24} color="#00c950" />
              </View>
            </View>
          )
        };
      case 'incomes':
        return {
          title: 'No incomes found',
          description: 'Add your first income to start tracking your earnings',
          icons: (
            <View className="w-16 h-16 bg-green-200 rounded-full items-center justify-center">
              <ArrowBigDown size={24} color="#00c950" />
            </View>
          )
        };
      case 'expenses':
        return {
          title: 'No expenses found',
          description: 'Add your first expense to start tracking your spending',
          icons: (
            <View className="w-16 h-16 bg-red-200 rounded-full items-center justify-center">
              <ArrowBigUp size={24} color="#fb2c36" />
            </View>
          )
        };
    }
  };

  const content = getContent();

  return (
    <View className="items-center justify-center py-16 px-8">
      {content.icons}
      <Text className="text-zinc-950 text-xl font-geist-semibold mt-6 text-center">
        {content.title}
      </Text>
      <Text className="text-zinc-500 text-base font-geist mt-2 text-center">
        {content.description}
      </Text>
    </View>
  );
};

export default EmptyState;
