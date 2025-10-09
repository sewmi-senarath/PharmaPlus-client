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
        name="screens/roleselection" 
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
      {/* Hide parent header for the onboarding group to prevent double headers */}
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      {/* Hide parent header for the auth group to prevent double headers */}
      <Stack.Screen name="auth" options={{ headerShown: false }} />
    </Stack>
  );
}