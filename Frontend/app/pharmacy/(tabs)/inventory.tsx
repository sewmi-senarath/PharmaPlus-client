import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import PharmacyHeader from '../components/ui/PharmacyHeader';
import { Card, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { PharmacyAPI } from '../components/services/pharmacy.api';
import type { Medicine } from '../../types/pharmacy-types';
import { router } from 'expo-router';

export default function InventoryScreen() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<'all'|'tablets'|'capsules'|'syrup'|'injection'>('all');
  const [items, setItems] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try { setItems(await PharmacyAPI.listInventory()); }
      finally { setLoading(false); }
    })();
  }, []);

  const filtered = useMemo(() =>
    items.filter(m =>
      (category === 'all' || m.category.toLowerCase() === category) &&
      m.name.toLowerCase().includes(search.toLowerCase())
    ), [items, search, category]);

  return (
    <View className="flex-1 bg-white">
      <PharmacyHeader title="Medicine Inventory" badgeCount={2} />
      <View className="p-4 gap-3">
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search medicines…"
          className="h-12 rounded-xl border border-gray-300 px-3"
        />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="my-1">
          {(['all','tablets','capsules','syrup','injection'] as const).map(c => (
            <TouchableOpacity key={c} onPress={() => setCategory(c)}
              className={`px-3 py-2 mr-2 rounded-full border ${category===c?'bg-[#E6F5F3] border-[#139D92]':'border-gray-300'}`}>
              <Text className={`text-sm ${category===c?'text-[#139D92]':'text-gray-700'}`}>{c[0].toUpperCase()+c.slice(1)}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Button title="+ Add Medicine" onPress={() => router.push('/pharmacy/add-medicine')} />

        <ScrollView className="mt-3">
          {loading ? (
            <Text className="text-center text-gray-500 mt-10">Loading…</Text>
          ) : filtered.length ? (
            filtered.map(m => (
              <Card key={m.id} className="mb-3">
                <CardContent>
                  <View className="flex-row gap-4">
                    <View className="w-16 h-16 bg-gray-100 rounded-xl items-center justify-center">
                      <Text className="text-[#139D92] font-semibold">{m.name.charAt(0)}</Text>
                    </View>
                    <View className="flex-1">
                      <View className="flex-row justify-between">
                        <Text className="font-medium" numberOfLines={1}>{m.name}</Text>
                        <Text className="text-gray-600 text-xs">{m.category}</Text>
                      </View>
                      <View className="flex-row justify-between mt-1">
                        <Text className="font-medium">LKR {m.price.toFixed(2)}</Text>
                        <Text className="text-gray-600 text-sm">Stock: {m.stockQty}</Text>
                        <Text className="text-gray-600 text-sm">Exp: {new Date(m.expiryDate).toLocaleDateString()}</Text>
                      </View>
                    </View>
                  </View>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="py-12">
              <CardContent>
                <Text className="text-center text-gray-600">No medicines found</Text>
                <Button title="Add New Medicine" onPress={() => router.push('/pharmacy/add-medicine')} className="mt-3" />
              </CardContent>
            </Card>
          )}
        </ScrollView>
      </View>
    </View>
  );
}