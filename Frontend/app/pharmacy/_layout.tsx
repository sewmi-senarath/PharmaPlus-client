import 'react-native-reanimated';
import React from 'react';
import { Stack } from 'expo-router';

export default function PharmacyStackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* The tab navigator */}
      <Stack.Screen name="(tabs)" />

      {/* Non-tab screens pushed on top of the tabs */}
      <Stack.Screen name="add-medicine" options={{ presentation: 'card' }} />
      <Stack.Screen name="availability" options={{ presentation: 'card' }} />
      <Stack.Screen name="notifications" options={{ presentation: 'card' }} />
    </Stack>
  );
}