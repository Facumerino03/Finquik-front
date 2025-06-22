import {
  Home,
  BanknoteArrowUp,
  BanknoteArrowDown,
  Landmark,
} from "lucide-react-native";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface TabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

export default function FloatingTabBar({
  state,
  descriptors,
  navigation,
}: TabBarProps) {
  const insets = useSafeAreaInsets();

  const tabColors = {
    index: { background: "#f4f4f5", icon: "#09090b" }, 
    incomes: { background: "#dcfce7", icon: "#00c950" }, 
    expenses: { background: "#ffe2e2", icon: "#fb2c36" }, 
    accounts: { background: "#dbeafe", icon: "#2b7fff" }, 
  };

  const getIcon = (routeName: string, color: string) => {
    const iconProps = { size: 24, color };

    switch (routeName) {
      case "index":
        return <Home {...iconProps} />;
      case "incomes":
        return <BanknoteArrowUp {...iconProps} />;
      case "expenses":
        return <BanknoteArrowDown {...iconProps} />;
      case "accounts":
        return <Landmark {...iconProps} />;
      default:
        return <Home {...iconProps} />;
    }
  };

  return (
    <View style={[styles.container, { bottom: insets.bottom + 20 }]}>
        {state.routes.map((route: any, index: number) => {
          const isFocused = state.index === index;
          const routeColors =
            tabColors[route.name as keyof typeof tabColors] || tabColors.index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={index}
              onPress={onPress}
              style={[
                styles.tab,
                isFocused && {
                  backgroundColor: routeColors.background,
                },
              ]}
            >
              {getIcon(route.name, isFocused ? routeColors.icon : "#09090b")}
            </TouchableOpacity>
          );
        })}
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 50,
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e4e4e7",
    alignSelf: "center",
  },
  tab: {
    padding: 15,
    borderRadius: 50,
    minWidth: 50,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 2,
  },
});
