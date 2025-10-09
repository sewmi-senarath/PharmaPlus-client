import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';

export default function SearchScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1 items-center justify-center">
        <Text className="text-2xl font-bold text-gray-800">Search</Text>
        <Text className="text-gray-600 mt-2">Search functionality coming soon</Text>
      </View>
    </SafeAreaView>
  );
}