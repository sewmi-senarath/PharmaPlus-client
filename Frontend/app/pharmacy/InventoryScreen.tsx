// screens/Pharmacy/InventoryScreen.jsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  RefreshControl,
  Alert,
  ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';

const InventoryScreen = ({ navigation, route }) => {
  const { pharmacyId } = route.params;

  const [medicines, setMedicines] = useState([]);
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // all, lowStock, expiring
  const [analytics, setAnalytics] = useState(null);

  // Fetch inventory
  const fetchInventory = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_API_URL}/api/medicine/pharmacies/${pharmacyId}/inventory`,
        {
          params: { limit: 100, activeOnly: true },
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setMedicines(response.data.data);
        setFilteredMedicines(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching inventory:', error);
      Alert.alert('Error', 'Failed to load inventory');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch analytics
  const fetchAnalytics = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_API_URL}/api/medicine/pharmacies/${pharmacyId}/analytics`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setAnalytics(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  // Initial load and reload on focus
  useFocusEffect(
    useCallback(() => {
      fetchInventory();
      fetchAnalytics();
    }, [])
  );

  // Handle refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchInventory();
    fetchAnalytics();
  };

  // Search functionality
  useEffect(() => {
    if (searchQuery.trim() === '') {
      applyFilter(activeFilter);
    } else {
      const filtered = medicines.filter(med =>
        med.medicineName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        med.genericName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        med.brandName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMedicines(filtered);
    }
  }, [searchQuery]);

  // Apply filter
  const applyFilter = (filter) => {
    setActiveFilter(filter);
    let filtered = [...medicines];

    switch (filter) {
      case 'lowStock':
        filtered = medicines.filter(med => med.lowStock);
        break;
      case 'expiring':
        filtered = medicines.filter(med => med.soonToExpire);
        break;
      case 'discount':
        filtered = medicines.filter(med => med.isOnDiscount);
        break;
      default:
        break;
    }

    setFilteredMedicines(filtered);
  };

  // Toggle medicine availability
  const toggleAvailability = async (medicineId, currentStatus) => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      await axios.patch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/medicine/${medicineId}/toggle-availability`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update local state
      const updated = medicines.map(med =>
        med._id === medicineId ? { ...med, isActive: !currentStatus } : med
      );
      setMedicines(updated);
      setFilteredMedicines(updated);

      Alert.alert('Success', `Medicine ${!currentStatus ? 'activated' : 'deactivated'}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to update availability');
    }
  };

  // Render medicine item
  const renderMedicineItem = ({ item }) => (
    <TouchableOpacity
      className="bg-white mb-3 p-4 rounded-lg border border-gray-200 shadow-sm"
      onPress={() => navigation.navigate('MedicineDetails', { medicineId: item._id })}
    >
      <View className="flex-row justify-between items-start">
        <View className="flex-1 mr-3">
          <Text className="text-lg font-bold text-gray-800">{item.medicineName}</Text>
          {item.genericName && (
            <Text className="text-sm text-gray-600 mt-1">{item.genericName}</Text>
          )}
          <View className="flex-row items-center mt-2">
            <Text className="text-sm text-gray-600">{item.dosage} • {item.doseForm}</Text>
          </View>
        </View>

        <View className="items-end">
          <Text className="text-xl font-bold text-green-600">
            LKR {parseFloat(item.price).toFixed(2)}
          </Text>
          {item.discountPct > 0 && (
            <View className="bg-red-500 px-2 py-1 rounded mt-1">
              <Text className="text-white text-xs font-bold">{item.discountPct}% OFF</Text>
            </View>
          )}
        </View>
      </View>

      {/* Stock Information */}
      <View className="mt-3 pt-3 border-t border-gray-200">
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <Text className="text-sm text-gray-600 mr-4">
              Stock: <Text className={`font-bold ${item.lowStock ? 'text-red-600' : 'text-gray-800'}`}>
                {item.stockQty}
              </Text>
            </Text>
            {item.lowStock && (
              <View className="bg-red-100 px-2 py-1 rounded">
                <Text className="text-red-700 text-xs font-bold">LOW STOCK</Text>
              </View>
            )}
            {item.soonToExpire && (
              <View className="bg-orange-100 px-2 py-1 rounded ml-2">
                <Text className="text-orange-700 text-xs font-bold">EXPIRING</Text>
              </View>
            )}
          </View>

          {/* Toggle Switch */}
          <TouchableOpacity
            className={`px-3 py-1 rounded ${item.isActive ? 'bg-green-500' : 'bg-gray-400'}`}
            onPress={() => toggleAvailability(item._id, item.isActive)}
          >
            <Text className="text-white text-xs font-bold">
              {item.isActive ? 'ACTIVE' : 'INACTIVE'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Quick Actions */}
      <View className="flex-row mt-3 space-x-2">
        <TouchableOpacity
          className="flex-1 bg-blue-50 py-2 rounded"
          onPress={() => navigation.navigate('EditMedicine', { medicineId: item._id })}
        >
          <Text className="text-blue-600 text-center text-sm font-semibold">Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-1 bg-green-50 py-2 rounded"
          onPress={() => navigation.navigate('UpdateStock', { medicineId: item._id })}
        >
          <Text className="text-green-600 text-center text-sm font-semibold">Update Stock</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#2563eb" />
        <Text className="mt-3 text-gray-600">Loading inventory...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Analytics Cards */}
      {analytics && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="p-4 pb-2">
          <View className="bg-blue-500 p-4 rounded-lg mr-3 w-40">
            <Text className="text-white text-sm">Total Medicines</Text>
            <Text className="text-white text-3xl font-bold mt-1">
              {analytics.overview.totalMedicines}
            </Text>
          </View>
          <View className="bg-green-500 p-4 rounded-lg mr-3 w-40">
            <Text className="text-white text-sm">Active</Text>
            <Text className="text-white text-3xl font-bold mt-1">
              {analytics.overview.activeMedicines}
            </Text>
          </View>
          <View className="bg-red-500 p-4 rounded-lg mr-3 w-40">
            <Text className="text-white text-sm">Low Stock</Text>
            <Text className="text-white text-3xl font-bold mt-1">
              {analytics.overview.lowStockCount}
            </Text>
          </View>
          <View className="bg-orange-500 p-4 rounded-lg mr-3 w-40">
            <Text className="text-white text-sm">Expiring Soon</Text>
            <Text className="text-white text-3xl font-bold mt-1">
              {analytics.overview.expiringCount}
            </Text>
          </View>
          <View className="bg-purple-500 p-4 rounded-lg w-48">
            <Text className="text-white text-sm">Inventory Value</Text>
            <Text className="text-white text-2xl font-bold mt-1">
              LKR {(analytics.overview.totalInventoryValue / 1000).toFixed(1)}K
            </Text>
          </View>
        </ScrollView>
      )}

      {/* Search Bar */}
      <View className="px-4 py-2">
        <View className="bg-white rounded-lg flex-row items-center px-3 py-2 border border-gray-300">
          <Text className="text-xl mr-2">🔍</Text>
          <TextInput
            className="flex-1"
            placeholder="Search medicines..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text className="text-gray-500 text-lg">✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter Chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4 pb-2">
        <TouchableOpacity
          className={`px-4 py-2 rounded-full mr-2 ${activeFilter === 'all' ? 'bg-blue-600' : 'bg-white border border-gray-300'}`}
          onPress={() => applyFilter('all')}
        >
          <Text className={`font-semibold ${activeFilter === 'all' ? 'text-white' : 'text-gray-700'}`}>
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`px-4 py-2 rounded-full mr-2 ${activeFilter === 'lowStock' ? 'bg-red-600' : 'bg-white border border-gray-300'}`}
          onPress={() => applyFilter('lowStock')}
        >
          <Text className={`font-semibold ${activeFilter === 'lowStock' ? 'text-white' : 'text-gray-700'}`}>
            Low Stock
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`px-4 py-2 rounded-full mr-2 ${activeFilter === 'expiring' ? 'bg-orange-600' : 'bg-white border border-gray-300'}`}
          onPress={() => applyFilter('expiring')}
        >
          <Text className={`font-semibold ${activeFilter === 'expiring' ? 'text-white' : 'text-gray-700'}`}>
            Expiring Soon
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`px-4 py-2 rounded-full ${activeFilter === 'discount' ? 'bg-green-600' : 'bg-white border border-gray-300'}`}
          onPress={() => applyFilter('discount')}
        >
          <Text className={`font-semibold ${activeFilter === 'discount' ? 'text-white' : 'text-gray-700'}`}>
            On Discount
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Medicine List */}
      <FlatList
        data={filteredMedicines}
        renderItem={renderMedicineItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View className="items-center justify-center py-20">
            <Text className="text-6xl mb-4">📦</Text>
            <Text className="text-gray-600 text-lg">No medicines found</Text>
            <Text className="text-gray-500 text-sm mt-1">Try adjusting your filters</Text>
          </View>
        }
      />

      {/* Floating Add Button */}
      <TouchableOpacity
        className="absolute bottom-6 right-6 bg-blue-600 w-16 h-16 rounded-full items-center justify-center shadow-lg"
        onPress={() => navigation.navigate('AddMedicine', { pharmacyId })}
      >
        <Text className="text-white text-3xl">+</Text>
      </TouchableOpacity>
    </View>
  );
};

export default InventoryScreen;