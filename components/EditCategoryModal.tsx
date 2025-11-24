import { Trash2, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { deleteCategory, updateCategory } from '../core/services/categories';
import { Category } from '../core/types/transactions';
import CategoryIcon from './CategoryIcon';
import IconPicker from './IconPicker';

interface EditCategoryModalProps {
  visible: boolean;
  onClose: () => void;
  category: Category;
  onCategoryUpdated: () => void;
}

export default function EditCategoryModal({
  visible,
  onClose,
  category,
  onCategoryUpdated,
}: EditCategoryModalProps) {
  const [name, setName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isUncategorized = category.name.toLowerCase() === 'uncategorized';

  useEffect(() => {
    if (category) {
      setName(category.name);
      setSelectedIcon(category.iconName || null);
      setSelectedColor(category.iconColor || null);
    }
  }, [category]);

  const handleClose = () => {
    if (!isUpdating && !isDeleting) {
      onClose();
    }
  };

  const handleSelectIcon = (iconName: string, color: string) => {
    setSelectedIcon(iconName);
    setSelectedColor(color);
  };

  const handleUpdate = async () => {
    if (!isUncategorized && !name.trim()) {
      Alert.alert('Error', 'Please enter a category name');
      return;
    }

    try {
      setIsUpdating(true);
      await updateCategory(category.id, {
        name: isUncategorized ? category.name : name.trim(),
        type: category.type,
        iconName: selectedIcon || undefined,
        iconColor: selectedColor || undefined,
      });

      Alert.alert('Success', 'Category updated successfully');
      onCategoryUpdated();
      onClose();
    } catch (error) {
      console.error('Error updating category:', error);
      Alert.alert('Error', 'Failed to update category');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = () => {
    if (isUncategorized) {
      Alert.alert('Cannot Delete', 'The "Uncategorized" category cannot be deleted.');
      return;
    }

    Alert.alert(
      'Delete Category',
      `Are you sure you want to delete "${category.name}"? This will affect all associated transactions.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsDeleting(true);
              await deleteCategory(category.id);
              Alert.alert('Success', 'Category deleted successfully');
              onCategoryUpdated();
              onClose();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete category. Please try again.');
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  };

  const isLoading = isUpdating || isDeleting;

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
                {isUncategorized ? 'Edit category icon' : 'Edit category'}
              </Text>
              <TouchableOpacity
                onPress={handleClose}
                className="w-8 h-8 items-center justify-center"
                activeOpacity={0.7}
                disabled={isLoading}
              >
                <X size={24} color="#09090b" />
              </TouchableOpacity>
            </View>

            {/* Content */}
            <ScrollView 
              className="flex-1 px-6"
              showsVerticalScrollIndicator={false}
            >
              <View className="items-center mb-8">
                <TouchableOpacity
                  onPress={() => setShowIconPicker(true)}
                  activeOpacity={0.7}
                  disabled={isLoading}
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

              <View className="mb-8">
                <Text className="text-sm font-geist-medium text-zinc-950 mb-2">
                  Category name
                </Text>
                {isUncategorized ? (
                  <View className="bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-4">
                    <Text className="text-base font-geist text-zinc-500">
                      {name}
                    </Text>
                  </View>
                ) : (
                  <TextInput
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter category name"
                    placeholderTextColor="#a1a1aa"
                    className="bg-white border border-zinc-200 rounded-lg px-4 py-4 text-base font-geist text-zinc-950"
                    editable={!isLoading}
                  />
                )}
                {isUncategorized && (
                  <Text className="text-xs font-geist text-zinc-400 mt-2">
                    This is a default category and cannot be renamed
                  </Text>
                )}
              </View>

              <View className="mb-8">
                <Text className="text-sm font-geist-medium text-zinc-950 mb-2">
                  Category type
                </Text>
                <View 
                  className={`self-start px-4 py-3 rounded-full ${
                    category.type === 'INCOME' ? 'bg-green-100' : 'bg-red-100'
                  }`}
                >
                  <Text 
                    className={`text-sm font-geist-medium ${
                      category.type === 'INCOME' ? 'text-green-700' : 'text-red-700'
                    }`}
                  >
                    {category.type === 'INCOME' ? 'Income' : 'Expense'}
                  </Text>
                </View>
              </View>
            </ScrollView>

            <View className="px-6 pb-8 pt-4 flex-row gap-3">
              <TouchableOpacity
                onPress={handleDelete}
                disabled={isLoading || isUncategorized}
                className={`w-14 h-14 rounded-full items-center justify-center ${
                  isUncategorized ? 'bg-zinc-200' : isLoading ? 'bg-red-200' : 'bg-red-500'
                }`}
                activeOpacity={isUncategorized ? 1 : 0.7}
              >
                {isDeleting ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Trash2 
                    size={22} 
                    color={isUncategorized ? '#a1a1aa' : '#FFFFFF'} 
                    strokeWidth={2} 
                  />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleUpdate}
                disabled={isLoading || (!isUncategorized && !name.trim())}
                className={`flex-1 py-4 rounded-lg ${
                  isLoading || (!isUncategorized && !name.trim())
                    ? 'bg-zinc-300'
                    : 'bg-zinc-950'
                }`}
                activeOpacity={0.7}
              >
                {isUpdating ? (
                  <View className="flex-row items-center justify-center">
                    <ActivityIndicator size="small" color="#FFFFFF" />
                    <Text className="ml-2 text-lg font-geist-semibold text-white">
                      Saving...
                    </Text>
                  </View>
                ) : (
                  <Text className="text-lg font-geist-semibold text-white text-center">
                    Save changes
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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