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

export default function Roles() {
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-5 pt-6">
        <Text className="text-2xl font-semibold text-center text-gray-800">Four User Roles</Text>
        <Text className="text-sm text-center text-gray-500 mt-1">Choose your role and access tailored features</Text>
      </View>

      <ScrollView className="mt-6 px-5" contentContainerStyle={{ paddingBottom: 120 }}>
        <View className="space-y-4">
          <Item icon="cart-outline" title="Customers" desc="Order medicines with voice search & biometric login" />
          <Item icon="medkit-outline" title="Pharmacists" desc="Manage inventory with smart expiry alerts" />
          <Item icon="bicycle-outline" title="Delivery Riders" desc="Voice-activated interface with QR instructions" />
          <Item icon="shield-outline" title="Admins" desc="System analytics & health trend predictions" />
        </View>
      </ScrollView>

      <View className="absolute left-0 right-0 flex-row justify-between" style={{ bottom: Math.max(insets.bottom, 16), paddingHorizontal: 16 }}>
        <Pressable onPress={() => router.replace("/")} className="px-4 py-3 rounded-lg border">
          <Text className="text-gray-700">Skip</Text>
        </Pressable>
        <Pressable onPress={() => router.push("/onboarding/features") } className="px-5 py-3 rounded-lg bg-teal-600">
          <Text className="text-white font-medium">Next</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
