import {
  Geist_400Regular,
  Geist_500Medium,
  Geist_600SemiBold,
  Geist_700Bold
} from "@expo-google-fonts/geist";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { Stack } from "expo-router";
import { AuthProvider } from "../core/contexts/AuthContext";
import { TransactionsProvider } from "../core/contexts/TransactionsContext";

export default function Layout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_700Bold,
    Inter_600SemiBold,
    Inter_500Medium,
    Geist_400Regular,
    Geist_500Medium,
    Geist_700Bold,
    Geist_600SemiBold
  });

  if (!fontsLoaded) return null;

  return (
    <AuthProvider>
      <TransactionsProvider>
        <Stack>
          <Stack.Screen name="index" />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen 
            name="all-transactions" 
            options={{ headerShown: false }} 
          />
        </Stack>
      </TransactionsProvider>
    </AuthProvider>
  );
}
