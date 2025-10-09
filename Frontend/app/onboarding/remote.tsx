import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";

const Item = ({ icon, title, desc }: { icon: keyof typeof Ionicons.glyphMap; title: string; desc: string }) => (
  <View className="w-full bg-gray-50 rounded-2xl p-4 flex-row items-center">
    <View className="h-10 w-10 rounded-xl bg-teal-100 items-center justify-center mr-3">
      <Ionicons name={icon} size={22} color="#0f766e" />
    </View>
    <View className="flex-1">
      <Text className="text-base font-semibold text-gray-800">{title}</Text>
      <Text className="text-xs text-gray-500 mt-1">{desc}</Text>
    </View>
  </View>
);

export default function Remote() {
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-5 pt-6">
        <Text className="text-2xl font-semibold text-center text-gray-800">Built for Remote Areas</Text>
        <Text className="text-sm text-center text-gray-500 mt-1">Designed for low-bandwidth and offline environments</Text>
      </View>

      <ScrollView className="mt-6 px-5" contentContainerStyle={{ paddingBottom: 120 }}>
        <View className="space-y-4">
          <Item icon="wifi-outline" title="Low Bandwidth" desc="Optimized for slow internet connections" />
          <Item icon="tablet-portrait-outline" title="Offline Mode" desc="Key features work without internet" />
          <Item icon="navigate-outline" title="GPS Tracking" desc="Real-time delivery tracking" />
          <Item icon="qr-code-outline" title="QR Integration" desc="Quick scanning for instructions & orders" />
        </View>
      </ScrollView>

      <View className="absolute left-0 right-0 flex-row justify-between" style={{ bottom: Math.max(insets.bottom, 16), paddingHorizontal: 16 }}>
        <Pressable onPress={() => router.push("/onboarding/features")} className="px-4 py-3 rounded-lg border">
          <Text className="text-gray-700">Previous</Text>
        </Pressable>
        <Pressable onPress={() => router.replace("/screens/rider-dashboard")} className="px-5 py-3 rounded-lg bg-teal-600">
          <Text className="text-white font-medium">Get Started</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
