import { Settings, UserRound } from 'lucide-react-native';
import React, { useState } from 'react';
import { StatusBar, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SettingsModal from './SettingsModal';

export default function Header() {
  const insets = useSafeAreaInsets();
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const handleProfilePress = () => {
    // Navegar a perfil
    //router.push('/profile');
  };

  const handleSettingsPress = () => {
    setShowSettingsModal(true);
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <View 
        className="bg-white flex-row justify-between items-center px-5 pb-3"
        style={{ paddingTop: insets.top + 10 }}
      >
        <TouchableOpacity 
          onPress={handleProfilePress}
          activeOpacity={0.7}
          className="p-1"
        >
          <View className="w-11 h-11 bg-zinc-950 rounded-full items-center justify-center">
            <UserRound size={20} color="#FFFFFF" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={handleSettingsPress}
          activeOpacity={0.7}
          className="p-2"
        >
          <Settings size={24} color="#09090b" />
        </TouchableOpacity>
      </View>

      {/* Settings Modal */}
      <SettingsModal
        visible={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
      />
    </>
  );
}