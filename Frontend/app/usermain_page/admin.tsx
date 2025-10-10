import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";

const Stat = ({ icon, value, label }: any) => (
  <View className="flex-1 bg-white rounded-2xl p-4 mr-3 items-center">
    <Ionicons name={icon} size={20} color="#0d9488" />
    <Text className="text-xl font-bold mt-2">{value}</Text>
    <Text className="text-gray-500 text-xs mt-1">{label}</Text>
  </View>
);

export default function AdminHub() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 120 }}>
        <Text className="text-xl font-bold mt-4 mb-3">System Analytics</Text>
        <View className="flex-row mb-4">
          <Stat icon="cube-outline" value="1247" label="admin.total_orders" />
          <Stat icon="people-outline" value="8,543" label="admin.active_users" />
        </View>
        <View className="flex-row mb-4">
          <Stat icon="cash-outline" value="Rs. 2.5M" label="admin.revenue" />
        </View>

        <Text className="text-gray-500 mb-2">admin.weekly_orders</Text>
        <View className="bg-white rounded-2xl p-4">
          <View className="flex-row justify-between items-end h-36">
            {[180, 200, 210, 180, 220, 240, 190].map((h, i) => (
              <View key={i} style={{ height: h / 2 }} className="w-8 bg-teal-600 rounded" />
            ))}
          </View>
          <View className="flex-row justify-between mt-2">
            {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d) => (
              <Text key={d} className="text-xs text-gray-500">{d}</Text>
            ))}
          </View>
        </View>
      </ScrollView>
      <View className="px-5 pb-4 bg-white">
        <TouchableOpacity onPress={() => router.push('/usermain_page/admin-medidion-add')} className="rounded-xl py-4 bg-emerald-600">
          <Text className="text-center text-white font-semibold">+ Add Medicine</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
