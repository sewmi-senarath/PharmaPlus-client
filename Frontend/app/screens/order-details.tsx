import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function OrderDetails() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const orderId = params.orderId as string;

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Order Details',
          headerShown: true,
        }} 
      />
      <SafeAreaView className="flex-1 bg-gray-50">
        <ScrollView className="p-4">
          <View className="bg-white rounded-lg p-4 mb-4">
            <Text className="text-2xl font-bold mb-4 text-gray-900">
              {orderId}
            </Text>
            
            <View className="mb-4">
              <Text className="text-gray-600 mb-2">Status</Text>
              <View className="bg-blue-100 px-4 py-2 rounded inline-flex">
                <Text className="text-blue-600 font-semibold">In Progress</Text>
              </View>
            </View>

            <View className="mb-4">
              <Text className="text-gray-600 mb-2">Customer</Text>
              <Text className="text-gray-900 font-semibold">Jane Smith</Text>
              <Text className="text-gray-600">+94 77 123 4567</Text>
            </View>

            <View className="mb-4">
              <Text className="text-gray-600 mb-2">Delivery Address</Text>
              <Text className="text-gray-900">45 Galle Road, Colombo 03</Text>
            </View>

            <View className="mb-4">
              <Text className="text-gray-600 mb-2">Items</Text>
              <Text className="text-gray-900">• Paracetamol 500mg</Text>
              <Text className="text-gray-900">• Vitamin C</Text>
            </View>

            <View className="mb-4">
              <Text className="text-gray-600 mb-2">Total Amount</Text>
              <Text className="text-2xl font-bold text-teal-600">₹420</Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-teal-600 py-4 rounded-lg"
          >
            <Text className="text-white text-center font-semibold text-lg">
              Back to Dashboard
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}