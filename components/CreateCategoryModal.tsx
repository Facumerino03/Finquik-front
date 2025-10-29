import { X } from 'lucide-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';
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
    handleReset();
    onClose();
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
          <View className="bg-white rounded-t-3xl" style={{ height: '60%' }}>
            {/* Header */}
            <View className="flex-row items-center justify-between px-6 pt-10 pb-5">
              <Text className="text-2xl font-geist-semibold text-zinc-950">
                Create Category
              </Text>
              <TouchableOpacity
                onPress={handleClose}
                className="w-8 h-8 items-center justify-center"
                activeOpacity={0.7}
              >
                <X size={24} color="#09090b" />
              </TouchableOpacity>
            </View>

            {/* Content */}
            <View className="flex-1 px-6 py-4">
              {/* Category Type Badge */}
              <View className="mb-6">
                <Text className="text-sm font-geist text-zinc-500 mb-2">Type</Text>
                <View 
                  className={`self-start px-4 py-2 rounded-full ${
                    categoryType === 'INCOME' ? 'bg-green-100' : 'bg-red-100'
                  }`}
                >
                  <Text 
                    className={`text-base font-geist-medium ${
                      categoryType === 'INCOME' ? 'text-green-700' : 'text-red-700'
                    }`}
                  >
                    {categoryType === 'INCOME' ? 'Income' : 'Expense'}
                  </Text>
                </View>
              </View>

              {/* Name Input */}
              <View className="mb-6">
                <Text className="text-sm font-geist text-zinc-500 mb-2">Name</Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter category name"
                  placeholderTextColor="#71717b"
                  className="bg-zinc-50 rounded-2xl px-4 py-4 text-base font-geist text-zinc-950"
                  autoFocus
                />
              </View>

              {/* Icon Selector */}
              <View className="mb-6">
                <Text className="text-sm font-geist text-zinc-500 mb-2">Icon & Color</Text>
                <TouchableOpacity
                  onPress={() => setShowIconPicker(true)}
                  className="bg-zinc-50 rounded-2xl px-4 py-4 flex-row items-center justify-between"
                  activeOpacity={0.7}
                >
                  <View className="flex-row items-center">
                    {selectedIcon && selectedColor ? (
                      <>
                        <View 
                          className="w-10 h-10 rounded-full items-center justify-center mr-3"
                          style={{ backgroundColor: '#ffffff' }}
                        >
                          <CategoryIcon
                            iconName={selectedIcon}
                            size={20}
                            color={selectedColor}
                          />
                        </View>
                        <Text className="text-base font-geist text-zinc-950">
                          {selectedIcon}
                        </Text>
                      </>
                    ) : (
                      <Text className="text-base font-geist text-zinc-500">
                        Select icon and color
                      </Text>
                    )}
                  </View>
                  <Text className="text-base font-geist text-zinc-400">›</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Create Button */}
            <View className="px-6 pb-8">
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
                    Create Category
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