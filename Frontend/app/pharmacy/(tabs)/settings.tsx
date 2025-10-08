import React from 'react';
import { View, Text } from 'react-native';
import PharmacyHeader from '@/modules/pharmacy/components/PharmacyHeader';

export default function SettingsScreen() {
  return (
    <View className="flex-1 bg-white">
      <PharmacyHeader title="Settings" />
      <View className="p-4 gap-3">
        <Text className="text-gray-700">• Change language</Text>
        <Text className="text-gray-700">• Notifications</Text>
        <Text className="text-gray-700">• Profile & security</Text>
      </View>
    </View>
  );
}