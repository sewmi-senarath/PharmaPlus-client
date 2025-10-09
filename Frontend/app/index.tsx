import React from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";

type FeatureProps = {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBg: string;
  title: string;
  desc: string;
};

function FeatureItem({ icon, iconColor, iconBg, title, desc }: FeatureProps) {
  return (
    <View className="w-full rounded-2xl bg-white/95 p-4 flex-row items-center shadow-sm">
      <View className="h-10 w-10 rounded-full items-center justify-center mr-3" style={{ backgroundColor: iconBg }}>
        <Ionicons name={icon} size={22} color={iconColor} />
      </View>
      <View className="flex-1">
        <Text className="text-base font-semibold text-gray-800">{title}</Text>
        <Text className="text-xs text-gray-500 mt-0.5">{desc}</Text>
      </View>
    </View>
  );
}

export default function Index() {
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView className="flex-1 bg-[#f7fbfa]">
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} className="px-6 pt-16">
        {/* Logo */}
        <View className="items-center">
          <View className="h-24 w-24 rounded-2xl overflow-hidden mb-6">
            <Image
              source={require("../assets/images/logo.png")}
              className="h-full w-full"
              resizeMode="contain"
              accessibilityLabel="PharmaPlus logo"
            />
          </View>

          {/* Title & Tagline */}
          <Text className="text-3xl font-semibold text-teal-700">PharmaPlus</Text>
          <Text className="text-gray-500 mt-2">welcome.tagline</Text>
        </View>

        {/* Features */}
        <View className="mt-10 space-y-4">
          <FeatureItem
            icon="time-outline"
            iconColor="#16a34a"
            iconBg="#dcfce7"
            title="welcome.feature1"
            desc="welcome.feature1.desc"
          />
          <FeatureItem
            icon="shield-checkmark-outline"
            iconColor="#2563eb"
            iconBg="#dbeafe"
            title="welcome.feature2"
            desc="welcome.feature2.desc"
          />
          <FeatureItem
            icon="flash-outline"
            iconColor="#a855f7"
            iconBg="#f3e8ff"
            title="welcome.feature3"
            desc="welcome.feature3.desc"
          />
        </View>
      </ScrollView>

      {/* Bottom Get Started Bar (lifted above home indicator/nav bar) */}
      <View
        className="absolute left-0 right-0"
        style={{ bottom: Math.max(insets.bottom, 16), paddingHorizontal: 24 }}
      >
        <Pressable
          onPress={() => router.push("/onboarding/roles")}
          className="bg-teal-600 py-4 items-center rounded-xl shadow-md"
        >
          <Text className="text-white font-semibold tracking-wide">welcome.get_started</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
