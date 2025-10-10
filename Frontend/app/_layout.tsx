import { Stack } from "expo-router";
import './globals.css';
import { CartProvider } from './cart/CartContext';

// Ensure the app defaults to the home screen on a cold start
export const unstable_settings = {
  initialRouteName: 'index',
};

export default function RootLayout() {
  return (
    <CartProvider>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#0d9488' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
      {/* Hide parent header for the onboarding group to prevent double headers */}
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      {/* Hide parent header for the auth group to prevent double headers */}
      <Stack.Screen name="auth" options={{ headerShown: false }} />
      {/* Hide parent header for the user main pages group */}
      <Stack.Screen name="usermain_page" options={{ headerShown: false }} />
      {/* Hide parent header for the admin section */}
      <Stack.Screen name="admin" options={{ headerShown: false }} />
    </Stack>
    </CartProvider>
  );
}