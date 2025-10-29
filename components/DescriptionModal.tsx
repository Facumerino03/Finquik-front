import { X } from 'lucide-react-native';
import React, { useState } from 'react';
import { Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface DescriptionModalProps {
  visible: boolean;
  onClose: () => void;
  description: string;
  onSave: (description: string) => void;
}

export default function DescriptionModal({
  visible,
  onClose,
  description,
  onSave,
}: DescriptionModalProps) {
  const [localDescription, setLocalDescription] = useState(description);

  const handleSave = () => {
    onSave(localDescription);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-white rounded-t-3xl" style={{ height: '50%' }}>
          {/* Header */}
          <View className="flex-row items-center justify-between px-6 pt-10 pb-5">
            <Text className="text-2xl font-geist-semibold text-zinc-950">
              Add Note
            </Text>
            <TouchableOpacity
              onPress={onClose}
              className="w-8 h-8 items-center justify-center"
              activeOpacity={0.7}
            >
              <X size={24} color="#09090b" />
            </TouchableOpacity>
          </View>

          {/* Description Input */}
          <View className="flex-1 px-6 py-4">
            <TextInput
              value={localDescription}
              onChangeText={setLocalDescription}
              placeholder="Enter a note for this transaction..."
              placeholderTextColor="#71717b"
              className="bg-zinc-50 rounded-2xl px-4 py-4 text-base font-geist text-zinc-950"
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              style={{ minHeight: 120 }}
              autoFocus
            />
          </View>

          {/* Save Button */}
          <View className="px-6 pb-8">
            <TouchableOpacity
              onPress={handleSave}
              className="py-4 rounded-lg bg-zinc-950"
              activeOpacity={0.7}
            >
              <Text className="text-lg font-geist-semibold text-white text-center">
                Save Note
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}