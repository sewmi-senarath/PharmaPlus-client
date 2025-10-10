import 'react-native-reanimated';
import React from 'react';
import { Stack } from 'expo-router';

export default function PharmacyStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // hides the white header
      }}
    >
      {/* Registration screen - shown first for new pharmacies */}
      <Stack.Screen name="pharmacy_register" options={{ presentation: 'card' }} />

      {/* Tab navigator (Home, Inventory, Orders, etc.) */}
      <Stack.Screen name="(tabs)" />

      {/* Non-tab screens pushed on top of the tabs */}
      <Stack.Screen name="add-medicine" options={{ presentation: 'card' }} />
      <Stack.Screen name="availability" options={{ presentation: 'card' }} />
      <Stack.Screen name="notifications" options={{ presentation: 'card' }} />
    </Stack>
  );
}
