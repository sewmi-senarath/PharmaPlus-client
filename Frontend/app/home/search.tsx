import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, TextInput, TouchableOpacity, ScrollView, Alert, Platform, ActivityIndicator } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import api from '../../config/api';

// Conditionally import Voice only for native platforms
let Voice: any = null;
if (Platform.OS !== 'web') {
  try {
    Voice = require('@react-native-voice/voice');
  } catch (error) {
    console.log('Voice library not installed:', error);
  }
}

// Sample medicines database (keeping as fallback/example)
const SAMPLE_MEDICINES = [
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

interface RealMedicine {
  _id: string;
  medicineName: string;
  genericName?: string;
  brandName?: string;
  dosage: string;
  doseForm: string;
  category: string;
  manufacturer: string;
  price: number;
  stockQty: number;
  requiresPrescription: boolean;
  isActive: boolean;
  pharmacyId?: {
    pharmacyName: string;
  };
}

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isVoiceSearching, setIsVoiceSearching] = useState(false);
  const [cart, setCart] = useState<string[]>([]);
  const [medicines, setMedicines] = useState<RealMedicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch medicines from database
  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch from backend: GET /api/pharmacy/with-inventory
      const response = await api.get('/pharmacy/with-inventory');
      
      if (response.data.success) {
        // Flatten all medicines from all pharmacies
        const allMedicines: RealMedicine[] = [];
        const pharmacies = response.data.data || response.data.pharmacies || [];
        
        pharmacies.forEach((pharmacy: any) => {
          if (pharmacy.inventory && Array.isArray(pharmacy.inventory)) {
            pharmacy.inventory.forEach((medicine: any) => {
              allMedicines.push({
                ...medicine,
                pharmacyId: {
                  pharmacyName: pharmacy.pharmacyName
                }
              });
            });
          }
        });
        
        setMedicines(allMedicines);
      }
    } catch (err: any) {
      console.error('Error fetching medicines:', err);
      setError(err.response?.data?.message || 'Failed to load medicines');
    } finally {
      setLoading(false);
    }
  };

  // Get medicine display name
  const getMedicineName = (medicine: RealMedicine) => {
    if (medicine.medicineName) return medicine.medicineName;
    if (medicine.brandName) return medicine.brandName;
    if (medicine.genericName) return medicine.genericName;
    
    const parts = [];
    if (medicine.category) parts.push(medicine.category);
    if (medicine.dosage) parts.push(medicine.dosage);
    if (medicine.doseForm) parts.push(medicine.doseForm);
    
    return parts.length > 0 ? parts.join(' ') : medicine.category || 'Medicine';
  };

  // Set up voice recognition listeners
  useEffect(() => {
    if (Voice) {
      // Set up event handlers
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
          const recognizedText = e.value[0];
          console.log('✅ Setting search query:', recognizedText);
          setSearchQuery(recognizedText);
          setIsVoiceSearching(false);
          Alert.alert('Voice Search', `Searching for: "${recognizedText}"`);
        }
      };
      
      Voice.onSpeechError = (e: any) => {
        console.error('❌ Voice error:', e);
        setIsVoiceSearching(false);
        
        let errorMessage = 'Could not recognize speech. Please try again.';
        if (e.error?.message) {
          errorMessage = e.error.message;
        } else if (e.error?.code === '7') {
          errorMessage = 'No speech detected. Please try speaking again.';
        }
        
        Alert.alert('Voice Recognition Error', errorMessage);
      };

      Voice.onSpeechPartialResults = (e: any) => {
        console.log('🔄 Partial results:', e.value);
        // Optional: show partial results as user speaks
      };

      // Cleanup
      return () => {
        if (Voice) {
          Voice.destroy()
            .then(() => {
              console.log('Voice destroyed');
              Voice.removeAllListeners();
            })
            .catch(e => console.log('Error destroying voice:', e));
        }
      };
    }
  }, []);

  // Get unique categories from real medicines
  const categories = ['All', ...Array.from(new Set(medicines.map(m => m.category).filter(Boolean)))];

  // Filter medicines based on search query and category
  const filteredMedicines = medicines.filter((medicine) => {
    const name = getMedicineName(medicine).toLowerCase();
    const searchLower = searchQuery.toLowerCase();
    
    const matchesSearch = name.includes(searchLower) ||
      medicine.genericName?.toLowerCase().includes(searchLower) ||
      medicine.brandName?.toLowerCase().includes(searchLower) ||
      medicine.category?.toLowerCase().includes(searchLower) ||
      medicine.manufacturer?.toLowerCase().includes(searchLower);
    
    const matchesCategory = selectedCategory === 'All' || medicine.category === selectedCategory;
    
    return matchesSearch && matchesCategory && medicine.isActive;
  });

  const handleVoiceSearch = async () => {
    console.log('🎤 Voice search button pressed');
    
    if (!Voice) {
      Alert.alert(
        'Voice Search Not Available',
        'Voice search is not available in this build.\n\nNote: Voice search works on:\n• Physical Android devices\n• Physical iOS devices\n\nNot supported on:\n• Emulators\n• Web browser (Expo Go)',
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      if (isVoiceSearching) {
        // Stop listening
        console.log('Stopping voice recognition...');
        await Voice.stop();
        setIsVoiceSearching(false);
      } else {
        // Check if voice recognition is available
        console.log('Checking voice availability...');
        const available = await Voice.isAvailable();
        console.log('Voice available:', available);
        
        if (!available) {
          Alert.alert(
            'Voice Not Available',
            'Voice recognition is not available on this device.\n\nPlease ensure:\n• You are using a physical device\n• Microphone permissions are granted',
            [{ text: 'OK' }]
          );
          return;
        }
        
        // Start listening
        console.log('Starting voice recognition...');
        await Voice.start('en-US');
        console.log('Voice recognition started');
        
        // Show instructions
        Alert.alert(
          'Listening...',
          'Speak now to search for medicines.\nTap the microphone again to stop.',
          [{ text: 'OK' }]
        );
      }
    } catch (error: any) {
      console.error('Voice search error:', error);
      setIsVoiceSearching(false);
      
      let errorMessage = 'Could not start voice recognition.';
      if (error.message) {
        errorMessage += `\n\nError: ${error.message}`;
      }
      errorMessage += '\n\nPlease check:\n• Microphone permissions\n• Device compatibility\n• You are not using an emulator';
      
      Alert.alert('Voice Search Error', errorMessage, [{ text: 'OK' }]);
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

      {/* Refresh Button */}
      {!loading && (
        <TouchableOpacity
          onPress={fetchMedicines}
          className="absolute top-4 right-4 bg-teal-600 rounded-full w-10 h-10 items-center justify-center z-10"
        >
          <Ionicons name="refresh" size={20} color="white" />
        </TouchableOpacity>
      )}

      {/* Categories */}
      <View className="px-4 mb-2">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((category) => (
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
        {loading ? (
          <View className="items-center justify-center py-20">
            <ActivityIndicator size="large" color="#41A67E" />
            <Text className="text-gray-600 mt-3">Loading medicines...</Text>
          </View>
        ) : error ? (
          <View className="items-center justify-center py-20">
            <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
            <Text className="text-red-600 mt-3 text-lg">Error</Text>
            <Text className="text-gray-600 text-sm text-center px-6">{error}</Text>
            <TouchableOpacity
              onPress={fetchMedicines}
              className="mt-4 bg-teal-600 px-6 py-3 rounded-lg"
            >
              <Text className="text-white font-semibold">Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : filteredMedicines.length === 0 ? (
          <View className="flex-1 items-center justify-center py-20">
            <Text className="text-6xl mb-4">🔍</Text>
            <Text className="text-gray-800 font-semibold text-lg">No medicines found</Text>
            <Text className="text-gray-600 text-sm mt-1">Try a different search term</Text>
          </View>
        ) : (
          filteredMedicines.map((medicine) => (
            <View key={medicine._id} className="bg-white rounded-xl p-4 mb-3 shadow-sm">
              <View className="flex-row">
                {/* Medicine Icon */}
                <View className="w-16 h-16 bg-teal-50 rounded-lg items-center justify-center mr-3">
                  <Ionicons name="medical" size={32} color="#41A67E" />
                </View>

                {/* Medicine Details */}
                <View className="flex-1">
                  <View className="flex-row items-start justify-between">
                    <View className="flex-1">
                      <Text className="text-gray-800 font-bold text-base">
                        {getMedicineName(medicine)}
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
                    {medicine.stockQty > 0 ? (
                      <View className="bg-emerald-100 px-2 py-1 rounded">
                        <Text className="text-emerald-700 text-xs">{medicine.stockQty} in stock</Text>
                      </View>
                    ) : (
                      <View className="bg-red-100 px-2 py-1 rounded">
                        <Text className="text-red-700 text-xs">Out of Stock</Text>
                      </View>
                    )}
                  </View>

                  <Text className="text-gray-600 text-xs mt-2" numberOfLines={2}>
                    {medicine.dosage} {medicine.doseForm}
                    {medicine.pharmacyId && ` • ${medicine.pharmacyId.pharmacyName}`}
                  </Text>

                  <View className="flex-row items-center justify-between mt-3">
                    <Text className="text-teal-600 font-bold text-lg">
                      LKR {medicine.price.toFixed(2)}
                    </Text>
                    <TouchableOpacity
                      onPress={() => addToCart(medicine._id)}
                      disabled={medicine.stockQty < 1 || cart.includes(medicine._id)}
                      className={`px-3 py-2 rounded-lg ${
                        cart.includes(medicine._id) || medicine.stockQty < 1 ? 'bg-gray-200' : 'bg-teal-600'
                      }`}
                    >
                        <Text
                          className={`text-xs font-semibold ${
                            cart.includes(medicine._id) || medicine.stockQty < 1 ? 'text-gray-600' : 'text-white'
                          }`}
                        >
                          {cart.includes(medicine._id) ? 'Added ✓' : '+ Cart'}
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