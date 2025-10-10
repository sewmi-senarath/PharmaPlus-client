import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";

const Tile = ({ icon, label }: { icon: keyof typeof Ionicons.glyphMap; label: string }) => (
  <View className="flex-1 h-16 bg-white rounded-xl items-center justify-center border border-gray-200">
    <Ionicons name={icon} size={18} color="#0d9488" />
    <Text className="text-xs mt-1">{label}</Text>
  </View>
);

const Card = ({ title, children }: any) => (
  <View className="bg-white rounded-2xl p-4 mb-4"> 
    <Text className="font-semibold mb-2">{title}</Text>
    {children}
  </View>
);

export default function CustomerHub() {
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Welcome bar */}
        <View className="bg-emerald-50 rounded-2xl p-4 mt-4">
          <Text className="text-emerald-900 font-semibold">Welcome, John!</Text>
          <Text className="text-emerald-700 text-xs mt-1">Health Status</Text>
        </View>

        {/* Quick actions */}
        <View className="flex-row gap-3 mt-3">
          <Pressable className="flex-1" onPress={() => router.push('/usermain_page/order-medition')}>
            <Tile icon="add-outline" label="Order Medicine" />
          </Pressable>
          <Tile icon="mic-outline" label="Voice Search" />
        </View>
        <View className="flex-row gap-3 mt-3">
          <Tile icon="bus-outline" label="Track Order" />
          <Tile icon="notifications-outline" label="Reminders" />
        </View>

        {/* Active Orders */}
        <Card title="Active Orders">
          <View className="bg-gray-50 rounded-xl p-3 mb-2">
            <View className="flex-row justify-between">
              <Text className="font-semibold">#ORD001</Text>
              <View className="bg-green-100 rounded px-2 py-0.5"><Text className="text-green-700 text-xs">Out for Delivery</Text></View>
            </View>
            <Text className="text-xs text-gray-500">Paracetamol 500mg, Vitamin D3</Text>
            <View className="flex-row justify-between mt-1">
              <Text className="text-gray-800 font-semibold">Rs. 450</Text>
              <Text className="text-xs text-gray-500">15 mins</Text>
            </View>
          </View>
          <View className="bg-gray-50 rounded-xl p-3">
            <View className="flex-row justify-between">
              <Text className="font-semibold">#ORD002</Text>
              <View className="bg-yellow-100 rounded px-2 py-0.5"><Text className="text-yellow-700 text-xs">Processing</Text></View>
            </View>
            <Text className="text-xs text-gray-500">Blood Pressure Monitor</Text>
            <View className="flex-row justify-between mt-1">
              <Text className="text-gray-800 font-semibold">Rs. 2500</Text>
              <Text className="text-xs text-gray-500">2 hours</Text>
            </View>
          </View>
        </Card>

        {/* Medication Reminders */}
        <Card title="Medication Reminders">
          <View className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
            <Text className="font-semibold text-gray-800">Atorvastatin 20mg</Text>
            <Text className="text-xs text-gray-500">Due at 20:00</Text>
            <Pressable className="mt-2 self-end bg-teal-600 rounded px-3 py-1">
              <Text className="text-white text-xs">Mark as Taken</Text>
            </Pressable>
          </View>
        </Card>

        {/* Nearby Pharmacies */}
        <Card title="Nearby Pharmacies">
          <View className="bg-gray-50 rounded-xl p-3 mb-2 flex-row justify-between items-center">
            <View>
              <Text className="font-semibold">Central Pharmacy</Text>
              <Text className="text-xs text-gray-500">0.5 km • 4.8</Text>
            </View>
            <Pressable className="bg-teal-600 rounded px-3 py-1"><Text className="text-white text-xs">Visit</Text></Pressable>
          </View>
          <View className="bg-gray-50 rounded-xl p-3 flex-row justify-between items-center">
            <View>
              <Text className="font-semibold">HealthCare Plus</Text>
              <Text className="text-xs text-gray-500">1.2 km • 4.6</Text>
            </View>
            <Pressable className="bg-teal-600 rounded px-3 py-1"><Text className="text-white text-xs">Visit</Text></Pressable>
          </View>
        </Card>
      </ScrollView>

      {/* Bottom nav */}
      <View className="absolute left-0 right-0 flex-row justify-around border-t bg-white" style={{ bottom: Math.max(insets.bottom, 0), paddingVertical: 8 }}>
        <View className="items-center"><Ionicons name="home-outline" size={18} color="#0d9488"/><Text className="text-xs text-teal-700">Home</Text></View>
        <View className="items-center"><Ionicons name="search-outline" size={18} color="#475569"/><Text className="text-xs text-slate-500">Search</Text></View>
        <View className="items-center"><Ionicons name="cart-outline" size={18} color="#475569"/><Text className="text-xs text-slate-500">Orders</Text></View>
        <View className="items-center"><Ionicons name="medkit-outline" size={18} color="#475569"/><Text className="text-xs text-slate-500">Medications</Text></View>
        <View className="items-center"><Ionicons name="person-outline" size={18} color="#475569"/><Text className="text-xs text-slate-500">Profile</Text></View>
      </View>
    </SafeAreaView>
  );
}
