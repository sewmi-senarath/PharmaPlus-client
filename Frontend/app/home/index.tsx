import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, Modal } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useRouter, useLocalSearchParams } from 'expo-router';

// Translation object
const translations = {
  en: {
    appName: 'Pharma Plus',
    welcome: 'Welcome, John!',
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
    welcome: 'வரவேற்கிறோம், ஜான்!',
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
    welcome: 'ආයුබෝවන්, ජෝන්!',
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

export default function HomeScreen() {
  const router = useRouter();
  const { userRole } = useLocalSearchParams(); // Get the role
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>('en'); // Add type here
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false); // Add this

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

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="bg-teal-600 px-4 py-6 pb-8">
          <View className="flex-row justify-between items-start">
            <View className="flex-1">
              <Text className="text-white text-2xl font-bold">{t('appName')}</Text>
              <Text className="text-white text-lg mt-2">{t('welcome')}</Text>
              <Text className="text-teal-100 text-sm">
                {userRole === 'Customer' ? t('healthStatus') : 
                 userRole === 'Pharmacist' ? 'Pharmacy Dashboard' : 
                 'Admin Dashboard'}
              </Text>
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

        {/* Medical Information - Now translated */}
        <View className="mx-4 mt-6 bg-yellow-50 p-4 rounded-xl border border-yellow-200">
          <Text className="text-lg font-bold text-gray-800 mb-3">{t('medicalInfo')}</Text>
          
          <View className="mb-3">
            <Text className="text-sm font-semibold text-gray-700">{t('allergies')}</Text>
            <Text className="text-gray-600">Penicillin, Shellfish</Text>
          </View>
          
          <View className="mb-3">
            <Text className="text-sm font-semibold text-gray-700">{t('currentMeds')}</Text>
            <Text className="text-gray-600">Metformin, Atorvastatin</Text>
          </View>
          
          <View className="mb-3">
            <Text className="text-sm font-semibold text-gray-700">{t('medicalConditions')}</Text>
            <Text className="text-gray-600">Type 2 Diabetes, Hypertension</Text>
          </View>
          
          <View className="mb-4">
            <Text className="text-sm font-semibold text-gray-700">{t('bloodType')}</Text>
            <Text className="text-gray-600">O+</Text>
          </View>
          
          <TouchableOpacity className="bg-yellow-600 py-3 rounded-lg">
            <Text className="text-white text-center font-semibold">{t('shareMedicalInfo')}</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions - Now translated */}
        <View className="mx-4 mt-6">
          <Text className="text-lg font-bold text-gray-800 mb-3">{t('quickActions')}</Text>
          <View className="flex-row flex-wrap gap-3">
            <TouchableOpacity className="bg-white p-6 rounded-xl flex-1 items-center min-w-[45%]">
              <AntDesign name="plus" size={32} color="#41A67E" />
              <Text className="text-gray-700 font-semibold mt-2">{t('orderMedicine')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity className="bg-white p-6 rounded-xl flex-1 items-center min-w-[45%]">
              <AntDesign name="customerservice" size={32} color="#41A67E" />
              <Text className="text-gray-700 font-semibold mt-2">{t('voiceSearch')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity className="bg-white p-6 rounded-xl flex-1 items-center min-w-[45%]">
              <AntDesign name="link" size={32} color="#41A67E" />
              <Text className="text-gray-700 font-semibold mt-2">{t('medicationReminders')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity className="bg-white p-6 rounded-xl flex-1 items-center min-w-[45%]">
              <AntDesign name="shoppingcart" size={32} color="#41A67E" />
              <Text className="text-gray-700 font-semibold mt-2">{t('trackOrder')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Active Orders - Now translated */}
        <View className="mx-4 mt-6 mb-6">
          <Text className="text-lg font-bold text-gray-800 mb-3">{t('activeOrders')}</Text>
          
          <View className="bg-white p-4 rounded-xl mb-3">
            <View className="flex-row justify-between items-start mb-2">
              <Text className="font-bold text-gray-800">Order #ORD001</Text>
              <View className="bg-green-100 px-3 py-1 rounded-full">
                <Text className="text-green-700 text-xs font-semibold">{t('outForDelivery')}</Text>
              </View>
            </View>
            <Text className="text-gray-600 text-sm mb-1">Paracetamol 500mg, Vitamin D3</Text>
            <Text className="text-gray-800 font-semibold mb-1">Rs. 450</Text>
            <Text className="text-gray-500 text-xs mb-3">{t('estimated')}: 15 mins</Text>
            <TouchableOpacity className="bg-teal-600 py-2 rounded-lg">
              <Text className="text-white text-center font-semibold">{t('track')}</Text>
            </TouchableOpacity>
          </View>

          <View className="bg-white p-4 rounded-xl">
            <View className="flex-row justify-between items-start mb-2">
              <Text className="font-bold text-gray-800">Order #ORD002</Text>
              <View className="bg-blue-100 px-3 py-1 rounded-full">
                <Text className="text-blue-700 text-xs font-semibold">{t('processing')}</Text>
              </View>
            </View>
            <Text className="text-gray-600 text-sm mb-1">Blood Pressure Monitor</Text>
            <Text className="text-gray-800 font-semibold mb-1">Rs. 2,500</Text>
            <Text className="text-gray-500 text-xs mb-3">{t('estimated')}: 2 hours</Text>
            <TouchableOpacity className="bg-teal-600 py-2 rounded-lg">
              <Text className="text-white text-center font-semibold">{t('track')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}