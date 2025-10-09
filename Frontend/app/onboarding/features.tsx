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

export default function Features() {
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-5 pt-6">
        <Text className="text-2xl font-semibold text-center text-gray-800">Smart Features</Text>
        <Text className="text-sm text-center text-gray-500 mt-1">Advanced technology for better healthcare access</Text>
      </View>

      <ScrollView className="mt-6 px-5" contentContainerStyle={{ paddingBottom: 120 }}>
        <View className="space-y-4">
          <Item icon="trending-up-outline" title="Health Trends" desc="AI predicts community health patterns" />
          <Item icon="calendar-outline" title="Smart Expiry" desc="Auto-discounting of expiring medications" />
          <Item icon="mic-outline" title="Voice Commands" desc="Hands-free operation for all users" />
          <Item icon="notifications-outline" title="Real-time Alerts" desc="Instant notifications across all roles" />
        </View>
      </ScrollView>

      <View className="absolute left-0 right-0 flex-row justify-between" style={{ bottom: Math.max(insets.bottom, 16), paddingHorizontal: 16 }}>
        <Pressable onPress={() => router.push("/onboarding/roles")} className="px-4 py-3 rounded-lg border">
          <Text className="text-gray-700">Previous</Text>
        </Pressable>
        <Pressable onPress={() => router.push("/onboarding/remote")} className="px-5 py-3 rounded-lg bg-teal-600">
          <Text className="text-white font-medium">Next</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
