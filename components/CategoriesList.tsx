import React from 'react';
import { Text, View } from 'react-native';
import CategoryIcon from './CategoryIcon';

interface CategoryData {
  category: {
    id: number;
    name: string;
    type: 'INCOME' | 'EXPENSE';
    iconName?: string | null;
    iconColor?: string | null;
  };
  amount: number;
  transactionCount: number;
}

interface CategoriesListProps {
  categories: CategoryData[];
  totalAmount: number;
  type: 'INCOME' | 'EXPENSE';
  showTitle?: boolean;
}

const CategoriesList: React.FC<CategoriesListProps> = ({
  categories,
  totalAmount,
  type,
  showTitle = true,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(amount));
  };

  const calculatePercentage = (amount: number) => {
    if (totalAmount === 0) return '0.00%';
    const percentage = (amount / totalAmount) * 100;
    return `${percentage.toFixed(2)}%`;
  };

  const CategoryItem = ({ categoryData, index }: { categoryData: CategoryData; index: number }) => {
    return (
      <View 
        key={categoryData.category.id}
        className="flex-row items-center justify-between"
        style={{ marginBottom: index === categories.length - 1 ? 0 : 15 }}
      >
        {/* Left side: Icon and Category Name/Transaction Count */}
        <View className="flex-row items-center flex-1">
          <CategoryIcon
            iconName={categoryData.category.iconName}
            iconColor={categoryData.category.iconColor}
            size={20}
            containerSize={50}
          />
          <View className="ml-4 flex-1">
            <Text className="text-zinc-950 text-lg font-geist-medium">
              {categoryData.category.name}
            </Text>
            <Text className="text-zinc-500 text-base font-geist">
              {categoryData.transactionCount} {categoryData.transactionCount === 1 ? 'transaction' : 'transactions'}
            </Text>
          </View>
        </View>

        {/* Right side: Amount and Percentage */}
        <View className="items-end">
          <Text className="text-lg font-geist-bold text-zinc-950">
            {formatCurrency(categoryData.amount)}
          </Text>
          <Text className="text-base font-geist text-zinc-500">
            {calculatePercentage(categoryData.amount)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View className="bg-white px-5">
      {/* Header */}
      {showTitle && (
        <View 
          className="flex-row justify-between items-center"
          style={{ marginBottom: 24 }}
        >
          <Text className="text-zinc-950 text-2xl font-geist-semibold">
            Categories
          </Text>
        </View>
      )}

      {/* Categories List */}
      <View>
        {categories.length === 0 ? (
          <View className="items-center justify-center py-16 px-8">
            <Text className="text-zinc-950 text-xl font-geist-semibold text-center">
              No categories found
            </Text>
            <Text className="text-zinc-500 text-base font-geist mt-2 text-center">
              Add transactions to see your categories breakdown
            </Text>
          </View>
        ) : (
          categories.map((categoryData, index) => (
            <CategoryItem 
              key={categoryData.category.id}
              categoryData={categoryData} 
              index={index} 
            />
          ))
        )}
      </View>
    </View>
  );
};

export default CategoriesList;