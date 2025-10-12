// app/pharmacy/(tabs)/dashboard.tsx
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { mockPharmacy, mockAnalytics } from '../../../lib/mock-pharmacy';

export default function DashboardScreen() {
  const metrics = [
    { 
      title: 'Total Medicines', 
      value: mockAnalytics.totalMedicines.toString(),
      icon: 'medical' as const,
      color: '#3B82F6'
    },
    { 
      title: 'Low Stock', 
      value: mockAnalytics.lowStockCount.toString(),
      icon: 'alert-circle' as const,
      color: '#EF4444'
    },
    { 
      title: 'Expiry Alerts', 
      value: mockAnalytics.expiringCount.toString(),
      icon: 'time' as const,
      color: '#F59E0B'
    },
    { 
      title: 'Pending Orders', 
      value: mockAnalytics.pendingOrders.toString(),
      icon: 'cart' as const,
      color: '#10B981'
    },
  ];

  const actions = [
    { 
      label: 'Add Medicine', 
      to: '/pharmacy/add-medicine',
      icon: 'add-circle' as const,
      color: '#139D92'
    },
    { 
      label: 'View Inventory', 
      to: '/pharmacy/inventory',
      icon: 'list' as const,
      color: '#3B82F6'
    },
    { 
      label: 'Orders', 
      to: '/pharmacy/orders',
      icon: 'cart-outline' as const,
      color: '#8B5CF6'
    },
    { 
      label: 'Settings', 
      to: '/pharmacy/settings',
      icon: 'settings' as const,
      color: '#6B7280'
    },
  ];

  return (
    <View className="flex-1 bg-[#E6F5F3]">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32, paddingTop: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-[#139D92] mb-1">
            {mockPharmacy.name}
          </Text>
          <Text className="text-base text-gray-600">
            Welcome back! Here is your pharmacy overview
          </Text>
        </View>

        {/* Metrics Cards */}
        <View className="flex-row flex-wrap -mx-2 mb-6">
          {metrics.map((m, i) => (
            <View key={i} className="w-1/2 px-2 mb-4">
              <View className="bg-white rounded-2xl p-4 shadow-sm">
                <View className="flex-row items-center justify-between mb-2">
                  <View 
                    className="w-10 h-10 rounded-full items-center justify-center"
                    style={{ backgroundColor: m.color + '20' }}
                  >
                    <Ionicons name={m.icon} size={20} color={m.color} />
                  </View>
                </View>
                <Text className="text-2xl font-bold text-gray-800 mb-1">
                  {m.value}
                </Text>
                <Text className="text-xs text-gray-500">{m.title}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Inventory Value Card */}
        <View className="bg-gradient-to-r from-[#139D92] to-[#0F7A71] rounded-2xl p-6 mb-6 shadow-lg">
          <Text className="text-white text-sm mb-2">Total Inventory Value</Text>
          <Text className="text-white text-3xl font-bold">
            LKR {(mockAnalytics.totalInventoryValue / 1000).toFixed(1)}K
          </Text>
          <Text className="text-white/80 text-xs mt-1">
            Across {mockAnalytics.activeMedicines} active medicines
          </Text>
        </View>

        {/* Quick Actions */}
        <View className="bg-white rounded-2xl p-4 shadow-sm">
          <Text className="text-lg font-semibold text-gray-800 mb-4">
            Quick Actions
          </Text>
          <View className="flex-row flex-wrap -mx-2">
            {actions.map((a) => (
              <View key={a.label} className="w-1/2 px-2 mb-3">
                <TouchableOpacity
                  onPress={() => router.push(a.to as any)}
                  className="bg-gray-50 rounded-xl p-4 border border-gray-200"
                >
                  <View 
                    className="w-12 h-12 rounded-full items-center justify-center mb-3"
                    style={{ backgroundColor: a.color + '20' }}
                  >
                    <Ionicons name={a.icon} size={24} color={a.color} />
                  </View>
                  <Text className="text-sm font-semibold text-gray-800">
                    {a.label}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* Pharmacy Info */}
        <View className="bg-white rounded-2xl p-4 mt-4 shadow-sm">
          <Text className="text-lg font-semibold text-gray-800 mb-3">
            Pharmacy Information
          </Text>
          <View className="gap-3">
            <View className="flex-row items-center">
              <Ionicons name="location" size={18} color="#6B7280" />
              <Text className="ml-3 text-gray-600 flex-1">{mockPharmacy.address}</Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="call" size={18} color="#6B7280" />
              <Text className="ml-3 text-gray-600">{mockPharmacy.phone}</Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="mail" size={18} color="#6B7280" />
              <Text className="ml-3 text-gray-600">{mockPharmacy.email}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}