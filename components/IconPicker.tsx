import * as LucideIcons from 'lucide-react-native';
import { X } from 'lucide-react-native';
import React from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { AVAILABLE_ICONS } from '../core/constants/availableIcons';

interface IconPickerProps {
  visible: boolean;
  onClose: () => void;
  onSelectIcon: (iconName: string) => void;
  selectedIcon?: string | null;
}

const IconPicker: React.FC<IconPickerProps> = ({
  visible,
  onClose,
  onSelectIcon,
  selectedIcon
}) => {
  const handleSelectIcon = (iconName: string) => {
    onSelectIcon(iconName);
    onClose();
  };

  const renderIcon = (iconName: string) => {
    const IconComponent = LucideIcons[iconName as keyof typeof LucideIcons] as any;
    
    if (!IconComponent) return null;

    const isSelected = selectedIcon === iconName;

    return (
      <TouchableOpacity
        key={iconName}
        onPress={() => handleSelectIcon(iconName)}
        className={`w-16 h-16 items-center justify-center rounded-xl m-2 ${
          isSelected ? 'bg-zinc-950' : 'bg-zinc-100'
        }`}
        activeOpacity={0.7}
      >
        <IconComponent 
          size={28} 
          color={isSelected ? '#ffffff' : '#09090b'} 
        />
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
        <View className="bg-white rounded-t-3xl" style={{ height: '70%' }}>
          {/* Header */}
          <View className="flex-row items-center justify-between px-6 pt-8 pb-4 border-b border-zinc-200">
            <Text className="text-2xl font-geist-semibold text-zinc-950">
              Select Icon
            </Text>
            <TouchableOpacity
              onPress={onClose}
              className="w-10 h-10 items-center justify-center rounded-full bg-zinc-100"
              activeOpacity={0.7}
            >
              <X size={20} color="#09090b" />
            </TouchableOpacity>
          </View>

          {/* Icons Grid */}
          <ScrollView 
            className="flex-1 px-4 py-4" 
            showsVerticalScrollIndicator={false}
          >
            <View className="flex-row flex-wrap justify-start">
              {AVAILABLE_ICONS.map(renderIcon)}
            </View>
            
            {/* Espaciado inferior para que no quede cortado el último item */}
            <View style={{ height: 20 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default IconPicker;