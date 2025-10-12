import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator, Modal, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../config/api';

interface CartItem {
  medicineId: string;
  medicineName: string;
  pharmacyId: string;
  pharmacyName: string;
  price: number;
  quantity: number;
}

export default function CheckoutScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Parse cart data from params
  const cartData = params.cartData ? JSON.parse(params.cartData as string) : [];
  const totalAmount = params.total ? parseFloat(params.total as string) : 0;

  const [deliveryAddress, setDeliveryAddress] = useState({
    street: '',
    city: '',
    postalCode: '',
    phone: ''
  });

  const [paymentMethod] = useState<'cash'>('cash'); // Only cash on delivery for now
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Custom alert state for web compatibility
  const [customAlert, setCustomAlert] = useState<{
    visible: boolean;
    title: string;
    message: string;
    buttons: { text: string; onPress?: () => void; style?: string }[];
  }>({
    visible: false,
    title: '',
    message: '',
    buttons: [],
  });

  // Calculate delivery fee (simple logic)
  const deliveryFee = totalAmount > 500 ? 0 : 100;
  const grandTotal = totalAmount + deliveryFee;

  // Custom alert function that works on both web and mobile
  const showAlert = (
    title: string,
    message: string,
    buttons: { text: string; onPress?: () => void; style?: string }[] = [{ text: 'OK' }]
  ) => {
    if (Platform.OS === 'web') {
      // Use custom modal for web
      setCustomAlert({
        visible: true,
        title,
        message,
        buttons,
      });
    } else {
      // Use native Alert for mobile
      Alert.alert(title, message, buttons as any);
    }
  };

  const closeCustomAlert = () => {
    setCustomAlert({ visible: false, title: '', message: '', buttons: [] });
  };

  const handlePlaceOrder = async () => {
    console.log('🛒 Place Order button clicked');
    console.log('   Delivery Address:', deliveryAddress);
    
    // Validate delivery address - detailed checks
    if (!deliveryAddress.street) {
      console.log('❌ VALIDATION: Missing street address');
      showAlert(
        'Incomplete Delivery Information',
        'Please enter your street address to continue with the order.',
        [{ text: 'OK' }]
      );
      return;
    }

    if (!deliveryAddress.city) {
      console.log('❌ VALIDATION: Missing city');
      showAlert(
        'Incomplete Delivery Information',
        'Please enter your city to continue with the order.',
        [{ text: 'OK' }]
      );
      return;
    }

    if (!deliveryAddress.phone) {
      console.log('❌ VALIDATION: Missing phone number');
      showAlert(
        'Incomplete Delivery Information',
        'Please enter your phone number so we can contact you for delivery updates.',
        [{ text: 'OK' }]
      );
      return;
    }

    // Validate phone number format (basic)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(deliveryAddress.phone.replace(/\s/g, ''))) {
      console.log('❌ VALIDATION: Invalid phone number format');
      showAlert(
        'Invalid Phone Number',
        'Please enter a valid 10-digit phone number.',
        [{ text: 'OK' }]
      );
      return;
    }

    console.log('✅ VALIDATION: All delivery information complete');

    try {
      setIsPlacingOrder(true);

      // Get customer ID from AsyncStorage or backend
      let finalUserId = await AsyncStorage.getItem('userId');
      
      console.log('🔍 Checking userId in AsyncStorage:', finalUserId);
      
      // If userId not in storage, get it from backend (user is still authenticated via token)
      if (!finalUserId) {
        console.warn('⚠️ No userId in AsyncStorage, fetching from backend...');
        
        try {
          // Backend validates token automatically via api interceptor
          const userResponse = await api.get('/users/user-details');
          console.log('📦 User details response:', userResponse.data);
          
          // Extract userId from various possible response structures
          const userData = userResponse.data.data || userResponse.data.user || userResponse.data;
          finalUserId = userData._id || userData.id;
          
          if (finalUserId) {
            await AsyncStorage.setItem('userId', finalUserId);
            console.log('✅ Retrieved and saved userId from backend:', finalUserId);
          } else {
            throw new Error('No user ID in response');
          }
        } catch (err: any) {
          console.error('❌ Failed to get user details:', err);
          
          // Check if it's an authentication error
          if (err.response?.status === 401) {
            showAlert('Session Expired', 'Please login again to continue', [
              {
                text: 'OK',
                onPress: () => router.replace('/screens/login')
              }
            ]);
          } else {
            showAlert('Error', 'Unable to verify user. Please try again or login.');
          }
          return;
        }
      }
      
      console.log('✅ Using userId for order:', finalUserId);

      // Prepare order data for backend
      const orderData = {
        customer: finalUserId,
        items: cartData.map((item: CartItem) => ({
          medicine: item.medicineId,
          quantity: item.quantity,
          price: item.price,
          discount: 0
        })),
        deliveryAddress: `${deliveryAddress.street}, ${deliveryAddress.city}, ${deliveryAddress.postalCode || ''}\nPhone: ${deliveryAddress.phone}${specialInstructions ? '\nInstructions: ' + specialInstructions : ''}`,
        status: 'pending',
        paymentMethod: 'cash_on_delivery',
        totalAmount: grandTotal,
        deliveryFee: deliveryFee
      };

      console.log('📦 Placing order:', orderData);

      // Send order to backend: POST /api/orders/
      const response = await api.post('/orders', orderData);

      console.log('✅ Order response received:', response.data);
      console.log('   Response keys:', Object.keys(response.data));
      console.log('   Has success?', response.data.success);
      console.log('   Has order?', response.data.order);
      console.log('   Has data?', response.data.data);

      // Extract order from various possible response structures
      const order = response.data.order || response.data.data || response.data;
      const orderId = order?.orderId || (order?._id ? `Order #${order._id.slice(-6).toUpperCase()}` : 'Your order');
      
      console.log('📦 Order created:', order);
      console.log('🆔 Order ID:', orderId);
      console.log('🔍 Response status:', response.status);

      // Clear loading state first
      setIsPlacingOrder(false);

      // Show success message and redirect to home
      console.log('🎉 Order placed successfully!');
      console.log('   Order ID:', orderId);
      console.log('   Total:', grandTotal);
      
      showAlert(
        'Order Placed Successfully! 🎉',
        `${orderId}\nTotal: LKR ${grandTotal.toFixed(2)}\n\nYour order has been confirmed and will be delivered soon.\n\nPayment: Cash on Delivery`,
        [
          {
            text: 'OK',
            onPress: () => {
              console.log('🔄 Redirecting to home page...');
              router.replace('/home');
            }
          }
        ]
      );
      
      console.log('✅ Success alert shown');
    } catch (error: any) {
      console.error('❌ Order placement error:', error);
      console.error('   Error response:', error.response?.data);
      setIsPlacingOrder(false);
      showAlert('Order Failed', error.response?.data?.message || 'Failed to place order. Please try again.');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-teal-600 px-4 py-4">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <AntDesign name="arrowleft" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold">Checkout</Text>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Order Summary */}
        <View className="bg-white m-4 rounded-xl p-4 shadow-sm">
          <Text className="text-lg font-bold text-gray-900 mb-3">Order Summary</Text>
          
          {cartData.map((item: CartItem, index: number) => (
            <View key={index} className="flex-row justify-between items-start mb-3 pb-3 border-b border-gray-100">
              <View className="flex-1 pr-3">
                <Text className="font-semibold text-gray-900">{item.medicineName}</Text>
                <Text className="text-xs text-gray-500 mt-1">
                  🏢 {item.pharmacyName}
                </Text>
                <Text className="text-xs text-gray-600 mt-1">
                  Qty: {item.quantity} × LKR {item.price.toFixed(2)}
                </Text>
              </View>
              <Text className="font-bold text-teal-600">
                LKR {(item.price * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}

          {/* Price Breakdown */}
          <View className="mt-3 pt-3 border-t-2 border-gray-200">
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-700">Subtotal:</Text>
              <Text className="text-gray-900 font-semibold">LKR {totalAmount.toFixed(2)}</Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-700">Delivery Fee:</Text>
              <Text className="text-gray-900 font-semibold">
                {deliveryFee === 0 ? 'FREE' : `LKR ${deliveryFee.toFixed(2)}`}
              </Text>
            </View>
            {deliveryFee === 0 && (
              <Text className="text-xs text-green-600 mb-2">🎉 Free delivery on orders over LKR 500</Text>
            )}
            <View className="flex-row justify-between mt-2 pt-2 border-t border-gray-200">
              <Text className="text-lg font-bold text-gray-900">Total:</Text>
              <Text className="text-xl font-bold text-teal-600">LKR {grandTotal.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Delivery Address */}
        <View className="bg-white m-4 rounded-xl p-4 shadow-sm">
          <View className="flex-row items-center mb-3">
            <Ionicons name="location" size={20} color="#41A67E" />
            <Text className="text-lg font-bold text-gray-900 ml-2">Delivery Address</Text>
          </View>

          <View className="mb-3">
            <Text className="text-sm text-gray-700 mb-1">Street Address *</Text>
            <TextInput
              className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-3 text-gray-900"
              placeholder="123 Main Street"
              value={deliveryAddress.street}
              onChangeText={(text) => setDeliveryAddress({...deliveryAddress, street: text})}
            />
          </View>

          <View className="flex-row gap-3 mb-3">
            <View className="flex-1">
              <Text className="text-sm text-gray-700 mb-1">City *</Text>
              <TextInput
                className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-3 text-gray-900"
                placeholder="Colombo"
                value={deliveryAddress.city}
                onChangeText={(text) => setDeliveryAddress({...deliveryAddress, city: text})}
              />
            </View>
            <View className="flex-1">
              <Text className="text-sm text-gray-700 mb-1">Postal Code</Text>
              <TextInput
                className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-3 text-gray-900"
                placeholder="00100"
                value={deliveryAddress.postalCode}
                onChangeText={(text) => setDeliveryAddress({...deliveryAddress, postalCode: text})}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View className="mb-3">
            <Text className="text-sm text-gray-700 mb-1">Contact Phone *</Text>
            <TextInput
              className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-3 text-gray-900"
              placeholder="+94 71 234 5678"
              value={deliveryAddress.phone}
              onChangeText={(text) => setDeliveryAddress({...deliveryAddress, phone: text})}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* Payment Method */}
        <View className="bg-white m-4 rounded-xl p-4 shadow-sm">
          <View className="flex-row items-center mb-3">
            <Ionicons name="cash" size={20} color="#41A67E" />
            <Text className="text-lg font-bold text-gray-900 ml-2">Payment Method</Text>
          </View>

          <View className="flex-row items-center p-4 rounded-lg border-2 border-teal-600 bg-teal-50">
            <Ionicons name="radio-button-on" size={24} color="#41A67E" />
            <View className="ml-3 flex-1">
              <Text className="font-bold text-teal-700 text-base">Cash on Delivery</Text>
              <Text className="text-xs text-teal-600 mt-1">Pay when you receive your order</Text>
              <View className="bg-teal-100 px-2 py-1 rounded-md mt-2 self-start">
                <Text className="text-teal-800 text-xs font-semibold">✓ Selected</Text>
              </View>
            </View>
            <Ionicons name="cash-outline" size={32} color="#41A67E" />
          </View>

          <View className="mt-3 bg-gray-50 rounded-lg p-3 border border-gray-200">
            <Text className="text-xs text-gray-600">
              💡 Tip: Please have exact change ready. Card and online payment options coming soon!
            </Text>
          </View>
        </View>

        {/* Special Instructions */}
        <View className="bg-white m-4 rounded-xl p-4 shadow-sm">
          <View className="flex-row items-center mb-3">
            <Ionicons name="chatbox" size={20} color="#41A67E" />
            <Text className="text-lg font-bold text-gray-900 ml-2">Special Instructions</Text>
          </View>

          <TextInput
            className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-3 text-gray-900"
            placeholder="Any special delivery instructions? (optional)"
            value={specialInstructions}
            onChangeText={setSpecialInstructions}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        {/* Order Summary Card */}
        <View className="bg-teal-50 m-4 rounded-xl p-4 border border-teal-200">
          <View className="flex-row items-center mb-2">
            <Ionicons name="information-circle" size={20} color="#41A67E" />
            <Text className="text-teal-800 font-semibold ml-2">Order Information</Text>
          </View>
          <Text className="text-sm text-teal-700">
            • {cartData.length} item(s) from {new Set(cartData.map((i: CartItem) => i.pharmacyName)).size} pharmacy(ies)
          </Text>
          <Text className="text-sm text-teal-700">
            • Payment: {paymentMethod === 'cash' ? 'Cash on Delivery' : paymentMethod === 'card' ? 'Card Payment' : 'Online Banking'}
          </Text>
          <Text className="text-sm text-teal-700">
            • Estimated delivery: 30-45 minutes
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Bar - Place Order */}
      <View className="bg-white border-t border-gray-200 px-4 py-4">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-gray-700 font-semibold">Grand Total:</Text>
          <Text className="text-2xl font-bold text-teal-600">LKR {grandTotal.toFixed(2)}</Text>
        </View>

        <TouchableOpacity
          onPress={handlePlaceOrder}
          disabled={isPlacingOrder}
          className={`rounded-xl py-4 flex-row items-center justify-center ${
            isPlacingOrder ? 'bg-gray-400' : 'bg-teal-600'
          }`}
        >
          {isPlacingOrder ? (
            <>
              <ActivityIndicator size="small" color="white" />
              <Text className="text-white font-bold text-lg ml-2">
                Placing Order...
              </Text>
            </>
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={24} color="white" />
              <Text className="text-white font-bold text-lg ml-2">
                Place Order
              </Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-gray-100 rounded-xl py-3 mt-2 items-center"
        >
          <Text className="text-gray-700 font-semibold">Back to Cart</Text>
        </TouchableOpacity>
      </View>

      {/* Custom Alert Modal (for web compatibility) */}
      <Modal
        visible={customAlert.visible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeCustomAlert}
      >
        <View className="flex-1 bg-black/50 justify-center items-center px-4">
          <View className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            {/* Title */}
            <Text className="text-xl font-bold text-gray-800 mb-3">
              {customAlert.title}
            </Text>
            
            {/* Message */}
            <Text className="text-gray-600 text-base mb-6 leading-6">
              {customAlert.message}
            </Text>
            
            {/* Buttons */}
            <View className="flex-row gap-3">
              {customAlert.buttons.map((button, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    closeCustomAlert();
                    button.onPress?.();
                  }}
                  className={`flex-1 py-3 rounded-lg ${
                    button.style === 'cancel' 
                      ? 'bg-gray-200' 
                      : button.style === 'destructive'
                      ? 'bg-red-600'
                      : 'bg-teal-600'
                  }`}
                >
                  <Text className={`text-center font-semibold ${
                    button.style === 'cancel' 
                      ? 'text-gray-700' 
                      : 'text-white'
                  }`}>
                    {button.text}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

