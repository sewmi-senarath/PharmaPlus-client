import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../config/api';
import { useRouter, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

interface OrderItem {
  medicine: {
    _id: string;
    medicineName: string;
    dosage?: string;
    doseForm?: string;
  };
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  orderId: string;
  customer: string;
  items: OrderItem[];
  deliveryAddress: string;
  status: 'pending' | 'processing' | 'packed' | 'on_the_way' | 'delivered' | 'cancelled' | 'returned';
  createdAt: string;
  totalAmount?: number;
}

export default function OrdersScreen() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  // Refresh orders when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      console.log('📱 Orders screen focused, refreshing...');
      fetchOrders();
    }, [])
  );

  const fetchOrders = async () => {
    try {
      setLoading(true);

      // Get customer ID from AsyncStorage
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        console.warn('No userId found');
        setOrders([]);
        return;
      }

      console.log('📦 Fetching orders for customer:', userId);

      // Fetch orders from backend: GET /api/orders/customer/:customerId
      const response = await api.get(`/orders/customer/${userId}`);

      console.log('✅ Orders response:', response.data);

      if (response.data.success || response.data.orders) {
        const ordersData = response.data.orders || response.data.data || [];
        
        // Sort orders by date (newest first)
        const sortedOrders = ordersData.sort((a: Order, b: Order) => {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        
        setOrders(sortedOrders);
        console.log('📋 Orders loaded:', sortedOrders.length);
        
        if (sortedOrders.length > 0) {
          console.log('🆕 Latest order:', sortedOrders[0].orderId || sortedOrders[0]._id);
        }
      } else {
        setOrders([]);
      }
    } catch (error: any) {
      console.error('❌ Error fetching orders:', error);
      if (error.response?.status !== 404) {
        Alert.alert('Error', error.response?.data?.message || 'Failed to load orders');
      }
      setOrders([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'processing': return 'bg-blue-100 text-blue-700';
      case 'packed': return 'bg-purple-100 text-purple-700';
      case 'on_the_way': return 'bg-orange-100 text-orange-700';
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      case 'returned': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return 'time-outline';
      case 'processing': return 'hourglass-outline';
      case 'packed': return 'cube-outline';
      case 'on_the_way': return 'car-outline';
      case 'delivered': return 'checkmark-circle-outline';
      case 'cancelled': return 'close-circle-outline';
      case 'returned': return 'return-up-back-outline';
      default: return 'help-outline';
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="bg-teal-600 px-4 py-6">
        <Text className="text-white text-2xl font-bold">My Orders</Text>
        <Text className="text-teal-100 text-sm mt-1">
          {orders.length} {orders.length === 1 ? 'order' : 'orders'} found
        </Text>
      </View>

      <ScrollView 
        className="flex-1 px-4 py-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#41A67E']} />
        }
      >
        {loading ? (
          <View className="items-center justify-center py-20">
            <ActivityIndicator size="large" color="#41A67E" />
            <Text className="text-gray-600 mt-3">Loading orders...</Text>
          </View>
        ) : orders.length === 0 ? (
          <View className="items-center justify-center py-20">
            <Ionicons name="receipt-outline" size={64} color="#D1D5DB" />
            <Text className="text-gray-600 mt-3 text-lg">No orders yet</Text>
            <Text className="text-gray-500 text-sm">Your orders will appear here</Text>
            <TouchableOpacity
              onPress={() => router.push('/home/order-medicine')}
              className="bg-teal-600 rounded-xl px-6 py-3 mt-4"
            >
              <Text className="text-white font-semibold">Start Shopping</Text>
            </TouchableOpacity>
          </View>
        ) : (
          orders.map((order, index) => {
            const isLatest = index === 0; // First order is the newest
            
            return (
              <View 
                key={order._id} 
                className={`rounded-xl p-4 mb-3 shadow-sm ${
                  isLatest ? 'bg-teal-50 border-2 border-teal-500' : 'bg-white'
                }`}
              >
                {/* Latest Order Badge */}
                {isLatest && (
                  <View className="bg-teal-600 rounded-full px-3 py-1 self-start mb-2">
                    <Text className="text-white text-xs font-bold">🆕 Latest Order</Text>
                  </View>
                )}
                
                {/* Order Header */}
                <View className="flex-row justify-between items-start mb-3">
                <View>
                  <Text className="font-bold text-gray-900 text-base">
                    {order.orderId || `Order #${order._id.slice(-6).toUpperCase()}`}
                  </Text>
                  <Text className="text-xs text-gray-500 mt-1">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Text>
                </View>
                <View className={`px-3 py-1 rounded-full ${getStatusColor(order.status)}`}>
                  <Text className={`text-xs font-semibold ${getStatusColor(order.status).split(' ')[1]}`}>
                    {getStatusText(order.status)}
                  </Text>
                </View>
              </View>

              {/* Order Items */}
              <View className="mb-3">
                <Text className="text-xs text-gray-500 mb-2">Items:</Text>
                {order.items.map((item, index) => (
                  <View key={index} className="flex-row justify-between mb-1">
                    <Text className="text-sm text-gray-700 flex-1">
                      {item.medicine?.medicineName || 'Medicine'} × {item.quantity}
                    </Text>
                    <Text className="text-sm text-gray-900 font-semibold">
                      LKR {(item.price * item.quantity).toFixed(2)}
                    </Text>
          </View>
        ))}
              </View>

              {/* Delivery Address */}
              <View className="mb-3 pb-3 border-t border-gray-100 pt-3">
                <Text className="text-xs text-gray-500 mb-1">Delivery Address:</Text>
                <Text className="text-sm text-gray-700" numberOfLines={2}>
                  {order.deliveryAddress}
                </Text>
              </View>

              {/* Total & Status Icon */}
              <View className="flex-row items-center justify-between pt-3 border-t border-gray-100">
                <View className="flex-row items-center">
                  <Ionicons name={getStatusIcon(order.status)} size={20} color="#41A67E" />
                  <Text className="text-gray-600 text-sm ml-2">
                    {order.status === 'on_the_way' ? 'Arriving soon' : 
                     order.status === 'delivered' ? 'Completed' :
                     order.status === 'pending' ? 'Awaiting confirmation' :
                     'In progress'}
                  </Text>
                </View>
                <Text className="text-lg font-bold text-teal-600">
                  LKR {order.totalAmount?.toFixed(2) || 
                       order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
                </Text>
              </View>

              {/* Action Buttons */}
              {order.status === 'on_the_way' && (
                <TouchableOpacity className="bg-teal-600 rounded-lg py-3 mt-3 flex-row items-center justify-center">
                  <Ionicons name="location" size={18} color="white" />
                  <Text className="text-white font-semibold ml-2">Track Order</Text>
                </TouchableOpacity>
              )}
            </View>
          );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}