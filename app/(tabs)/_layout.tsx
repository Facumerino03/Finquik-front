import { Tabs } from 'expo-router';
import FloatingTabBar from '../../components/layout/FloatingTabBar';

export default function TabLayout() {
  return (
    <Tabs 
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="incomes" />
      <Tabs.Screen name="expenses" />
      <Tabs.Screen name="accounts" />
    </Tabs>
  );
}
