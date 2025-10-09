import React from 'react';
import { View, Text, ScrollView, SafeAreaView } from 'react-native';

export default function MedicationsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="bg-teal-600 px-4 py-6">
        <Text className="text-white text-2xl font-bold">My Medications</Text>
      </View>

      <ScrollView className="flex-1 px-4 py-4">
        <Text className="text-gray-600">Medications list coming soon</Text>
      </ScrollView>
    </SafeAreaView>
  );
}