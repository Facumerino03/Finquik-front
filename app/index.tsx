import { Redirect } from 'expo-router';
import "../global.css";
import "expo-router/entry";

export default function Index() {
  return <Redirect href="/(tabs)" />;
}