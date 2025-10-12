import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, SafeAreaView, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Alert, Modal } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import api from '../../config/api';

// Types
interface Medicine {
  _id: string;
  medicineName: string;
  genericName?: string;
  brandName?: string;
  dosage: string;
  strength?: string;
  doseForm: string;
  category: string;
  manufacturer: string;
  price: number;
  stockQty: number;
  minQty?: number;
  expiryDate?: string;
  requiresPrescription: boolean;
  isActive: boolean;
}

interface Pharmacy {
  _id: string;
  pharmacyName: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    district: string;
    postalCode: string;
  };
  contactPhone?: string;
  inventory?: Medicine[];
  medicines?: Medicine[];  // Backend sends 'medicines', we normalize to 'inventory'
}

interface CartItem {
  medicineId: string;
  medicineName: string;
  pharmacyId: string;
  pharmacyName: string;
  price: number;
  quantity: number;
}

export default function OrderMedicine() {
  const router = useRouter();
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Fetch pharmacies with inventory
  useEffect(() => {
    fetchPharmaciesWithInventory();
  }, []);

  const fetchPharmaciesWithInventory = async () => {
    try {
      setLoading(true);
      // Using your backend route: GET /api/pharmacy/with-inventory
      const response = await api.get('/pharmacy/with-inventory');
      
      console.log('📦 Backend response:', response.data);
      
      if (response.data.success) {
        const pharmaciesData = response.data.data || response.data.pharmacies || [];
        console.log('📋 Pharmacies loaded:', pharmaciesData.length);
        
        // Normalize: Backend sends 'medicines', frontend uses 'inventory'
        const normalizedPharmacies = pharmaciesData.map((pharmacy: any) => ({
          ...pharmacy,
          inventory: pharmacy.inventory || pharmacy.medicines || []  // ← Fix here!
        }));
        
        // Debug: Check each pharmacy's inventory
        normalizedPharmacies.forEach((pharmacy: any, index: number) => {
          console.log(`🏥 Pharmacy ${index + 1}: ${pharmacy.pharmacyName}`);
          console.log(`   📦 Inventory count: ${pharmacy.inventory?.length || 0}`);
          if (pharmacy.inventory && pharmacy.inventory.length > 0) {
            console.log(`   💊 First medicine:`, pharmacy.inventory[0]);
          } else {
            console.warn(`   ⚠️ No inventory for ${pharmacy.pharmacyName}`);
          }
        });
        
        setPharmacies(normalizedPharmacies);
      } else {
        console.warn('⚠️ Backend returned success: false');
        Alert.alert('Error', response.data.message || 'Failed to load pharmacies');
      }
    } catch (error: any) {
      console.error('Error fetching pharmacies:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to load medicines');
    } finally {
      setLoading(false);
    }
  };

  // Get quantity for a medicine
  const getQuantity = (medicineId: string) => quantities[medicineId] || 1;

  // Increase quantity
  const increaseQuantity = (medicineId: string) => {
    setQuantities(prev => ({ ...prev, [medicineId]: (prev[medicineId] || 1) + 1 }));
  };

  // Decrease quantity
  const decreaseQuantity = (medicineId: string) => {
    setQuantities(prev => {
      const current = prev[medicineId] || 1;
      if (current > 1) {
        return { ...prev, [medicineId]: current - 1 };
      }
      return prev;
    });
  };

  // Get medicine display name (with proper fallback)
  const getMedicineName = (medicine: any) => {
    // If we have a name, use it
    if (medicine.medicineName) return medicine.medicineName;
    if (medicine.brandName) return medicine.brandName;
    if (medicine.genericName) return medicine.genericName;
    
    // Generate a descriptive name based on available information
    const parts = [];
    if (medicine.category) parts.push(medicine.category);
    if (medicine.dosage) parts.push(medicine.dosage);
    if (medicine.strength) parts.push(medicine.strength);
    if (medicine.doseForm) parts.push(medicine.doseForm);
    
    if (parts.length > 0) {
      return parts.join(' ');
    }
    
    // Last resort - use category or ID-based name
    if (medicine.category) return medicine.category + ' Medicine';
    if (medicine._id) return 'Medicine #' + medicine._id.slice(-6).toUpperCase();
    
    return 'Generic Medicine';
  };

  // Add to cart
  const addToCart = (medicine: any, pharmacy: any) => {
    console.log('🛒 Add to cart clicked');
    console.log('   Medicine:', medicine);
    console.log('   Pharmacy:', pharmacy);
    
    // Check if we have required data
    if (!medicine || !medicine._id) {
      console.error('❌ Invalid medicine object:', medicine);
      Alert.alert('Error', 'Invalid medicine data');
      return;
    }
    
    if (!pharmacy || !pharmacy._id) {
      console.error('❌ Invalid pharmacy object:', pharmacy);
      Alert.alert('Error', 'Invalid pharmacy data');
      return;
    }
    
    const quantity = getQuantity(medicine._id);
    const displayName = getMedicineName(medicine);
    
    console.log('   Quantity:', quantity);
    console.log('   Display name:', displayName);
    console.log('   Price:', medicine.price);
    
    const cartItem: CartItem = {
      medicineId: medicine._id,
      medicineName: displayName,
      pharmacyId: pharmacy._id,
      pharmacyName: pharmacy.pharmacyName,
      price: medicine.price || 0,
      quantity: quantity
    };
    
    console.log('   Cart item created:', cartItem);

    setCart(prev => {
      console.log('   Previous cart:', prev);
      
      const existing = prev.find(item => item.medicineId === medicine._id && item.pharmacyId === pharmacy._id);
      
      if (existing) {
        console.log('   Item already in cart, increasing quantity');
        const newCart = prev.map(item =>
          item.medicineId === medicine._id && item.pharmacyId === pharmacy._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
        console.log('   New cart:', newCart);
        return newCart;
      } else {
        console.log('   Adding new item to cart');
        const newCart = [...prev, cartItem];
        console.log('   New cart:', newCart);
        return newCart;
      }
    });

    // Reset quantity
    setQuantities(prev => ({ ...prev, [medicine._id]: 1 }));
    
    Alert.alert('Success', `${displayName} added to cart!`);
    console.log('✅ Add to cart complete');
  };

  // Update cart item quantity
  const updateCartQuantity = (medicineId: string, pharmacyId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(medicineId, pharmacyId);
      return;
    }
    setCart(prev => prev.map(item =>
      item.medicineId === medicineId && item.pharmacyId === pharmacyId
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  // Remove from cart
  const removeFromCart = (medicineId: string, pharmacyId: string) => {
    setCart(prev => prev.filter(item => 
      !(item.medicineId === medicineId && item.pharmacyId === pharmacyId)
    ));
  };

  // Clear cart
  const clearCart = () => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to remove all items from cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => setCart([])
        }
      ]
    );
  };

  // Calculate totals
  const getCartTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  // Proceed to checkout
  const handleCheckout = () => {
    if (cart.length === 0) {
      Alert.alert('Empty Cart', 'Please add items to cart before checkout');
      return;
    }

    console.log('💳 Proceeding to checkout');
    console.log('   Cart items:', cart);
    console.log('   Total:', getCartTotal());

    // Close cart modal
    setIsCartOpen(false);

    // Navigate to checkout page with cart data
    router.push({
      pathname: '/home/checkout',
      params: {
        cartData: JSON.stringify(cart),
        total: getCartTotal().toString()
      }
    });
  };

  // Get total cart items
  const getTotalCartItems = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  // Filter medicines based on search (using useMemo for performance and safety)
  const filteredPharmacies = useMemo(() => {
    // Guard clause: ensure pharmacies is an array
    if (!Array.isArray(pharmacies) || pharmacies.length === 0) {
      return [];
    }
    
    // No search query - return all pharmacies
    if (!searchQuery.trim()) {
      return pharmacies;
    }

    // Filter pharmacies based on search query
    const searchLower = searchQuery.toLowerCase();
    
    const filtered = pharmacies.map(pharmacy => {
      // Get inventory (backend may send as 'medicines' or 'inventory')
      const inventory = pharmacy.inventory || pharmacy.medicines || [];
      
      // Ensure inventory exists and is an array
      if (!Array.isArray(inventory)) {
        return { ...pharmacy, inventory: [] };
      }

      const filteredInventory = inventory.filter(medicine => {
        if (!medicine) return false;
        
        const name = getMedicineName(medicine).toLowerCase();
        return name.includes(searchLower) ||
               medicine.genericName?.toLowerCase().includes(searchLower) ||
               medicine.brandName?.toLowerCase().includes(searchLower) ||
               medicine.category?.toLowerCase().includes(searchLower);
      });

      return {
        ...pharmacy,
        inventory: filteredInventory
      };
    }).filter(pharmacy => pharmacy.inventory && pharmacy.inventory.length > 0);

    return filtered;
  }, [pharmacies, searchQuery]);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-teal-600 px-4 py-4">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <TouchableOpacity onPress={() => router.back()} className="mr-3">
              <AntDesign name="arrowleft" size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-white text-xl font-bold">Order Medicine</Text>
          </View>
          
          <TouchableOpacity 
            className="relative ml-3"
            onPress={() => {
              console.log('🛒 Cart icon clicked');
              console.log('   Current cart:', cart);
              console.log('   Total items:', getTotalCartItems());
              setIsCartOpen(true);
            }}
          >
            <Ionicons name="cart" size={28} color="white" />
            {getTotalCartItems() > 0 && (
              <View className="absolute -top-2 -right-2 bg-red-500 rounded-full w-6 h-6 items-center justify-center">
                <Text className="text-white text-xs font-bold">{getTotalCartItems()}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="mt-4 bg-white rounded-xl flex-row items-center px-3 py-2">
          <Ionicons name="search" size={20} color="#6B7280" />
          <TextInput
            className="flex-1 ml-2 text-gray-800"
            placeholder="Search medicines..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Content */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {loading ? (
          <View className="items-center justify-center py-20">
            <ActivityIndicator size="large" color="#41A67E" />
            <Text className="text-gray-600 mt-3">Loading medicines...</Text>
          </View>
        ) : !filteredPharmacies || filteredPharmacies.length === 0 ? (
          <View className="items-center justify-center py-20">
            <Ionicons name="medical-outline" size={64} color="#D1D5DB" />
            <Text className="text-gray-600 mt-3 text-lg">No medicines found</Text>
            <Text className="text-gray-500 text-sm">Try a different search term</Text>
          </View>
        ) : (
          (filteredPharmacies || []).map((pharmacy) => (
            <View key={pharmacy._id} className="mb-4">
              {/* Pharmacy Header */}
              <View className="bg-white px-4 py-3 border-b border-gray-200">
                <View className="flex-row items-center">
                  <Ionicons name="business" size={20} color="#41A67E" />
                  <Text className="text-lg font-bold text-gray-800 ml-2">
                    {pharmacy.pharmacyName}
                  </Text>
                </View>
                <Text className="text-sm text-gray-600 mt-1">
                  {pharmacy.address?.city || 'Unknown'}, {pharmacy.address?.district || 'Unknown'}
                </Text>
              </View>

              {/* Medicines */}
              {Array.isArray(pharmacy.inventory) && pharmacy.inventory.length > 0 ? (
                pharmacy.inventory.map((medicine) => (
                <View
                  key={medicine._id}
                  className="bg-white px-4 py-4 border-b border-gray-100"
                >
                  <View className="flex-row items-start justify-between mb-2">
                    <View className="flex-1 pr-3">
                      <Text className="text-lg font-bold text-gray-900">
                        {getMedicineName(medicine)}
                      </Text>
                      {(medicine.brandName || medicine.manufacturer) && (
                        <Text className="text-sm text-gray-600 mt-1">
                          {medicine.brandName || 'Generic'} {medicine.manufacturer ? `• ${medicine.manufacturer}` : ''}
                        </Text>
                      )}
                      {(medicine.dosage || medicine.doseForm || medicine.category) && (
                        <Text className="text-xs text-gray-500 mt-1">
                          {medicine.dosage || ''} {medicine.doseForm || ''} {medicine.category ? `• ${medicine.category}` : ''}
                        </Text>
                      )}
                      
                      {/* Stock and Prescription Info */}
                      <View className="flex-row items-center mt-2 gap-2">
                        <View className={`px-2 py-1 rounded-md ${medicine.stockQty > 10 ? 'bg-green-50' : 'bg-orange-50'}`}>
                          <Text className={`text-xs font-semibold ${medicine.stockQty > 10 ? 'text-green-700' : 'text-orange-700'}`}>
                            {medicine.stockQty} in stock
                          </Text>
                        </View>
                        {medicine.requiresPrescription && (
                          <View className="bg-red-50 px-2 py-1 rounded-md">
                            <Text className="text-xs font-semibold text-red-700">
                              Rx Required
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>

                    <View className="items-end">
                      <Text className="text-xl font-bold text-teal-600">
                        LKR {medicine.price.toFixed(2)}
                      </Text>
                    </View>
                  </View>

                  {/* Quantity Selector and Add to Cart */}
                  <View className="flex-row items-center justify-between mt-3 pt-3 border-t border-gray-100">
                    <View className="flex-row items-center bg-gray-50 rounded-lg p-1">
                      <TouchableOpacity
                        onPress={() => decreaseQuantity(medicine._id)}
                        className="bg-white rounded-md w-9 h-9 items-center justify-center"
                      >
                        <Text className="text-teal-600 font-bold text-xl">−</Text>
                      </TouchableOpacity>
                      
                      <Text className="mx-4 font-bold text-gray-800 text-lg min-w-[30px] text-center">
                        {getQuantity(medicine._id)}
                      </Text>
                      
                      <TouchableOpacity
                        onPress={() => increaseQuantity(medicine._id)}
                        className="bg-white rounded-md w-9 h-9 items-center justify-center"
                      >
                        <Text className="text-teal-600 font-bold text-xl">+</Text>
                      </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                      onPress={() => {
                        console.log('🛒 Add to Cart button clicked for:', medicine.medicineName || 'Unknown');
                        console.log('   isActive:', medicine.isActive);
                        console.log('   stockQty:', medicine.stockQty);
                        addToCart(medicine, pharmacy);
                      }}
                      className={`rounded-lg px-5 py-3 flex-row items-center ${
                        medicine.stockQty < 1 || medicine.isActive === false ? 'bg-gray-400' : 'bg-teal-600'
                      }`}
                      disabled={medicine.stockQty < 1 || medicine.isActive === false}
                    >
                      <Ionicons name="cart-outline" size={18} color="white" />
                      <Text className="text-white font-semibold ml-2">
                        {medicine.stockQty < 1 ? 'Out of Stock' : 'Add to Cart'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
              ) : (
                <View className="bg-white px-4 py-8 items-center">
                  <Ionicons name="medical-outline" size={48} color="#D1D5DB" />
                  <Text className="text-gray-500 mt-2">No medicines available</Text>
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>

      {/* Refresh Button */}
      {!loading && (
        <TouchableOpacity
          onPress={fetchPharmaciesWithInventory}
          className="absolute bottom-6 right-6 bg-teal-600 rounded-full w-14 h-14 items-center justify-center shadow-lg"
        >
          <Ionicons name="refresh" size={24} color="white" />
        </TouchableOpacity>
      )}

      {/* Cart Modal */}
      <Modal
        visible={isCartOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsCartOpen(false)}
      >
        <View className="flex-1 bg-black/50">
          <TouchableOpacity 
            className="flex-1" 
            activeOpacity={1} 
            onPress={() => setIsCartOpen(false)}
          />
          
          <View className="bg-white rounded-t-3xl" style={{ maxHeight: '80%' }}>
            {/* Cart Header */}
            <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-200">
              <View className="flex-row items-center">
                <Ionicons name="cart" size={24} color="#41A67E" />
                <Text className="text-xl font-bold text-gray-900 ml-2">
                  My Cart ({getTotalCartItems()})
                </Text>
              </View>
              <TouchableOpacity onPress={() => setIsCartOpen(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Cart Items */}
            <ScrollView className="flex-1 px-6 py-4">
              {cart.length === 0 ? (
                <View className="items-center justify-center py-20">
                  <Ionicons name="cart-outline" size={64} color="#D1D5DB" />
                  <Text className="text-gray-600 mt-3 text-lg">Your cart is empty</Text>
                  <Text className="text-gray-500 text-sm">Add medicines to get started</Text>
                </View>
              ) : (
                <>
                  {cart.map((item, index) => (
                    <View
                      key={`${item.medicineId}-${item.pharmacyId}`}
                      className="bg-gray-50 rounded-xl p-4 mb-3"
                    >
                      <View className="flex-row items-start justify-between mb-2">
                        <View className="flex-1 pr-3">
                          <Text className="font-bold text-gray-900 text-base">
                            {item.medicineName}
                          </Text>
                          <View className="flex-row items-center mt-1">
                            <Ionicons name="business-outline" size={14} color="#6B7280" />
                            <Text className="text-sm text-gray-600 ml-1">
                              {item.pharmacyName}
                            </Text>
                          </View>
                          <Text className="text-base font-bold text-teal-600 mt-2">
                            LKR {item.price.toFixed(2)}
                          </Text>
                        </View>

                        <TouchableOpacity
                          onPress={() => removeFromCart(item.medicineId, item.pharmacyId)}
                          className="p-2"
                        >
                          <Ionicons name="trash-outline" size={20} color="#EF4444" />
                        </TouchableOpacity>
                      </View>

                      {/* Quantity Controls */}
                      <View className="flex-row items-center justify-between mt-3 pt-3 border-t border-gray-200">
                        <Text className="text-sm text-gray-600">Quantity:</Text>
                        <View className="flex-row items-center bg-white rounded-lg p-1">
                          <TouchableOpacity
                            onPress={() => updateCartQuantity(item.medicineId, item.pharmacyId, item.quantity - 1)}
                            className="bg-gray-100 rounded-md w-8 h-8 items-center justify-center"
                          >
                            <Text className="text-teal-600 font-bold text-lg">−</Text>
                          </TouchableOpacity>
                          
                          <Text className="mx-4 font-bold text-gray-800 text-base min-w-[24px] text-center">
                            {item.quantity}
                          </Text>
                          
                          <TouchableOpacity
                            onPress={() => updateCartQuantity(item.medicineId, item.pharmacyId, item.quantity + 1)}
                            className="bg-gray-100 rounded-md w-8 h-8 items-center justify-center"
                          >
                            <Text className="text-teal-600 font-bold text-lg">+</Text>
                          </TouchableOpacity>
                        </View>
                        
                        <Text className="text-base font-bold text-gray-900">
                          LKR {(item.price * item.quantity).toFixed(2)}
                        </Text>
                      </View>
                    </View>
                  ))}

                  {/* Clear Cart Button */}
                  {cart.length > 0 && (
                    <TouchableOpacity
                      onPress={clearCart}
                      className="bg-red-50 rounded-xl p-4 mb-3 flex-row items-center justify-center"
                    >
                      <Ionicons name="trash-outline" size={20} color="#EF4444" />
                      <Text className="text-red-600 font-semibold ml-2">Clear Cart</Text>
                    </TouchableOpacity>
                  )}
                </>
              )}
            </ScrollView>

            {/* Cart Footer */}
            {cart.length > 0 && (
              <View className="px-6 py-4 border-t border-gray-200">
                <View className="flex-row items-center justify-between mb-4">
                  <Text className="text-lg font-bold text-gray-900">Total:</Text>
                  <Text className="text-2xl font-bold text-teal-600">
                    LKR {getCartTotal().toFixed(2)}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={handleCheckout}
                  className="bg-teal-600 rounded-xl py-4 flex-row items-center justify-center"
                >
                  <Ionicons name="card-outline" size={24} color="white" />
                  <Text className="text-white font-bold text-lg ml-2">
                    Proceed to Checkout
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

