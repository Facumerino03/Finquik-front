import { Stack } from "expo-router";
import {
  useFonts,
  Inter_400Regular,
  Inter_700Bold,
  Inter_600SemiBold,
  Inter_500Medium,
} from "@expo-google-fonts/inter";
import {
  Geist_400Regular,
  Geist_500Medium,
  Geist_700Bold,
  Geist_600SemiBold
} from "@expo-google-fonts/geist";
import { AuthProvider } from "../core/contexts/AuthContext";

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
      <Stack>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  );
}
