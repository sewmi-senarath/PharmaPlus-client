import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";

const SummaryCard = ({ icon, value, label, color = "#059669" }: { icon: keyof typeof Ionicons.glyphMap; value: string; label: string; color?: string }) => (
  <View className="flex-1 bg-white rounded-2xl p-4 mr-3">
    <View className="items-center">
      <Ionicons name={icon} size={22} color={color} />
      <Text className="text-2xl font-bold mt-2">{value}</Text>
      <Text className="text-gray-500 text-xs mt-1">{label}</Text>
    </View>
  </View>
);

const DeliveryItem = ({ id, name, address, items, km, status }: any) => (
  <View className="bg-gray-50 rounded-2xl p-4 mb-3">
    <View className="flex-row justify-between items-center mb-1">
      <Text className="font-semibold">#{id}</Text>
      <View className="px-2 py-1 rounded bg-emerald-100"><Text className="text-emerald-700 text-xs">{status}</Text></View>
    </View>
    <Text className="text-gray-800 font-semibold">{name}</Text>
    <Text className="text-gray-500 text-xs">{address}</Text>
    <Text className="text-gray-500 text-xs mt-2">{items} items • {km} km</Text>
    <View className="flex-row gap-2 mt-3">
      <Pressable className="h-9 w-9 rounded-xl bg-white items-center justify-center border"><Ionicons name="call-outline" size={18} color="#0d9488"/></Pressable>
      <Pressable className="h-9 w-9 rounded-xl bg-white items-center justify-center border"><Ionicons name="map-outline" size={18} color="#0d9488"/></Pressable>
      <Pressable className="h-9 w-9 rounded-xl bg-white items-center justify-center border"><Ionicons name="send-outline" size={18} color="#0d9488"/></Pressable>
    </View>
  </View>
);

export default function DeliveryPersonHub() {
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 100 }}>
        <Text className="text-xl font-bold mt-4 mb-3">Delivery Hub</Text>

        <View className="flex-row mb-4">
          <SummaryCard icon="cube-outline" value="2" label="rider.active" />
          <SummaryCard icon="checkmark-circle-outline" value="12" label="rider.completed" color="#16a34a" />
        </View>

        <Text className="text-gray-500 mb-3">rider.deliveries</Text>

        <DeliveryItem id="ORD12345" name="Priyantha Silva" address="No. 123, Galle Road, Colombo 03" items={3} km={2.5} status="in_progress" />
        <DeliveryItem id="ORD12346" name="Kamala Perera" address="No. 456, Kandy Road, Colombo 07" items={1} km={4.2} status="pending" />
      </ScrollView>

      {/* Bottom nav */}
      <View className="absolute left-0 right-0 flex-row justify-around border-t bg-white" style={{ bottom: Math.max(insets.bottom, 0), paddingVertical: 8 }}>
        <View className="items-center"><Ionicons name="cube-outline" size={18} color="#0d9488"/><Text className="text-xs text-teal-700">nav.deliveries</Text></View>
        <View className="items-center"><Ionicons name="map-outline" size={18} color="#475569"/><Text className="text-xs text-slate-500">nav.map</Text></View>
        <View className="items-center"><Ionicons name="time-outline" size={18} color="#475569"/><Text className="text-xs text-slate-500">nav.history</Text></View>
      </View>
    </SafeAreaView>
  );
}
