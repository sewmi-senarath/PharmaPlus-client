// app/pharmacy/(tabs)/orders.tsx
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { mockOrders } from '../../../lib/mock-pharmacy';

type OrderStatus = 'pending' | 'accepted' | 'in-progress' | 'completed';

export default function OrdersScreen() {
  const [orders, setOrders] = useState(mockOrders);

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return { bg: '#FEF3C7', text: '#F59E0B', border: '#FCD34D' };
      case 'accepted': return { bg: '#DBEAFE', text: '#3B82F6', border: '#93C5FD' };
      case 'in-progress': return { bg: '#E0E7FF', text: '#6366F1', border: '#C7D2FE' };
      case 'completed': return { bg: '#D1FAE5', text: '#10B981', border: '#86EFAC' };
    }
  };

  const nextStatus = (current: OrderStatus): OrderStatus => {
    const flow: Record<OrderStatus, OrderStatus> = {
      pending: 'accepted',
      accepted: 'in-progress',
      'in-progress': 'completed',
      completed: 'completed'
    };
    return flow[current];
  };

  const handleStatusUpdate = (orderId: string) => {
    setOrders(prev =>
      prev.map(o =>
        o.id === orderId
          ? { ...o, status: nextStatus(o.status) }
          : o
      )
    );
    Alert.alert('Success', 'Order status updated');
  };

  return (
    <View className="flex-1 bg-[#E6F5F3]">
      {/* Header */}
      <View className="bg-white px-4 pt-12 pb-4 border-b border-gray-200">
        <View className="flex-row items-center justify-between">
          <Text className="text-2xl font-bold text-gray-800">Orders</Text>
          <View className="bg-[#139D92] px-3 py-1 rounded-full">
            <Text className="text-white text-sm font-semibold">{orders.length}</Text>
          </View>
        </View>
        <Text className="text-gray-500 text-sm mt-1">Manage customer orders</Text>
      </View>

      <ScrollView className="flex-1 p-4">
        {orders.map(order => {
          const colors = getStatusColor(order.status);
          
          return (
            <View key={order.id} className="bg-white rounded-2xl p-4 mb-3 shadow-sm">
              {/* Order Header */}
              <View className="flex-row justify-between items-start mb-3">
                <View className="flex-1">
                  <Text className="font-bold text-gray-800 text-lg">{order.customerName}</Text>
                  <Text className="text-gray-500 text-sm">{order.customerPhone}</Text>
                </View>
                <View 
                  className="px-3 py-1 rounded-full"
                  style={{ backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.border }}
                >
                  <Text className="text-xs font-semibold" style={{ color: colors.text }}>
                    {order.status.toUpperCase()}
                  </Text>
                </View>
              </View>

              {/* Order ID & Date */}
              <View className="flex-row items-center mb-3 pb-3 border-b border-gray-100">
                <Ionicons name="receipt-outline" size={16} color="#6B7280" />
                <Text className="text-gray-600 text-sm ml-2">{order.id}</Text>
                <Text className="text-gray-400 text-sm ml-auto">
                  {new Date(order.orderDate).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </Text>
              </View>

              {/* Items */}
              <View className="mb-3">
                <Text className="text-gray-700 font-semibold text-sm mb-2">Items:</Text>
                {order.items.map((item, idx) => (
                  <View key={idx} className="flex-row justify-between mb-1">
                    <Text className="text-gray-600 text-sm flex-1">
                      {item.medicineName} x{item.quantity}
                    </Text>
                    <Text className="text-gray-800 text-sm font-medium">
                      LKR {(item.price * item.quantity).toFixed(2)}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Total & Address */}
              <View className="pt-3 border-t border-gray-100 mb-3">
                <View className="flex-row justify-between mb-2">
                  <Text className="text-gray-700 font-semibold">Total Amount</Text>
                  <Text className="text-[#139D92] font-bold text-lg">
                    LKR {order.totalAmount.toFixed(2)}
                  </Text>
                </View>
                <View className="flex-row items-start">
                  <Ionicons name="location" size={16} color="#6B7280" />
                  <Text className="text-gray-600 text-sm ml-2 flex-1">
                    {order.deliveryAddress}
                  </Text>
                </View>
              </View>

              {/* Actions */}
              {order.status !== 'completed' && (
                <TouchableOpacity
                  className="bg-[#139D92] rounded-xl py-3 items-center"
                  onPress={() => handleStatusUpdate(order.id)}
                >
                  <Text className="text-white font-semibold">
                    Mark as {nextStatus(order.status).replace('-', ' ')}
                  </Text>
                </TouchableOpacity>
              )}

              {order.status === 'completed' && (
                <View className="bg-green-50 rounded-xl py-3 items-center border border-green-200">
                  <View className="flex-row items-center">
                    <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                    <Text className="text-green-700 font-semibold ml-2">Completed</Text>
                  </View>
                </View>
              )}
            </View>
          );
        })}

        {orders.length === 0 && (
          <View className="bg-white rounded-2xl p-12 items-center">
            <Ionicons name="cart-outline" size={64} color="#D1D5DB" />
            <Text className="text-gray-600 text-center mt-4 mb-2 font-semibold">
              No orders yet
            </Text>
            <Text className="text-gray-400 text-center text-sm">
              Orders from customers will appear here
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}