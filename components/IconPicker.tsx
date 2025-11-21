import * as LucideIcons from 'lucide-react-native';
import { X } from 'lucide-react-native';
import React, { useState } from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { AVAILABLE_COLORS } from '../core/constants/availableColors';
import { AVAILABLE_ICONS } from '../core/constants/availableIcons';

interface IconPickerProps {
  visible: boolean;
  onClose: () => void;
  onSelectIcon: (iconName: string, color: string) => void;
  selectedIcon?: string | null;
  selectedColor?: string | null;
}

const IconPicker: React.FC<IconPickerProps> = ({
  visible,
  onClose,
  onSelectIcon,
  selectedIcon,
  selectedColor
}) => {
  const [tempSelectedIcon, setTempSelectedIcon] = useState<string | null>(selectedIcon || null);
  const [tempSelectedColor, setTempSelectedColor] = useState<string>(selectedColor || AVAILABLE_COLORS[0].value);

  const handleSelectIcon = (iconName: string) => {
    setTempSelectedIcon(iconName);
  };

  const handleSelectColor = (color: string) => {
    setTempSelectedColor(color);
  };

  const handleConfirm = () => {
    if (tempSelectedIcon) {
      onSelectIcon(tempSelectedIcon, tempSelectedColor);
      onClose();
    }
  };

  const getColorBackground = (colorValue: string) => {
    const color = AVAILABLE_COLORS.find(c => c.value === colorValue);
    return color ? color.bg : '#f4f4f5';
  };

  const renderIcon = (iconName: string) => {
    const IconComponent = LucideIcons[iconName as keyof typeof LucideIcons] as any;
    
    if (!IconComponent) return null;

    const isSelected = tempSelectedIcon === iconName;

    return (
      <TouchableOpacity
        key={iconName}
        onPress={() => handleSelectIcon(iconName)}
        className="items-center justify-center rounded-full"
        style={{
          width: 52,
          height: 52,
          margin: 4,
          backgroundColor: isSelected ? getColorBackground(tempSelectedColor) : 'transparent',
        }}
        activeOpacity={0.7}
      >
        <IconComponent 
          size={26} 
          color={isSelected ? tempSelectedColor : '#717176'} 
        />
      </TouchableOpacity>
    );
  };

  const renderColorOption = (color: typeof AVAILABLE_COLORS[number]) => {
    const isSelected = tempSelectedColor === color.value;

    return (
      <TouchableOpacity
        key={color.name}
        onPress={() => handleSelectColor(color.value)}
        className="items-center justify-center rounded-full mx-1.5"
        style={{
          width: 44,
          height: 44,
          backgroundColor: color.value,
          borderWidth: isSelected ? 3 : 0,
          borderColor: '#ffffff',
        }}
        activeOpacity={0.8}
      >
        {isSelected && (
          <View className="w-2 h-2 bg-white rounded-full" />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-white rounded-t-3xl" style={{ height: '85%' }}>
          {/* Header */}
          <View className="flex-row items-center justify-between px-6 pt-10 pb-8">
            <Text className="text-2xl font-geist-semibold text-zinc-950">
              Select icon
            </Text>
            <TouchableOpacity
              onPress={onClose}
              className="w-8 h-8 items-center justify-center"
              activeOpacity={0.7}
            >
              <X size={24} color="#09090b" />
            </TouchableOpacity>
          </View>

          {/* Color Selector */}
          <View className="px-6 pb-4">
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingVertical: 8 }}
            >
              {AVAILABLE_COLORS.map(renderColorOption)}
            </ScrollView>
          </View>

          <View className="h-px bg-zinc-200 mx-6" />

          {/* Icons Grid */}
          <ScrollView 
            className="flex-1 pt-4" 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 25, paddingBottom: 100 }}
          >
            <View className="flex-row flex-wrap">
              {AVAILABLE_ICONS.map(renderIcon)}
            </View>
          </ScrollView>

          {/* Confirm Button */}
          <View className="px-6 pb-8 pt-4 bg-white">
            <TouchableOpacity
              onPress={handleConfirm}
              disabled={!tempSelectedIcon}
              className={`py-4 rounded-lg items-center ${
                tempSelectedIcon ? 'bg-zinc-950' : 'bg-zinc-200'
              }`}
              activeOpacity={0.8}
            >
              <Text className={`text-lg font-geist-semibold ${
                tempSelectedIcon ? 'text-white' : 'text-zinc-400'
              }`}>
                Confirm
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default IconPicker;