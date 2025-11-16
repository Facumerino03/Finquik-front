import { X } from 'lucide-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { createCategory } from '../core/services/categories';
import CategoryIcon from './CategoryIcon';
import IconPicker from './IconPicker';

interface CreateCategoryModalProps {
  visible: boolean;
  onClose: () => void;
  categoryType: 'INCOME' | 'EXPENSE';
  onCategoryCreated: () => void;
}

export default function CreateCategoryModal({
  visible,
  onClose,
  categoryType,
  onCategoryCreated,
}: CreateCategoryModalProps) {
  const [name, setName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const handleReset = () => {
    setName('');
    setSelectedIcon(null);
    setSelectedColor(null);
  };

  const handleClose = () => {
    if (!isCreating) {
      handleReset();
      onClose();
    }
  };

  const handleSelectIcon = (iconName: string, color: string) => {
    setSelectedIcon(iconName);
    setSelectedColor(color);
  };

  const handleCreate = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a category name');
      return;
    }

    try {
      setIsCreating(true);
      await createCategory({
        name: name.trim(),
        type: categoryType,
        iconName: selectedIcon || undefined,
        iconColor: selectedColor || undefined,
      });

      Alert.alert('Success', 'Category created successfully');
      handleReset();
      onCategoryCreated();
      onClose();
    } catch (error) {
      console.error('Error creating category:', error);
      Alert.alert('Error', 'Failed to create category');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <>
      <Modal
        visible={visible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleClose}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl" style={{ height: '65%' }}>
            {/* Header */}
            <View className="flex-row items-center justify-between px-6 pt-10 pb-8">
              <Text className="text-2xl font-geist-semibold text-zinc-950">
                Create category
              </Text>
              <TouchableOpacity
                onPress={handleClose}
                className="w-8 h-8 items-center justify-center"
                activeOpacity={0.7}
                disabled={isCreating}
              >
                <X size={24} color="#09090b" />
              </TouchableOpacity>
            </View>

            {/* Content */}
            <ScrollView 
              className="flex-1 px-6"
              showsVerticalScrollIndicator={false}
            >
              {/* Icon Display - Grande y centrado */}
              <View className="items-center mb-8">
                <TouchableOpacity
                  onPress={() => setShowIconPicker(true)}
                  activeOpacity={0.7}
                  disabled={isCreating}
                >
                  {selectedIcon && selectedColor ? (
                    <CategoryIcon
                      iconName={selectedIcon}
                      iconColor={selectedColor}
                      size={28}
                      containerSize={76}
                    />
                  ) : (
                    <View className="w-20 h-20 rounded-full bg-zinc-100 items-center justify-center border-2 border-dashed border-zinc-300">
                      <Text className="text-3xl">+</Text>
                    </View>
                  )}
                </TouchableOpacity>
                <Text className="text-sm font-geist text-zinc-500 mt-3">
                  Tap to {selectedIcon ? 'change' : 'select'} icon
                </Text>
              </View>

              {/* Category Name */}
              <View className="mb-8">
                <Text className="text-sm font-geist-medium text-zinc-950 mb-2">
                  Category name
                </Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter category name"
                  placeholderTextColor="#a1a1aa"
                  className="bg-white border border-zinc-200 rounded-lg px-4 py-4 text-base font-geist text-zinc-950"
                  editable={!isCreating}
                  autoFocus
                />
              </View>

              {/* Category Type (Read Only) */}
              <View className="mb-8">
                <Text className="text-sm font-geist-medium text-zinc-950 mb-2">
                  Category type
                </Text>
                <View 
                  className={`self-start px-4 py-3 rounded-full ${
                    categoryType === 'INCOME' ? 'bg-green-100' : 'bg-red-100'
                  }`}
                >
                  <Text 
                    className={`text-sm font-geist-medium ${
                      categoryType === 'INCOME' ? 'text-green-700' : 'text-red-700'
                    }`}
                  >
                    {categoryType === 'INCOME' ? 'Income' : 'Expense'}
                  </Text>
                </View>
              </View>
            </ScrollView>

            {/* Create Button */}
            <View className="px-6 pb-8 pt-4">
              <TouchableOpacity
                onPress={handleCreate}
                disabled={isCreating || !name.trim()}
                className={`py-4 rounded-lg ${
                  isCreating || !name.trim() ? 'bg-zinc-300' : 'bg-zinc-950'
                }`}
                activeOpacity={0.7}
              >
                {isCreating ? (
                  <View className="flex-row items-center justify-center">
                    <ActivityIndicator size="small" color="#FFFFFF" />
                    <Text className="ml-2 text-lg font-geist-semibold text-white">
                      Creating...
                    </Text>
                  </View>
                ) : (
                  <Text className="text-lg font-geist-semibold text-white text-center">
                    Create category
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Icon Picker Modal */}
      <IconPicker
        visible={showIconPicker}
        onClose={() => setShowIconPicker(false)}
        onSelectIcon={handleSelectIcon}
        selectedIcon={selectedIcon}
        selectedColor={selectedColor}
      />
    </>
  );
}