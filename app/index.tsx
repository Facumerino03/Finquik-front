import { Redirect } from 'expo-router';
import "expo-router/entry";
import { Text, View } from 'react-native';
import { useAuth } from '../core/contexts/AuthContext';
import "../global.css";

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
    console.log("No token, redirecting to onboarding");
    return <Redirect href="/(auth)/onboarding" />;
  }

  console.log("Token found, redirecting to tabs");
  return <Redirect href="/(tabs)" />;
}