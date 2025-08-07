import { Settings, UserRound } from 'lucide-react-native';
import React from 'react';
import { StatusBar, TouchableOpacity, View, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../core/contexts/AuthContext';
import { router } from 'expo-router';

export default function Header() {
  const insets = useSafeAreaInsets();
  const { logout } = useAuth();

  const handleProfilePress = () => {
    // Navegar a perfil
    //router.push('/profile');
  };

  const handleSettingsPress = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro que quieres cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Cerrar Sesión', 
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(auth)/login');
          }
        }
      ]
    );
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
          <View className="w-11 h-11 	
background-color: bg-zinc-950 rounded-full items-center justify-center">
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
    </>
  );
}