import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, Modal, ActivityIndicator, Alert, Linking, Platform } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import api from '../../config/api';
import { medicationService } from '../../services/medicationService';

// Translation object
const translations = {
  en: {
    appName: 'Pharma Plus',
    welcome: 'Welcome',
    healthStatus: 'Health Status',
    selectLanguage: 'Select Language',
    emergencyServices: 'Emergency Services',
    callAmbulance: 'Call Ambulance',
    shareLocation: 'Share Location',
    emergencyContacts: 'Emergency Contacts',
    ambulance: 'Ambulance',
    hospital: 'Hospital',
    poisonControl: 'Poison Control',
    available247: '24/7 Available',
    medicalInfo: 'Medical Information',
    allergies: 'Allergies',
    currentMeds: 'Current Medications',
    medicalConditions: 'Medical Conditions',
    bloodType: 'Blood Type',
    shareMedicalInfo: 'Share Medical Info',
    quickActions: 'Quick Actions',
    orderMedicine: 'Order Medicine',
    voiceSearch: 'Voice Search',
    medicationReminders: 'Medication Reminders',
    trackOrder: 'Track Order',
    activeOrders: 'Active Orders',
    outForDelivery: 'Out for Delivery',
    processing: 'Processing',
    estimated: 'Estimated',
    track: 'Track',
  },
  ta: {
    appName: 'பார்மா பிளஸ்',
    welcome: 'வரவேற்கிறோம்',
    healthStatus: 'சுகாதார நிலை',
    selectLanguage: 'மொழியைத் தேர்ந்தெடுக்கவும்',
    emergencyServices: 'அவசர சேவைகள்',
    callAmbulance: 'ஆம்புலன்ஸ் அழைக்கவும்',
    shareLocation: 'இருப்பிடத்தைப் பகிரவும்',
    emergencyContacts: 'அவசர தொடர்புகள்',
    ambulance: 'ஆம்புலன்ஸ்',
    hospital: 'மருத்துவமனை',
    poisonControl: 'விஷ கட்டுப்பாடு',
    available247: '24/7 கிடைக்கும்',
    medicalInfo: 'மருத்துவ தகவல்',
    allergies: 'ஒவ்வாமை',
    currentMeds: 'தற்போதைய மருந்துகள்',
    medicalConditions: 'மருத்துவ நிலைகள்',
    bloodType: 'இரத்த வகை',
    shareMedicalInfo: 'மருத்துவ தகவலைப் பகிரவும்',
    quickActions: 'விரைவு செயல்கள்',
    orderMedicine: 'மருந்து ஆர்டர்',
    voiceSearch: 'குரல் தேடல்',
    medicationReminders: 'மருந்து நினைவூட்டல்கள்',
    trackOrder: 'ஆர்டரைக் கண்காணிக்கவும்',
    activeOrders: 'செயலில் உள்ள ஆர்டர்கள்',
    outForDelivery: 'டெலிவரிக்கு வெளியே',
    processing: 'செயலாக்கம்',
    estimated: 'மதிப்பிடப்பட்டது',
    track: 'கண்காணிக்கவும்',
  },
  si: {
    appName: 'ෆාර්මා ප්ලස්',
    welcome: 'ආයුබෝවන්',
    healthStatus: 'සෞඛ්‍ය තත්ත්වය',
    selectLanguage: 'භාෂාව තෝරන්න',
    emergencyServices: 'හදිසි සේවා',
    callAmbulance: 'ගිලන් රථය ඇමතීම',
    shareLocation: 'ස්ථානය බෙදාගන්න',
    emergencyContacts: 'හදිසි සම්බන්ධතා',
    ambulance: 'ගිලන් රථය',
    hospital: 'රෝහල',
    poisonControl: 'විෂ පාලනය',
    available247: '24/7 ලබා ගත හැක',
    medicalInfo: 'වෛද්‍ය තොරතුරු',
    allergies: 'අසාත්මිකතා',
    currentMeds: 'වත්මන් ඖෂධ',
    medicalConditions: 'වෛද්‍ය තත්ත්වයන්',
    bloodType: 'රුධිර වර්ගය',
    shareMedicalInfo: 'වෛද්‍ය තොරතුරු බෙදාගන්න',
    quickActions: 'ඉක්මන් ක්‍රියා',
    orderMedicine: 'ඖෂධ ඇණවුම්',
    voiceSearch: 'හඬ සෙවීම',
    medicationReminders: 'ඖෂධ සිහිකැඳවීම්',
    trackOrder: 'ඇණවුම නිරීක්ෂණය',
    activeOrders: 'ක්‍රියාකාරී ඇණවුම්',
    outForDelivery: 'බෙදාහැරීමට පිටත්',
    processing: 'සැකසෙමින්',
    estimated: 'ඇස්තමේන්තුගත',
    track: 'නිරීක්ෂණය',
  },
};

