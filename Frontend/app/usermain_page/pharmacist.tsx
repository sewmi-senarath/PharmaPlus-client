import React from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";

const Stat = ({ icon, value, label, color = "#0d9488" }: any) => (
  <View className="flex-1 bg-white rounded-2xl p-4 mr-3">
    <View className="items-center">
      <Ionicons name={icon} size={20} color={color} />
      <Text className="text-xl font-bold mt-2">{value}</Text>
      <Text className="text-gray-500 text-xs mt-1">{label}</Text>
    </View>
  </View>
);

const ExpiryItem = ({ name, detail, color }: any) => (
  <View className={`rounded-xl p-3 mb-2 ${color}`}>
    <Text className="font-semibold text-gray-800">{name}</Text>
    <Text className="text-xs text-gray-600 mt-1">{detail}</Text>
  </View>
);

export default function PharmacistHub() {
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 100 }}>
        <Text className="text-xl font-bold mt-4 mb-3">Pharmacy Management</Text>
        <View className="flex-row mb-4">
          <Stat icon="cube-outline" value="12" label="pharmacy.pending.orders" />
          <Stat icon="cash-outline" value="Rs. 125,000" label="pharmacy.today.revenue" />
          <Stat icon="analytics-outline" value="15" label="pharmacy.low.stock" />
        </View>

        <Text className="text-gray-500 mb-2">pharmacy.smart.expiry</Text>
        <ExpiryItem name="Paracetamol 500mg" detail="123 pharmacy units • Auto discount 15%" color="bg-yellow-50" />
        <ExpiryItem name="Cetirizine 10mg" detail="96 pharmacy units" color="bg-yellow-50" />
        <ExpiryItem name="Vitamin B Complex" detail="45 pharmacy units • Emergency discount 30%" color="bg-red-50" />

        <Text className="text-gray-500 mt-4 mb-2">pharmacy.low.stock.alerts</Text>
        <View className="bg-gray-50 rounded-xl p-3">
          <Text className="text-xs text-gray-600">Insulin Glargine</Text>
          <View className="h-2 bg-emerald-100 rounded mt-2" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
