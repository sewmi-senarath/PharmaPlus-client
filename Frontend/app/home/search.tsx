import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, TextInput, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Conditionally import Voice only for native platforms
let Voice: any = null;
if (Platform.OS !== 'web') {
  try {
    Voice = require('@react-native-voice/voice');
  } catch (error) {
    console.log('Voice library not installed:', error);
  }
}

// Sample medicines database
const MEDICINES = [
  {
    id: '1',
    name: 'Paracetamol 500mg',
    category: 'Pain Relief',
    price: 150,
    inStock: true,
    description: 'For fever and pain relief',
    image: '💊',
    manufacturer: 'PharmaCo',
    requiresPrescription: false,
  },
  {
    id: '2',
    name: 'Amoxicillin 250mg',
    category: 'Antibiotics',
    price: 450,
    inStock: true,
    description: 'Antibiotic for bacterial infections',
    image: '💉',
    manufacturer: 'MediPharm',
    requiresPrescription: true,
  },
  {
    id: '3',
    name: 'Ibuprofen 400mg',
    category: 'Pain Relief',
    price: 200,
    inStock: true,
    description: 'Anti-inflammatory pain relief',
    image: '💊',
    manufacturer: 'HealthPlus',
    requiresPrescription: false,
  },
  {
    id: '4',
    name: 'Cetirizine 10mg',
    category: 'Allergy',
    price: 180,
    inStock: true,
    description: 'Antihistamine for allergies',
    image: '🌼',
    manufacturer: 'AllergyFree',
    requiresPrescription: false,
  },
  {
    id: '5',
    name: 'Omeprazole 20mg',
    category: 'Digestive',
    price: 320,
    inStock: true,
    description: 'For acid reflux and heartburn',
    image: '💊',
    manufacturer: 'GastroMed',
    requiresPrescription: false,
  },
  {
    id: '6',
    name: 'Metformin 500mg',
    category: 'Diabetes',
    price: 280,
    inStock: true,
    description: 'For type 2 diabetes management',
    image: '💉',
    manufacturer: 'DiabetesCare',
    requiresPrescription: true,
  },
  {
    id: '7',
    name: 'Atorvastatin 10mg',
    category: 'Cholesterol',
    price: 380,
    inStock: true,
    description: 'For lowering cholesterol',
    image: '💊',
    manufacturer: 'CardioHealth',
    requiresPrescription: true,
  },
  {
    id: '8',
    name: 'Vitamin D3 1000 IU',
    category: 'Vitamins',
    price: 250,
    inStock: true,
    description: 'Vitamin D supplement',
    image: '☀️',
    manufacturer: 'VitaLife',
    requiresPrescription: false,
  },
  {
    id: '9',
    name: 'Aspirin 75mg',
    category: 'Heart Health',
    price: 120,
    inStock: true,
    description: 'Low-dose aspirin for heart health',
    image: '❤️',
    manufacturer: 'CardioPlus',
    requiresPrescription: false,
  },
  {
    id: '10',
    name: 'Losartan 50mg',
    category: 'Blood Pressure',
    price: 420,
    inStock: true,
    description: 'For high blood pressure',
    image: '💊',
    manufacturer: 'BPControl',
    requiresPrescription: true,
  },
  {
    id: '11',
    name: 'Salbutamol Inhaler',
    category: 'Respiratory',
    price: 650,
    inStock: true,
    description: 'For asthma relief',
    image: '💨',
    manufacturer: 'BreathEasy',
    requiresPrescription: true,
  },
  {
    id: '12',
    name: 'Multivitamin Tablets',
    category: 'Vitamins',
    price: 350,
    inStock: true,
    description: 'Complete daily multivitamin',
    image: '🌟',
    manufacturer: 'VitaLife',
    requiresPrescription: false,
  },
];

