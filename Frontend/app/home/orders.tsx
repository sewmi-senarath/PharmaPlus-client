import React from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';

export default function OrdersScreen() {
  const orders = [
    {
      id: 'ORD001',
      status: 'Out for Delivery',
      items: 'Paracetamol 500mg, Vitamin D3',
      amount: 450,
      estimated: '15 mins',
      date: '2024-10-09'
    },
    {
      id: 'ORD002',
      status: 'Processing',
      items: 'Blood Pressure Monitor',
      amount: 2500,
      estimated: '2 hours',
      date: '2024-10-09'
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="bg-teal-600 px-4 py-6">
        <Text className="text-white text-2xl font-bold">My Orders</Text>
      </View>

      <ScrollView className="flex-1 px-4 py-4">
        {orders.map((order) => (
          <View key={order.id} className="bg-white p-4 rounded-xl mb-3">
            <Text className="font-bold text-gray-800">{order.id}</Text>
            <Text className="text-gray-600">{order.items}</Text>
            <Text className="text-gray-800 font-bold">Rs. {order.amount}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}