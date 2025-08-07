import { Redirect } from 'expo-router';
import { Text, View } from 'react-native';
import "../global.css";
import "expo-router/entry";
import { useAuth } from '../core/contexts/AuthContext';

export default function Index() {
  const { userToken, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!userToken) {
    console.log("No token, redirecting to login");
    return <Redirect href="/(auth)/login" />;
  }

  console.log("Token found, redirecting to tabs");
  return <Redirect href="/(tabs)" />;
}