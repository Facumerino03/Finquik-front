import { Text, View } from "react-native";
import { verifyInstallation } from "nativewind";
import "../global.css";
import "expo-router/entry";

export default function Index() {
  // Esto verificará si NativeWind está instalado correctamente
  // y mostrará mensajes en la consola
  verifyInstallation();

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-xl font-bold text-blue-500">
        ¡NativeWind está funcionando!
      </Text>
    </View>
  );
}