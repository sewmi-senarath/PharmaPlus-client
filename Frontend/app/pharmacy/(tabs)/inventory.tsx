// app/pharmacy/(tabs)/inventory.tsx
import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { mockMedicines } from '../../../lib/mock-pharmacy';

export default function InventoryScreen() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<'all'|'tablets'|'capsules'|'syrup'|'injection'>('all');

  const filtered = useMemo(() =>
    mockMedicines.filter(m =>
      (category === 'all' || m.category.toLowerCase() === category) &&
      m.name.toLowerCase().includes(search.toLowerCase())
    ), [search, category]);

  const renderMedicineCard = ({ item: m }: any) => (
    <TouchableOpacity 
      className="bg-white rounded-2xl p-4 mb-3 shadow-sm border border-gray-100"
      onPress={() => {
        // TODO: Navigate to medicine details
        console.log('View details:', m.id);
      }}
    >
      <View className="flex-row gap-4">
        <View className="w-16 h-16 bg-[#E6F5F3] rounded-xl items-center justify-center">
          <Text className="text-[#139D92] font-bold text-xl">{m.name.charAt(0)}</Text>
        </View>
        <View className="flex-1">
          <View className="flex-row justify-between items-start mb-1">
            <Text className="font-semibold text-gray-800 flex-1" numberOfLines={1}>
              {m.name}
            </Text>
            {m.lowStock && (
              <View className="bg-red-100 px-2 py-1 rounded-full ml-2">
                <Text className="text-red-700 text-xs font-semibold">LOW</Text>
              </View>
            )}
            {m.soonToExpire && (
              <View className="bg-orange-100 px-2 py-1 rounded-full ml-2">
                <Text className="text-orange-700 text-xs font-semibold">EXP</Text>
              </View>
            )}
          </View>
          <Text className="text-xs text-gray-500 mb-2">{m.brandName} • {m.strength}</Text>
          <View className="flex-row justify-between items-center">
            <Text className="font-bold text-[#139D92]">LKR {m.price.toFixed(2)}</Text>
            <View className="flex-row gap-4">
              <Text className="text-sm text-gray-600">Stock: {m.stockQty}</Text>
              <Text className="text-sm text-gray-600">
                Exp: {new Date(m.expiryDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-[#E6F5F3]">
      {/* Header */}
      <View className="bg-white px-4 pt-12 pb-4 border-b border-gray-200">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-2xl font-bold text-gray-800">Inventory</Text>
          <View className="bg-[#139D92] px-3 py-1 rounded-full">
            <Text className="text-white text-sm font-semibold">{filtered.length}</Text>
          </View>
        </View>

        {/* Search */}
        <View className="bg-gray-100 rounded-xl flex-row items-center px-4 py-3">
          <Ionicons name="search" size={20} color="#6B7280" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search medicines..."
            className="ml-3 flex-1 text-gray-800"
            placeholderTextColor="#9CA3AF"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Category Filters */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        className="bg-white px-4 py-3 border-b border-gray-200"
      >
        {(['all','tablets','capsules','syrup','injection'] as const).map(c => (
          <TouchableOpacity 
            key={c} 
            onPress={() => setCategory(c)}
            className={`px-4 py-2 mr-2 rounded-full ${
              category === c 
                ? 'bg-[#139D92]' 
                : 'bg-gray-100'
            }`}
          >
            <Text className={`text-sm font-semibold ${
              category === c 
                ? 'text-white' 
                : 'text-gray-700'
            }`}>
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Medicine List */}
      <View className="flex-1 px-4 pt-4">
        <FlatList
          data={filtered}
          renderItem={renderMedicineCard}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="bg-white rounded-2xl p-12 items-center">
              <Ionicons name="search-outline" size={64} color="#D1D5DB" />
              <Text className="text-gray-600 text-center mt-4 mb-2 font-semibold">
                No medicines found
              </Text>
              <Text className="text-gray-400 text-center text-sm">
                Try adjusting your search or filters
              </Text>
            </View>
          }
        />
      </View>

      {/* Floating Add Button */}
      <TouchableOpacity
        className="absolute bottom-6 right-6 bg-[#139D92] w-16 h-16 rounded-full items-center justify-center shadow-lg"
        onPress={() => router.push('/pharmacy/add-medicine')}
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>
    </View>
  );
}