const CATEGORIES = [
  'All',
  'Pain Relief',
  'Antibiotics',
  'Allergy',
  'Digestive',
  'Diabetes',
  'Vitamins',
  'Heart Health',
  'Blood Pressure',
  'Respiratory',
  'Cholesterol',
];

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isVoiceSearching, setIsVoiceSearching] = useState(false);
  const [cart, setCart] = useState<string[]>([]);

  // Set up voice recognition listeners
  useEffect(() => {
    if (Voice) {
      Voice.onSpeechStart = () => {
        console.log('🎤 Started listening...');
        setIsVoiceSearching(true);
      };
      
      Voice.onSpeechEnd = () => {
        console.log('🛑 Stopped listening');
        setIsVoiceSearching(false);
      };
      
      Voice.onSpeechResults = (e: any) => {
        console.log('📝 Voice results:', e.value);
        if (e.value && e.value[0]) {
          setSearchQuery(e.value[0]); // Set the recognized text as search query
          setIsVoiceSearching(false);
        }
      };
      
      Voice.onSpeechError = (e: any) => {
        console.error('❌ Voice error:', e.error);
        setIsVoiceSearching(false);
        Alert.alert('Error', 'Could not recognize speech. Please try again or check microphone permissions.');
      };

      // Cleanup
      return () => {
        Voice.destroy().then(Voice.removeAllListeners);
      };
    }
  }, []);

  // Filter medicines based on search query and category
  const filteredMedicines = MEDICINES.filter((medicine) => {
    const matchesSearch = medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      medicine.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      medicine.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || medicine.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleVoiceSearch = async () => {
    if (!Voice) {
      Alert.alert(
        'Voice Search Not Available',
        'Voice search requires the @react-native-voice/voice package.\n\nTo enable:\n1. Restart the app\n2. If still not working, run: npm install @react-native-voice/voice',
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      if (isVoiceSearching) {
        // Stop listening
        await Voice.stop();
        setIsVoiceSearching(false);
      } else {
        // Start listening
        const isAvailable = await Voice.isAvailable();
        if (!isAvailable) {
          Alert.alert(
            'Voice Not Available',
            'Voice recognition is not available on this device. Please use the keyboard to search.',
            [{ text: 'OK' }]
          );
          return;
        }
        
        await Voice.start('en-US'); // Start listening in English
        // Will automatically set isVoiceSearching to true via onSpeechStart callback
      }
    } catch (error) {
      console.error('Voice search error:', error);
      setIsVoiceSearching(false);
      Alert.alert(
        'Voice Search Error',
        'Could not start voice recognition. Please check microphone permissions and try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleAddToCart = (medicineId: string) => {
    if (cart.includes(medicineId)) {
      Alert.alert('Already in cart', 'This item is already in your cart');
    } else {
      setCart([...cart, medicineId]);
      Alert.alert('Added to cart', 'Item added successfully!');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-teal-600 px-4 py-4">
        <Text className="text-white text-2xl font-bold">Search Medicines</Text>
        <Text className="text-teal-100 text-sm">Find your medications easily</Text>
      </View>

      {/* Search Bar */}
      <View className="px-4 py-4 bg-white">
        <View className="flex-row items-center bg-gray-100 rounded-lg px-4 py-2">
          <AntDesign name="search1" size={20} color="#6B7280" />
          <TextInput
            className="flex-1 ml-2 text-gray-800"
            placeholder="Search medicines..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <AntDesign name="close" size={20} color="#6B7280" />
            </TouchableOpacity>
          )}
          <View className="w-px h-6 bg-gray-300 mx-2" />
          <TouchableOpacity
            onPress={handleVoiceSearch}
            className={`p-2 rounded-full ${isVoiceSearching ? 'bg-red-100' : 'bg-teal-50'}`}
          >
            <Ionicons 
              name={isVoiceSearching ? "mic" : "mic-outline"} 
              size={24} 
              color={isVoiceSearching ? '#DC2626' : '#41A67E'} 
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Categories */}
      <View className="px-4 mb-2">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category}
              onPress={() => setSelectedCategory(category)}
              className={`mr-2 px-4 py-2 rounded-full ${
                selectedCategory === category
                  ? 'bg-teal-600'
                  : 'bg-white border border-gray-200'
              }`}
            >
              <Text
                className={`text-sm font-semibold ${
                  selectedCategory === category ? 'text-white' : 'text-gray-700'
                }`}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Results Count */}
      <View className="px-4 py-2">
        <Text className="text-gray-600 text-sm">
          {filteredMedicines.length} {filteredMedicines.length === 1 ? 'result' : 'results'} found
        </Text>
      </View>

      {/* Medicine List */}
      <ScrollView className="flex-1 px-4">
        {filteredMedicines.length === 0 ? (
          <View className="flex-1 items-center justify-center py-20">
            <Text className="text-6xl mb-4">🔍</Text>
            <Text className="text-gray-800 font-semibold text-lg">No medicines found</Text>
            <Text className="text-gray-600 text-sm mt-1">Try a different search term</Text>
          </View>
        ) : (
          filteredMedicines.map((medicine) => (
            <View key={medicine.id} className="bg-white rounded-xl p-4 mb-3 shadow-sm">
              <View className="flex-row">
                {/* Medicine Icon */}
                <View className="w-16 h-16 bg-teal-50 rounded-lg items-center justify-center mr-3">
                  <Text className="text-3xl">{medicine.image}</Text>
                </View>

                {/* Medicine Details */}
                <View className="flex-1">
                  <View className="flex-row items-start justify-between">
                    <View className="flex-1">
                      <Text className="text-gray-800 font-bold text-base">
                        {medicine.name}
                      </Text>
                      <Text className="text-gray-500 text-xs mt-1">
                        {medicine.manufacturer}
                      </Text>
                    </View>
                    {medicine.requiresPrescription && (
                      <View className="bg-orange-100 px-2 py-1 rounded">
                        <Text className="text-orange-700 text-xs font-semibold">Rx</Text>
                      </View>
                    )}
                  </View>

                  <View className="flex-row items-center mt-1">
                    <View className="bg-blue-100 px-2 py-1 rounded mr-2">
                      <Text className="text-blue-700 text-xs">{medicine.category}</Text>
                    </View>
                    {medicine.inStock && (
                      <View className="flex-row items-center">
                        <AntDesign name="checkcircle" size={12} color="#10B981" />
                        <Text className="text-green-600 text-xs ml-1">In Stock</Text>
                      </View>
                    )}
                  </View>

                  <Text className="text-gray-600 text-sm mt-2">
                    {medicine.description}
                  </Text>

                  <View className="flex-row items-center justify-between mt-3">
                    <Text className="text-teal-600 font-bold text-lg">
                      Rs. {medicine.price}
                    </Text>
                    <TouchableOpacity
                      onPress={() => handleAddToCart(medicine.id)}
                      className={`flex-row items-center px-4 py-2 rounded-lg ${
                        cart.includes(medicine.id) ? 'bg-gray-200' : 'bg-teal-600'
                      }`}
                      disabled={cart.includes(medicine.id)}
                    >
                      <AntDesign 
                        name={cart.includes(medicine.id) ? "check" : "shoppingcart"} 
                        size={16} 
                        color={cart.includes(medicine.id) ? '#6B7280' : 'white'} 
                      />
                      <Text className={`ml-2 font-semibold ${
                        cart.includes(medicine.id) ? 'text-gray-600' : 'text-white'
                      }`}>
                        {cart.includes(medicine.id) ? 'Added' : 'Add to Cart'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Cart Badge */}
      {cart.length > 0 && (
        <View className="absolute bottom-4 right-4">
          <TouchableOpacity className="bg-teal-600 rounded-full w-14 h-14 items-center justify-center shadow-lg">
            <AntDesign name="shoppingcart" size={24} color="white" />
            <View className="absolute -top-2 -right-2 bg-red-500 rounded-full w-6 h-6 items-center justify-center">
              <Text className="text-white text-xs font-bold">{cart.length}</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}