// Add type for language codes
type LanguageCode = 'en' | 'ta' | 'si';

interface Order {
  _id: string;
  orderId: string;
  items: any[];
  status: 'pending' | 'processing' | 'packed' | 'on_the_way' | 'delivered' | 'cancelled' | 'returned';
  createdAt: string;
  totalAmount?: number;
}

interface Medication {
  id?: string;
  _id?: string;
  name: string;
  dosage: string;
  frequency: string;
  time: string;
  notes?: string;
  startDate: string;
  endDate?: string;
}

interface Pharmacy {
  _id: string;
  pharmacyName: string;
  pharmacyOwnerName: string;
  phoneNumber: string;
  email: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    geo?: {
      type: string;
      coordinates: [number, number];
    };
  };
  isAvailable: boolean;
  distance?: number;
}

export default function HomeScreen() {
  const router = useRouter();
  const { userRole } = useLocalSearchParams(); // Get the role
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>('en'); // Add type here
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false); // Add this
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loadingMedications, setLoadingMedications] = useState(true);
  const [nearbyPharmacies, setNearbyPharmacies] = useState<Pharmacy[]>([]);
  const [loadingPharmacies, setLoadingPharmacies] = useState(true);

  const languages = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'ta', label: 'தமிழ்', flag: '🇱🇰' },
    { code: 'si', label: 'සිංහල', flag: '🇱🇰' },
  ];

  // Get translation function
  const t = (key: string) => (translations[selectedLanguage] as any)[key] || key;

  const handleLanguageSelect = (code: string) => {
    setSelectedLanguage(code as LanguageCode); // Add type assertion here
    setShowLanguageModal(false);
  };

  // Fetch active orders, medications, and nearby pharmacies on mount
  useEffect(() => {
    fetchActiveOrders();
    fetchMedications();
    requestLocationAndFetchPharmacies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Refresh active orders when screen comes into focus (e.g., after placing an order)
  useFocusEffect(
    useCallback(() => {
      console.log('🏠 Home screen focused - refreshing active orders...');
      fetchActiveOrders();
    }, [])
  );

  const fetchActiveOrders = async () => {
    try {
      setLoadingOrders(true);
      
      // Check all stored auth data
      const authToken = await AsyncStorage.getItem('authToken');
      const userRole = await AsyncStorage.getItem('userRole');
      let userId = await AsyncStorage.getItem('userId');
      
      console.log('🔍 HOME: Checking AsyncStorage...');
      console.log('   authToken exists:', !!authToken);
      console.log('   userRole:', userRole);
      console.log('   userId from storage:', userId);
      
      // If userId not in storage, try to get it from backend
      if (!userId && authToken) {
        console.warn('⚠️ HOME: No userId in AsyncStorage, fetching from backend...');
        
        try {
          const userResponse = await api.get('/users/user-details');
          console.log('📦 HOME: User details response:', userResponse.data);
          
          const userData = userResponse.data.data || userResponse.data.user || userResponse.data;
          userId = userData._id || userData.id;
          
          if (userId) {
            await AsyncStorage.setItem('userId', userId);
            console.log('✅ HOME: Retrieved and saved userId from backend:', userId);
          } else {
            console.error('❌ HOME: No userId in backend response');
            setActiveOrders([]);
            return;
          }
        } catch (err: any) {
          console.error('❌ HOME: Failed to fetch user details:', err);
          setActiveOrders([]);
          return;
        }
      }
      
      if (!userId) {
        console.warn('⚠️ HOME: Still no userId available, cannot fetch orders');
        setActiveOrders([]);
        return;
      }

      console.log('📦 HOME: Fetching active orders for customer:', userId);
      console.log('   API endpoint: /orders/customer/' + userId);
      
      const response = await api.get(`/orders/customer/${userId}`);
      
      console.log('📦 HOME: Orders response:', response.data);

      if (response.data.success || response.data.orders) {
        const ordersData = response.data.orders || response.data.data || [];
        
        console.log('📦 HOME: Total orders fetched:', ordersData.length);
        
        // Filter for active orders only (not delivered, cancelled, or returned)
        const active = ordersData.filter((order: Order) => 
          order.status !== 'delivered' && 
          order.status !== 'cancelled' && 
          order.status !== 'returned'
        );
        
        console.log('🚀 HOME: Active orders (filtered):', active.length);
        
        // Sort by date (newest first)
        const sortedActive = active.sort((a: Order, b: Order) => {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        
        setActiveOrders(sortedActive);
        console.log('✅ HOME: Active orders loaded and displayed:', sortedActive.length);
        
        if (sortedActive.length > 0) {
          console.log('🆕 HOME: Latest active order:', sortedActive[0].orderId || sortedActive[0]._id);
        }
      } else {
        console.warn('⚠️ HOME: No orders in response');
        setActiveOrders([]);
      }
    } catch (error: any) {
      console.error('❌ HOME: Error fetching active orders:', error);
      console.error('   Error status:', error.response?.status);
      console.error('   Error message:', error.response?.data?.message);
      setActiveOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'packed': return 'bg-purple-100 text-purple-800';
      case 'on_the_way': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'processing': return 'Processing';
      case 'packed': return 'Packed';
      case 'on_the_way': return 'On the Way';
      default: return status;
    }
  };

  // Fetch medications
  const fetchMedications = async () => {
    try {
      setLoadingMedications(true);
      const meds = await medicationService.getAll();
      
      // Filter for active medications (not expired)
      const today = new Date();
      const activeMeds = meds.filter((med: Medication) => {
        if (med.endDate) {
          const endDate = new Date(med.endDate);
          return endDate >= today;
        }
        return true; // No end date means it's ongoing
      });
      
      setMedications(activeMeds);
      console.log('💊 Active medications loaded:', activeMeds.length);
    } catch (error: any) {
      console.error('❌ Error fetching medications:', error);
      setMedications([]);
    } finally {
      setLoadingMedications(false);
    }
  };

  const getNextDoseTime = (medication: Medication): string => {
    const times = medication.time.split(',').map(t => t.trim());
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    for (const time of times) {
      const [hour, minute] = time.replace(/AM|PM/i, '').trim().split(':').map(t => parseInt(t.trim()));
      const isPM = time.toUpperCase().includes('PM');
      const hour24 = isPM && hour !== 12 ? hour + 12 : (!isPM && hour === 12 ? 0 : hour);
      const timeInMinutes = hour24 * 60 + minute;

      if (timeInMinutes > currentTime) {
        return time;
      }
    }
    
    // If no upcoming dose today, return first dose time
    return times[0];
  };

  // Calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return parseFloat(distance.toFixed(2));
  };

  // Request location permission and fetch nearby pharmacies
  const requestLocationAndFetchPharmacies = useCallback(async () => {
    const fetchNearbyPharmaciesInternal = async (lng: number, lat: number) => {
      try {
        console.log('🏥 Fetching nearby pharmacies...');
        const maxDistance = 5000; // 5km radius
        
        const response = await api.get('/pharmacy/nearby', {
          params: { lng, lat, maxDistance }
        });

        console.log('✅ Nearby pharmacies response:', response.data);

        if (response.data.success) {
          const pharmaciesData = response.data.data || [];
          
          // Calculate distance for each pharmacy
          const pharmaciesWithDistance = pharmaciesData.map((pharmacy: Pharmacy) => {
            if (pharmacy.address?.geo?.coordinates) {
              const [pLng, pLat] = pharmacy.address.geo.coordinates;
              const distance = calculateDistance(lat, lng, pLat, pLng);
              return { ...pharmacy, distance };
            }
            return pharmacy;
          });

          // Sort by distance (closest first)
          pharmaciesWithDistance.sort((a, b) => (a.distance || 0) - (b.distance || 0));
          
          setNearbyPharmacies(pharmaciesWithDistance);
          console.log('🏥 Nearby pharmacies loaded:', pharmaciesWithDistance.length);
        } else {
          setNearbyPharmacies([]);
        }
      } catch (error: any) {
        console.error('❌ Error fetching nearby pharmacies:', error);
        setNearbyPharmacies([]);
      } finally {
        setLoadingPharmacies(false);
      }
    };

    try {
      setLoadingPharmacies(true);
      
      console.log('📍 Requesting location permission...');
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        console.warn('⚠️ Location permission denied');
        setNearbyPharmacies([]);
        setLoadingPharmacies(false);
        return;
      }

      console.log('✅ Location permission granted, getting current position...');
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = location.coords;
      console.log('📍 User location:', latitude, longitude);
      
      // Fetch nearby pharmacies
      await fetchNearbyPharmaciesInternal(longitude, latitude);
    } catch (error: any) {
      console.error('❌ Error getting location:', error);
      setNearbyPharmacies([]);
      setLoadingPharmacies(false);
    }
  }, []);

  // Open phone dialer
  const callPharmacy = (phoneNumber: string) => {
    const phoneUrl = Platform.OS === 'ios' ? `telprompt:${phoneNumber}` : `tel:${phoneNumber}`;
    Linking.openURL(phoneUrl).catch(err => {
      Alert.alert('Error', 'Unable to make phone call');
      console.error('Call error:', err);
    });
  };

  // Open maps with directions
  const getDirections = (pharmacy: Pharmacy) => {
    if (!pharmacy.address?.geo?.coordinates) {
      Alert.alert('Error', 'Location not available for this pharmacy');
      return;
    }

    const [lng, lat] = pharmacy.address.geo.coordinates;
    const url = Platform.select({
      ios: `maps:?daddr=${lat},${lng}`,
      android: `google.navigation:q=${lat},${lng}`,
      default: `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
    });

    Linking.openURL(url!).catch(err => {
      Alert.alert('Error', 'Unable to open maps');
      console.error('Maps error:', err);
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="bg-teal-600 px-4 py-6 pb-8">
          <View className="flex-row justify-between items-start">
            <View className="flex-1">
              <Text className="text-white text-2xl font-bold">{t('appName')}</Text>
              <Text className="text-white text-lg mt-2">{t('welcome')}</Text>
              {userRole === 'Customer' && (
                <Text className="text-teal-100 text-sm">
                  {t('healthStatus')}
                </Text>
              )}
            </View>
            
            <View className="flex-row items-center gap-3">
              {/* Emergency Button */}
              {userRole === 'Customer' && (
                <TouchableOpacity 
                  className="bg-red-500 rounded-full w-10 h-10 items-center justify-center"
                  onPress={() => setShowEmergencyModal(true)}
                >
                  <AntDesign name="warning" size={24} color="white" />
                </TouchableOpacity>
              )}

              {/* Language Selector */}
              <TouchableOpacity 
                className="bg-white/20 rounded-lg px-3 py-2 flex-row items-center"
                onPress={() => setShowLanguageModal(true)}
              >
                <Text className="text-white font-semibold mr-1">
                  {languages.find(l => l.code === selectedLanguage)?.flag}
                </Text>
                <Text className="text-white font-semibold">
                  {languages.find(l => l.code === selectedLanguage)?.label}
                </Text>
              </TouchableOpacity>

              {/* Add Payment Button HERE */}
              <TouchableOpacity 
                onPress={() => router.push('/home/payment')}
                className="bg-white/30 rounded-full w-10 h-10 items-center justify-center"
              >
                <AntDesign name="creditcard" size={20} color="white" />
              </TouchableOpacity>
              
              {/* Profile Icon */}
              <TouchableOpacity 
                onPress={() => router.push('/home/profile')}
                className="bg-white/30 rounded-full w-10 h-10 items-center justify-center"
              >
                <AntDesign name="user" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Language Modal */}
        <Modal
          visible={showLanguageModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowLanguageModal(false)}
        >
          <TouchableOpacity 
            className="flex-1 bg-black/50 justify-center items-center"
            activeOpacity={1}
            onPress={() => setShowLanguageModal(false)}
          >
            <View className="bg-white rounded-2xl p-6 w-80 max-w-[90%]">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-xl font-bold text-gray-800">{t('selectLanguage')}</Text>
                <TouchableOpacity onPress={() => setShowLanguageModal(false)}>
                  <AntDesign name="close" size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>

              {languages.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  className={`flex-row items-center justify-between p-4 rounded-xl mb-2 ${
                    selectedLanguage === lang.code ? 'bg-teal-50 border-2 border-teal-600' : 'bg-gray-50'
                  }`}
                  onPress={() => handleLanguageSelect(lang.code)}
                >
                  <View className="flex-row items-center">
                    <Text className="text-2xl mr-3">{lang.flag}</Text>
                    <Text className={`text-lg font-semibold ${
                      selectedLanguage === lang.code ? 'text-teal-600' : 'text-gray-800'
                    }`}>
                      {lang.label}
                    </Text>
                  </View>
                  {selectedLanguage === lang.code && (
                    <AntDesign name="check" size={24} color="#41A67E" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Emergency Modal - Add this */}
        <Modal
          visible={showEmergencyModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowEmergencyModal(false)}
        >
          <View className="flex-1 bg-black/50 justify-end">
            <View className="bg-white rounded-t-3xl p-6 max-h-[80%]">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-2xl font-bold text-red-600">
                  {t('emergencyServices')}
                </Text>
                <TouchableOpacity onPress={() => setShowEmergencyModal(false)}>
                  <AntDesign name="close" size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Emergency Buttons */}
                <View className="flex-row gap-3 mb-6">
                  <TouchableOpacity className="flex-1 bg-red-600 py-4 rounded-lg flex-row items-center justify-center">
                    <AntDesign name="car" size={20} color="white" />
                    <Text className="text-white font-semibold ml-2">{t('callAmbulance')}</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity className="flex-1 bg-teal-600 py-4 rounded-lg flex-row items-center justify-center">
                    <AntDesign name="enviromento" size={20} color="white" />
                    <Text className="text-white font-semibold ml-2">{t('shareLocation')}</Text>
                  </TouchableOpacity>
                </View>

                {/* Emergency Contacts */}
                <Text className="text-lg font-bold text-gray-800 mb-3">{t('emergencyContacts')}</Text>
                
                <TouchableOpacity className="bg-gray-50 p-4 rounded-xl mb-3 flex-row items-center justify-between">
                  <View className="flex-row items-center flex-1">
                    <View className="bg-red-100 p-3 rounded-full">
                      <AntDesign name="car" size={24} color="#DC2626" />
                    </View>
                    <View className="ml-4 flex-1">
                      <Text className="font-semibold text-gray-800">{t('ambulance')}</Text>
                      <Text className="text-gray-600">1990</Text>
                      <View className="bg-green-100 px-2 py-1 rounded mt-1 self-start">
                        <Text className="text-green-700 text-xs">{t('available247')}</Text>
                      </View>
                    </View>
                  </View>
                  <AntDesign name="phone" size={24} color="#41A67E" />
                </TouchableOpacity>

                <TouchableOpacity className="bg-gray-50 p-4 rounded-xl mb-3 flex-row items-center justify-between">
                  <View className="flex-row items-center flex-1">
                    <View className="bg-blue-100 p-3 rounded-full">
                      <AntDesign name="medicinebox" size={24} color="#2563EB" />
                    </View>
                    <View className="ml-4 flex-1">
                      <Text className="font-semibold text-gray-800">{t('hospital')}</Text>
                      <Text className="text-gray-600">+94 11 234 5678</Text>
                      <Text className="text-gray-500 text-xs">2.3 km</Text>
                      <View className="bg-green-100 px-2 py-1 rounded mt-1 self-start">
                        <Text className="text-green-700 text-xs">{t('available247')}</Text>
                      </View>
                    </View>
                  </View>
                  <AntDesign name="phone" size={24} color="#41A67E" />
                </TouchableOpacity>

                <TouchableOpacity className="bg-gray-50 p-4 rounded-xl mb-3 flex-row items-center justify-between">
                  <View className="flex-row items-center flex-1">
                    <View className="bg-purple-100 p-3 rounded-full">
                      <AntDesign name="warning" size={24} color="#9333EA" />
                    </View>
                    <View className="ml-4 flex-1">
                      <Text className="font-semibold text-gray-800">{t('poisonControl')}</Text>
                      <Text className="text-gray-600">+94 11 269 1111</Text>
                      <View className="bg-green-100 px-2 py-1 rounded mt-1 self-start">
                        <Text className="text-green-700 text-xs">{t('available247')}</Text>
                      </View>
                    </View>
                  </View>
                  <AntDesign name="phone" size={24} color="#41A67E" />
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>


        {/* Quick Actions - Now translated */}
        <View className="mx-4 mt-6">
          <Text className="text-lg font-bold text-gray-800 mb-3">{t('quickActions')}</Text>
          <View className="flex-row flex-wrap gap-3">

            <TouchableOpacity className="bg-white p-6 rounded-xl flex-1 items-center min-w-[45%]"
              onPress={() => router.push('/usermain_page/order-medition')}

            >
              <AntDesign name="plus" size={32} color="#41A67E" />
              <Text className="text-gray-700 font-semibold mt-2">{t('orderMedicine')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="bg-white p-6 rounded-xl flex-1 items-center min-w-[45%]"
              onPress={() => router.push('/home/search')}
            >
              <AntDesign name="sound" size={32} color="#41A67E" />
              <Text className="text-gray-700 font-semibold mt-2">{t('voiceSearch')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="bg-white p-6 rounded-xl flex-1 items-center min-w-[45%]"
              onPress={() => router.push('/home/medications')}
            >
              <AntDesign name="link" size={32} color="#41A67E" />
              <Text className="text-gray-700 font-semibold mt-2">{t('medicationReminders')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="bg-white p-6 rounded-xl flex-1 items-center min-w-[45%]"
              onPress={() => router.push('/home/orders')}
            >
              <AntDesign name="rocket1" size={32} color="#41A67E" />
              <Text className="text-gray-700 font-semibold mt-2">{t('trackOrder')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Active Orders Section */}
        <View className="mx-4 mt-6 mb-6">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-lg font-bold text-gray-800">{t('activeOrders')}</Text>
            <View className="flex-row items-center gap-3">
              <TouchableOpacity 
                onPress={fetchActiveOrders}
                disabled={loadingOrders}
              >
                <Ionicons 
                  name="refresh" 
                  size={20} 
                  color={loadingOrders ? '#D1D5DB' : '#41A67E'} 
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/home/orders')}>
                <Text className="text-teal-600 font-semibold">View All</Text>
              </TouchableOpacity>
            </View>
          </View>

          {loadingOrders ? (
            <View className="bg-white rounded-xl p-6 items-center">
              <ActivityIndicator size="large" color="#41A67E" />
              <Text className="text-gray-500 mt-3">Loading orders...</Text>
            </View>
          ) : activeOrders.length === 0 ? (
            <View className="bg-white rounded-xl p-6 items-center">
              <AntDesign name="inbox" size={48} color="#D1D5DB" />
              <Text className="text-gray-500 mt-3 text-center">No active orders</Text>
              <Text className="text-gray-400 text-sm text-center mt-1">
                Your active orders will appear here
              </Text>
            </View>
          ) : (
            <View>
              {activeOrders.slice(0, 3).map((order) => (
                <TouchableOpacity
                  key={order._id}
                  className="bg-white rounded-xl p-4 mb-3 shadow-sm"
                  onPress={() => router.push('/home/orders')}
                >
                  <View className="flex-row justify-between items-start mb-2">
                    <View>
                      <Text className="font-bold text-gray-800 text-base">
                        {order.orderId || `Order #${order._id.slice(-6).toUpperCase()}`}
                      </Text>
                      <Text className="text-gray-500 text-xs mt-1">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </Text>
                    </View>
                    <View className={`px-3 py-1 rounded-full ${getStatusColor(order.status)}`}>
                      <Text className="text-xs font-semibold">
                        {getStatusText(order.status)}
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row justify-between items-center mt-3 pt-3 border-t border-gray-100">
                    <View>
                      <Text className="text-gray-600 text-xs">
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                      </Text>
                      {order.totalAmount && (
                        <Text className="text-gray-800 font-bold mt-1">
                          LKR {order.totalAmount.toFixed(2)}
                        </Text>
                      )}
                    </View>
                    <TouchableOpacity
                      className="bg-teal-50 px-4 py-2 rounded-lg"
                      onPress={() => router.push('/home/orders')}
                    >
                      <Text className="text-teal-600 font-semibold text-sm">
                        {t('track')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))}
              
              {activeOrders.length > 3 && (
                <TouchableOpacity
                  className="bg-teal-50 rounded-xl p-4 items-center"
                  onPress={() => router.push('/home/orders')}
                >
                  <Text className="text-teal-600 font-semibold">
                    View {activeOrders.length - 3} more order{activeOrders.length - 3 !== 1 ? 's' : ''}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        {/* Medications Section */}
        <View className="mx-4 mt-6 mb-6">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-lg font-bold text-gray-800">{t('currentMeds')}</Text>
            <TouchableOpacity onPress={() => router.push('/home/medications')}>
              <Text className="text-teal-600 font-semibold">View All</Text>
            </TouchableOpacity>
          </View>

          {loadingMedications ? (
            <View className="bg-white rounded-xl p-6 items-center">
              <ActivityIndicator size="large" color="#41A67E" />
              <Text className="text-gray-500 mt-3">Loading medications...</Text>
            </View>
          ) : medications.length === 0 ? (
            <View className="bg-white rounded-xl p-6 items-center">
              <Ionicons name="medical-outline" size={48} color="#D1D5DB" />
              <Text className="text-gray-500 mt-3 text-center">No medications</Text>
              <Text className="text-gray-400 text-sm text-center mt-1">
                Add your medication reminders to track doses
              </Text>
              <TouchableOpacity
                className="bg-teal-600 px-6 py-3 rounded-lg mt-4"
                onPress={() => router.push('/home/medications')}
              >
                <Text className="text-white font-semibold">Add Medication</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              {medications.slice(0, 3).map((medication) => (
                <TouchableOpacity
                  key={medication.id || medication._id}
                  className="bg-white rounded-xl p-4 mb-3 shadow-sm"
                  onPress={() => router.push('/home/medications')}
                >
                  <View className="flex-row items-start">
                    <View className="bg-teal-100 rounded-full p-3">
                      <Ionicons name="medical" size={24} color="#41A67E" />
                    </View>
                    
                    <View className="flex-1 ml-4">
                      <Text className="font-bold text-gray-800 text-base">
                        {medication.name}
                      </Text>
                      <Text className="text-gray-600 text-sm mt-1">
                        {medication.dosage} • {medication.frequency}
                      </Text>
                      
                      <View className="flex-row items-center mt-2">
                        <Ionicons name="time-outline" size={16} color="#6B7280" />
                        <Text className="text-gray-500 text-xs ml-1">
                          Next dose: {getNextDoseTime(medication)}
                        </Text>
                      </View>
                      
                      {medication.notes && (
                        <View className="bg-gray-50 rounded-lg p-2 mt-2">
                          <Text className="text-gray-600 text-xs">
                            💡 {medication.notes}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
              
              {medications.length > 3 && (
                <TouchableOpacity
                  className="bg-teal-50 rounded-xl p-4 items-center"
                  onPress={() => router.push('/home/medications')}
                >
                  <Text className="text-teal-600 font-semibold">
                    View {medications.length - 3} more medication{medications.length - 3 !== 1 ? 's' : ''}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        {/* Nearby Pharmacies Section */}
        <View className="mx-4 mt-6 mb-6">
          <View className="flex-row justify-between items-center mb-3">
            <View className="flex-row items-center">
              <Ionicons name="location" size={24} color="#41A67E" />
              <Text className="text-lg font-bold text-gray-800 ml-2">Nearby Pharmacies</Text>
            </View>
            {nearbyPharmacies.length > 0 && (
              <TouchableOpacity onPress={requestLocationAndFetchPharmacies}>
                <Ionicons name="refresh" size={20} color="#41A67E" />
              </TouchableOpacity>
            )}
          </View>

          {loadingPharmacies ? (
            <View className="bg-white rounded-xl p-6 items-center">
              <ActivityIndicator size="large" color="#41A67E" />
              <Text className="text-gray-500 mt-3">Finding nearby pharmacies...</Text>
            </View>
          ) : nearbyPharmacies.length === 0 ? (
            <View className="bg-white rounded-xl p-6 items-center">
              <Ionicons name="business-outline" size={48} color="#D1D5DB" />
              <Text className="text-gray-500 mt-3 text-center">No nearby pharmacies found</Text>
              <Text className="text-gray-400 text-sm text-center mt-1">
                Unable to find pharmacies within 5km radius
              </Text>
              <TouchableOpacity
                className="bg-teal-600 px-6 py-3 rounded-lg mt-4 flex-row items-center"
                onPress={requestLocationAndFetchPharmacies}
              >
                <Ionicons name="refresh" size={20} color="white" />
                <Text className="text-white font-semibold ml-2">Retry</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              {nearbyPharmacies.slice(0, 3).map((pharmacy) => (
                <View
                  key={pharmacy._id}
                  className="bg-white rounded-xl p-4 mb-3 shadow-sm"
                >
                  <View className="flex-row justify-between items-start mb-3">
                    <View className="flex-1">
                      <Text className="font-bold text-gray-800 text-base">
                        {pharmacy.pharmacyName}
                      </Text>
                      <Text className="text-gray-600 text-sm mt-1">
                        {pharmacy.address.street}, {pharmacy.address.city}
                      </Text>
                      
                      {pharmacy.distance && (
                        <View className="flex-row items-center mt-2">
                          <Ionicons name="location-outline" size={16} color="#41A67E" />
                          <Text className="text-teal-600 text-sm font-semibold ml-1">
                            {pharmacy.distance} km away
                          </Text>
                        </View>
                      )}
                    </View>
                    
                    {pharmacy.isAvailable && (
                      <View className="bg-green-100 px-3 py-1 rounded-full">
                        <Text className="text-green-700 text-xs font-semibold">Open</Text>
                      </View>
                    )}
                  </View>

                  <View className="flex-row gap-2">
                    <TouchableOpacity
                      className="flex-1 bg-teal-50 py-3 rounded-lg flex-row items-center justify-center"
                      onPress={() => callPharmacy(pharmacy.phoneNumber)}
                    >
                      <Ionicons name="call" size={18} color="#41A67E" />
                      <Text className="text-teal-600 font-semibold ml-2">Call</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      className="flex-1 bg-teal-600 py-3 rounded-lg flex-row items-center justify-center"
                      onPress={() => getDirections(pharmacy)}
                    >
                      <Ionicons name="navigate" size={18} color="white" />
                      <Text className="text-white font-semibold ml-2">Directions</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
              
              {nearbyPharmacies.length > 3 && (
                <View className="bg-teal-50 rounded-xl p-4">
                  <Text className="text-teal-600 font-semibold text-center">
                    {nearbyPharmacies.length - 3} more pharmacies nearby
                  </Text>
                  <Text className="text-gray-500 text-xs text-center mt-1">
                    Use &ldquo;Order Medicine&rdquo; to see all pharmacies
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}