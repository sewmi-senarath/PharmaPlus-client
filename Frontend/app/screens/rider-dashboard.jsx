import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Linking,
  Platform,
  Alert,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

interface Order {
  id: string;
  distance: string;
  eta: string;
  pickupFrom: string;
  pickupAddress: string;
  deliverTo: string;
  deliverAddress: string;
  items: string;
  total: string;
  status: 'pickup' | 'transit' | 'completed';
  customerPhone?: string;
  deliveryLat?: number;
  deliveryLng?: number;
  hasAudio?: boolean;
  warning?: string;
}

export default function RiderDashboard() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const riderId = params.riderId ;
  const riderName = (params.riderName ) || 'Kasun Perera';

  const [isOnline, setIsOnline] = useState(true);
  const [activeTab, setActiveTab] = useState<'active' | 'completed' | 'voice'>('active');
  
  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [voiceCommand, setVoiceCommand] = useState('');
  const [recognizedText, setRecognizedText] = useState('');
  const pulseAnim = useState(new Animated.Value(1))[0];

  const activeOrders: Order[] = [
    {
      id: 'ORD001',
      distance: '2.5 km',
      eta: '15 mins',
      pickupFrom: 'City Pharmacy',
      pickupAddress: '120 Main Street, Colombo 01',
      deliverTo: 'Jane Smith',
      deliverAddress: '45 Galle Road, Colombo 03',
      items: 'Paracetamol 500mg, Vitamin C',
      total: '₹420',
      status: 'pickup',
      customerPhone: '+94771234567',
      deliveryLat: 6.9271,
      deliveryLng: 79.8612,
      hasAudio: true,
      warning: 'Take with food. Audio instructions available.',
    },
    {
      id: 'ORD002',
      distance: '1.2 km',
      eta: '8 mins',
      pickupFrom: 'Health Plus Pharmacy',
      pickupAddress: '25 Temple Road, Kandy',
      deliverTo: 'John Doe',
      deliverAddress: '78 Lake View, Kandy',
      items: 'Antibiotics, Pain Relief',
      total: '₹850',
      status: 'transit',
      customerPhone: '+94772345678',
      deliveryLat: 7.2906,
      deliveryLng: 80.6337,
    },
  ];

  const completedOrders: Order[] = [
    {
      id: 'ORD003',
      distance: '3.0 km',
      eta: 'Completed',
      pickupFrom: 'MediCare Pharmacy',
      pickupAddress: '50 Hospital Road, Colombo 05',
      deliverTo: 'Sarah Williams',
      deliverAddress: '12 Park Street, Colombo 07',
      items: 'Insulin, Glucose Monitor',
      total: '₹1500',
      status: 'completed',
    },
  ];

  // Voice commands list
  const voiceCommands = [
    { command: 'Pickup confirmed', action: 'confirm_pickup', icon: 'checkmark-circle' },
    { command: 'In transit', action: 'in_transit', icon: 'car' },
    { command: 'Delivered', action: 'delivered', icon: 'checkmark-done' },
    { command: 'Delay reported', action: 'delay', icon: 'time' },
    { command: 'Customer unavailable', action: 'customer_unavailable', icon: 'person-remove' },
    { command: 'Need help', action: 'help', icon: 'help-circle' },
  ];

  // Pulse animation for recording
  useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.3,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isRecording]);

  const handleCallCustomer = (phoneNumber: string) => {
    const phoneUrl = Platform.OS === 'ios' ? `telprompt:${phoneNumber}` : `tel:${phoneNumber}`;
    Linking.openURL(phoneUrl).catch(() => 
      Alert.alert('Error', 'Unable to make phone call')
    );
  };

  const handleNavigate = (lat?: number, lng?: number) => {
    if (!lat || !lng) {
      Alert.alert('Error', 'Location coordinates not available');
      return;
    }
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    Linking.openURL(url).catch(() =>
      Alert.alert('Error', 'Unable to open maps')
    );
  };

  const handleConfirmPickup = (orderId: string) => {
    Alert.alert('Success', `Order ${orderId} pickup confirmed!`);
  };

  const handleQRCode = () => {
    Alert.alert('QR Code', 'Opening QR Code scanner...');
  };

  const handleAudio = () => {
    Alert.alert('Audio', 'Playing audio instructions...');
  };

  const handleViewOrderDetails = (orderId: string) => {
    router.push({
      pathname: '/screens/order-details',
      params: { orderId }
    });
  };

  const handleViewProfile = () => {
    router.push('/screens/profile');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => router.replace('/') }
      ]
    );
  };

  // Voice recording functions
  const startVoiceRecording = () => {
    setIsRecording(true);
    setRecognizedText('Listening...');
    
    // Simulate voice recognition (in production, use expo-speech-recognition or similar)
    setTimeout(() => {
      const randomCommands = [
        'Pickup confirmed for Order 001',
        'In transit to delivery location',
        'Delivered successfully',
        'Customer unavailable, trying again',
      ];
      const randomText = randomCommands[Math.floor(Math.random() * randomCommands.length)];
      setRecognizedText(randomText);
      setIsRecording(false);
    }, 3000);
  };

  const stopVoiceRecording = () => {
    setIsRecording(false);
    setRecognizedText('');
  };

  const handleVoiceCommand = (command: string, action: string) => {
    setVoiceCommand(command);
    Alert.alert('Voice Command', `Executing: ${command}`, [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Confirm', 
        onPress: () => {
          Alert.alert('Success', `${command} executed successfully!`);
          setVoiceCommand('');
        }
      }
    ]);
  };

  const renderOrder = (order: Order) => (
    <View key={order.id} className="bg-white rounded-lg p-4 mb-4 shadow-sm">
      <TouchableOpacity 
        onPress={() => handleViewOrderDetails(order.id)}
        className="flex-row justify-between items-center mb-3"
      >
        <Text className="text-lg font-bold text-gray-900">{order.id}</Text>
        {order.status === 'pickup' && (
          <View className="bg-blue-100 px-3 py-1 rounded">
            <Text className="text-blue-600 text-xs font-semibold">Pick Up</Text>
          </View>
        )}
        {order.status === 'transit' && (
          <View className="bg-orange-100 px-3 py-1 rounded">
            <Text className="text-orange-600 text-xs font-semibold">In Transit</Text>
          </View>
        )}
        {order.status === 'completed' && (
          <View className="bg-green-100 px-3 py-1 rounded">
            <Text className="text-green-600 text-xs font-semibold">Completed</Text>
          </View>
        )}
      </TouchableOpacity>

      <Text className="text-sm text-gray-600 mb-4">
        {order.distance} • ETA: {order.eta}
      </Text>

      <View className="border-l-4 border-blue-500 pl-3 mb-3">
        <Text className="text-xs text-gray-500 mb-1">Pickup from:</Text>
        <Text className="text-sm font-semibold text-gray-900">{order.pickupFrom}</Text>
        <Text className="text-xs text-gray-600">{order.pickupAddress}</Text>
      </View>

      <View className="border-l-4 border-green-500 pl-3 mb-3">
        <Text className="text-xs text-gray-500 mb-1">Deliver to:</Text>
        <Text className="text-sm font-semibold text-gray-900">{order.deliverTo}</Text>
        <Text className="text-xs text-gray-600">{order.deliverAddress}</Text>
      </View>

      <View className="mb-3">
        <Text className="text-xs text-gray-500 mb-1">Items:</Text>
        <Text className="text-sm text-gray-900">{order.items}</Text>
        <Text className="text-sm font-bold text-teal-600 mt-1">Total: {order.total}</Text>
      </View>

      {order.warning && (
        <View className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3 flex-row items-start">
          <Text className="text-yellow-600 mr-2">⚠️</Text>
          <Text className="text-xs text-yellow-800 flex-1">{order.warning}</Text>
        </View>
      )}

      {order.hasAudio && (
        <View className="flex-row gap-2 mb-3">
          <TouchableOpacity 
            onPress={handleQRCode}
            className="flex-1 flex-row items-center justify-center bg-gray-100 py-2 rounded-lg"
          >
            <MaterialIcons name="qr-code" size={16} color="#4B5563" />
            <Text className="text-sm text-gray-700 ml-2">QR Code</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={handleAudio}
            className="flex-1 flex-row items-center justify-center bg-gray-100 py-2 rounded-lg"
          >
            <Ionicons name="volume-high" size={16} color="#4B5563" />
            <Text className="text-sm text-gray-700 ml-2">Audio</Text>
          </TouchableOpacity>
        </View>
      )}

      <View className="flex-row gap-2">
        {order.customerPhone && order.status !== 'completed' && (
          <TouchableOpacity
            onPress={() => handleCallCustomer(order.customerPhone!)}
            className="flex-1 flex-row items-center justify-center bg-white border border-gray-300 py-3 rounded-lg"
          >
            <Ionicons name="call" size={16} color="#4B5563" />
            <Text className="text-sm text-gray-700 ml-2">Call</Text>
          </TouchableOpacity>
        )}
        {order.status !== 'completed' && (
          <TouchableOpacity
            onPress={() => handleNavigate(order.deliveryLat, order.deliveryLng)}
            className="flex-1 flex-row items-center justify-center bg-white border border-gray-300 py-3 rounded-lg"
          >
            <Ionicons name="navigate" size={16} color="#4B5563" />
            <Text className="text-sm text-gray-700 ml-2">Navigate</Text>
          </TouchableOpacity>
        )}
      </View>

      {order.status === 'pickup' && (
        <TouchableOpacity
          onPress={() => handleConfirmPickup(order.id)}
          className="mt-2 bg-teal-600 py-3 rounded-lg flex-row items-center justify-center"
        >
          <Ionicons name="checkmark-circle" size={18} color="white" />
          <Text className="text-white font-semibold ml-2">Confirm Pickup</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  // Voice Tab Content
  const renderVoiceTab = () => (
    <View className="p-4">
      {/* Voice Recording Section */}
      <View className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl p-6 mb-6 shadow-lg">
        <Text className="text-white text-xl font-bold mb-2 text-center">
          Voice Commands
        </Text>
        <Text className="text-teal-100 text-sm mb-6 text-center">
          Update delivery status hands-free
        </Text>

        {/* Recording Button */}
        <View className="items-center mb-4">
          <TouchableOpacity
            onPress={isRecording ? stopVoiceRecording : startVoiceRecording}
            className="relative"
          >
            <Animated.View 
              style={{ 
                transform: [{ scale: pulseAnim }],
              }}
              className={`w-24 h-24 rounded-full items-center justify-center ${
                isRecording ? 'bg-red-500' : 'bg-white'
              }`}
            >
              <Ionicons 
                name={isRecording ? 'stop' : 'mic'} 
                size={48} 
                color={isRecording ? 'white' : '#0d9488'} 
              />
            </Animated.View>
          </TouchableOpacity>
          
          <Text className="text-white font-semibold mt-4 text-lg">
            {isRecording ? 'Tap to Stop' : 'Tap to Speak'}
          </Text>
        </View>

        {/* Recognized Text */}
        {recognizedText && (
          <View className="bg-white/20 rounded-xl p-4 backdrop-blur">
            <Text className="text-white text-center italic">
              "{recognizedText}"
            </Text>
          </View>
        )}
      </View>

      {/* Quick Voice Commands */}
      <View className="mb-4">
        <Text className="text-lg font-bold text-gray-900 mb-3">
          Quick Commands
        </Text>
        <Text className="text-sm text-gray-600 mb-4">
          Tap any command to execute or use voice
        </Text>
      </View>

      {voiceCommands.map((cmd, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => handleVoiceCommand(cmd.command, cmd.action)}
          className="bg-white rounded-xl p-4 mb-3 shadow-sm flex-row items-center border border-gray-200"
        >
          <View className="w-12 h-12 bg-teal-100 rounded-full items-center justify-center mr-4">
            <Ionicons name={cmd.icon as any} size={24} color="#0d9488" />
          </View>
          <View className="flex-1">
            <Text className="text-gray-900 font-semibold text-base">
              {cmd.command}
            </Text>
            <Text className="text-gray-500 text-xs mt-1">
              Say or tap to execute
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>
      ))}

      {/* Voice Tips */}
      <View className="bg-blue-50 rounded-xl p-4 mt-4 border border-blue-200">
        <View className="flex-row items-center mb-2">
          <Ionicons name="information-circle" size={20} color="#3B82F6" />
          <Text className="text-blue-900 font-semibold ml-2">Voice Tips</Text>
        </View>
        <Text className="text-blue-800 text-sm">
          • Speak clearly and say "Order" followed by the order number{'\n'}
          • Say commands like "Pickup confirmed" or "In transit"{'\n'}
          • Works even when driving with Bluetooth headset{'\n'}
          • All commands are logged for your safety
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView>
        {/* Header */}
        <View className="bg-teal-600 pt-4 pb-6 px-4">
          <View className="flex-row justify-between items-center mb-4">
            <View>
              <Text className="text-white text-xl font-bold">Rider Dashboard</Text>
              <Text className="text-teal-100 text-sm">{riderName}</Text>
            </View>
            <View className="flex-row gap-2 items-center">
              {/* Profile Avatar */}
              <TouchableOpacity
                onPress={handleViewProfile}
                className="w-10 h-10 bg-white rounded-full items-center justify-center border-2 border-teal-300"
              >
                <Ionicons name="person" size={20} color="#0d9488" />
              </TouchableOpacity>

              {/* Online/Offline Toggle */}
              <TouchableOpacity
                onPress={() => setIsOnline(!isOnline)}
                className={`px-4 py-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}
              >
                <Text className="text-white font-semibold">
                  {isOnline ? 'Online' : 'Offline'}
                </Text>
              </TouchableOpacity>

              {/* Logout */}
              <TouchableOpacity
                onPress={handleLogout}
                className="px-3 py-2 rounded-full bg-red-500"
              >
                <Ionicons name="log-out-outline" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Stats */}
          <View className="bg-white rounded-lg p-4">
            <View className="flex-row items-center mb-3">
              <View className="w-2 h-2 bg-green-500 rounded-full mr-2" />
              <Text className="text-sm text-gray-600">Online at Colombo 03</Text>
            </View>
            <Text className="text-gray-600 text-sm">
              Today: 12 deliveries • ₹2400
            </Text>
          </View>
        </View>

        {/* Tabs */}
        <View className="flex-row bg-white border-b border-gray-200 px-4">
          <TouchableOpacity
            onPress={() => setActiveTab('active')}
            className={`flex-1 py-4 ${activeTab === 'active' ? 'border-b-2 border-teal-600' : ''}`}
          >
            <Text className={`text-center font-semibold ${activeTab === 'active' ? 'text-teal-600' : 'text-gray-500'}`}>
              Active (2)
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab('completed')}
            className={`flex-1 py-4 ${activeTab === 'completed' ? 'border-b-2 border-teal-600' : ''}`}
          >
            <Text className={`text-center font-semibold ${activeTab === 'completed' ? 'text-teal-600' : 'text-gray-500'}`}>
              Completed
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab('voice')}
            className={`flex-1 py-4 ${activeTab === 'voice' ? 'border-b-2 border-teal-600' : ''}`}
          >
            <View className="flex-row items-center justify-center">
              <Ionicons 
                name="mic" 
                size={16} 
                color={activeTab === 'voice' ? '#0d9488' : '#6B7280'} 
              />
              <Text className={`text-center font-semibold ml-1 ${activeTab === 'voice' ? 'text-teal-600' : 'text-gray-500'}`}>
                Voice
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Content */}
        {activeTab === 'active' && (
          <View className="p-4">
            {activeOrders.map(renderOrder)}
          </View>
        )}
        {activeTab === 'completed' && (
          <View className="p-4">
            {completedOrders.map(renderOrder)}
          </View>
        )}
        {activeTab === 'voice' && renderVoiceTab()}
      </ScrollView>
    </SafeAreaView>
  );
}
