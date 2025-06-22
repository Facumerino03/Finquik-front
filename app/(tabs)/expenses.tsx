import { Text, View } from 'react-native';
import Header from '../../components/Header';

export default function ExpensesScreen() {
  return (
    <View className="flex-1 bg-gray-100">
      <Header />
      <View className="flex-1 items-center justify-center">
        <Text className="text-2xl font-bold">Egresos</Text>
      </View>
    </View>
  );
}