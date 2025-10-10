import { Stack } from "expo-router";
import './globals.css';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#0d9488' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="screens/onboarding" 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="screens/login" 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="home"
        options={{ headerShown: false }} 
      />
    </Stack>
  );
}