import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { medicineApi } from "@/lib/api";
import { useCartContext } from "../cart/CartContext";
import CartDrawer from "../cart/CartDrawer";

type PharmacyInfo = {
  _id: string;
  pharmacyName: string;
  address: {
    line1: string;
    line2: string;
    city: string;
    district: string;
    postalCode: string;
  };
};

type UiMedicine = { 
  id: string;
  title: string;
  subtitle?: string;
  price: number;
  medicineName: string;
  brandName: string;
  manufacturer: string;
  dosage: string;
  doseForm: string;
  category: string;
  pharmacy?: PharmacyInfo;
};

import { ApiMedicine } from "@/lib/types";

export default function OrderMedition() {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [medicines, setMedicines] = useState<UiMedicine[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { addToCart, cart } = useCartContext();

  useEffect(() => {
    let mounted = true;
    async function run() {
      setLoading(true);
      setError(null);
      try {
        const response = await medicineApi.list();
        if (!mounted) return;
        if (!response.success) {
          throw new Error(response.message);
        }
        const data = response.data;
        console.log('Received medicines:', data); // Debug log
        
        const mapped: UiMedicine[] = data.map((medicine: ApiMedicine) => {
          const key = medicine._id;
          const title = medicine.medicineName;
          const flags: string[] = [];
          if (medicine.lowStock) flags.push("Low stock");
          if (medicine.soonToExpire) flags.push("Expiring soon");
          if (medicine.isOnDiscount) flags.push(`${medicine.discountPct}% OFF`);
          
          const details = [
            `${medicine.dosage} ${medicine.doseForm}`,
            `By ${medicine.manufacturer}`,
            `${medicine.category}`,
            `SKU: ${medicine.skuCode}`,
            medicine.pharmacyId ? `Pharmacy: ${medicine.pharmacyId.pharmacyName}` : undefined
          ].filter(Boolean);

          const subtitle = [
            `LKR ${medicine.price.toFixed(2)}`,
            `${medicine.stockQty} in stock`,
            flags.length ? flags.join(" · ") : undefined,
            medicine.batches?.[0]?.expiry ? `Expires: ${new Date(medicine.batches[0].expiry).toLocaleDateString()}` : undefined,
            details.join(" · ")
          ].filter(Boolean).join("\n");

          return { 
            id: key, 
            title, 
            subtitle, 
            price: medicine.price,
            medicineName: medicine.medicineName,
            brandName: medicine.brandName,
            manufacturer: medicine.manufacturer,
            dosage: medicine.dosage,
            doseForm: medicine.doseForm,
            category: medicine.category,
            pharmacy: medicine.pharmacyId
          };
        });
        setMedicines(mapped);
      } catch (e: any) {
        setError(e?.message || "Failed to load medicines");
      } finally {
        setLoading(false);
      }
    }
    run();
    return () => { mounted = false; };
  }, []);

  const onAdd = (m: UiMedicine) => {
    addToCart({
      id: m.id,
      skuCode: m.title,
      name: m.title,
      price: m.price,
      quantity: 1
    });
  };

  const onVoice = () => Alert.alert("Voice Search", "Coming soon");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return medicines;
    return medicines.filter(s => s.title.toLowerCase().includes(q));
  }, [query, medicines]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <CartDrawer isVisible={isCartOpen} onClose={() => setIsCartOpen(false)} />
      
      <View className="px-5 mt-3 flex-row items-center justify-between">
        <Text className="text-xl font-semibold">My Health Hub</Text>
        <Pressable onPress={() => setIsCartOpen(true)} className="relative">
          <Ionicons name="cart-outline" size={24} color="#0d9488" />
          {cart.items.length > 0 && (
            <View className="absolute -top-2 -right-2 bg-teal-600 rounded-full w-5 h-5 items-center justify-center">
              <Text className="text-white text-xs">{cart.items.length}</Text>
            </View>
          )}
        </Pressable>
      </View>

      <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Search + Voice */}
        <View className="mt-4">
          <View className="bg-white border rounded-xl px-3 py-2 flex-row items-center gap-2">
            <Ionicons name="search-outline" size={18} color="#475569" />
            <TextInput
              placeholder="Search medicines..."
              value={query}
              onChangeText={setQuery}
              className="flex-1"
            />
          </View>
          <Pressable onPress={onVoice} className="items-center mt-2 py-2">
            <View className="flex-row items-center gap-2">
              <Ionicons name="mic-outline" size={16} color="#0d9488" />
              <Text className="text-teal-700">Voice Search</Text>
            </View>
          </Pressable>
        </View>

        {/* Results */}
        <View className="mt-2">
          {loading && (
            <View className="items-center py-6">
              <ActivityIndicator />
              <Text className="text-xs text-gray-500 mt-2">Loading medicines…</Text>
            </View>
          )}
          {!!error && !loading && (
            <View className="bg-rose-50 border border-rose-200 rounded-xl p-3 mb-2">
              <Text className="text-rose-600">{error}</Text>
            </View>
          )}
          {!loading && !error && filtered.map(m => (
            <View key={m.id} className="bg-gray-50 rounded-2xl px-4 py-3 mb-2">
              <View className="flex-row items-start justify-between">
                <View className="flex-1 pr-3">
                  <Text className="font-semibold text-gray-800 text-lg">{m.medicineName}</Text>
                  <Text className="text-sm text-gray-600">{m.brandName} • {m.manufacturer}</Text>
                  <Text className="text-xs text-gray-500 mt-1">{m.dosage} {m.doseForm} • {m.category}</Text>
                </View>
                <View>
                  <Text className="text-lg font-bold text-teal-600">LKR {m.price.toFixed(2)}</Text>
                  <Pressable 
                    onPress={() => onAdd(m)} 
                    className="bg-teal-600 rounded-lg px-4 py-2 mt-2"
                  >
                    <Text className="text-white font-medium text-center">Add to Cart</Text>
                  </Pressable>
                </View>
              </View>
              {!!m.subtitle && (
                <View className="mt-2 pt-2 border-t border-gray-200">
                  <Text className="text-xs text-gray-500">{m.subtitle}</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom nav */}
      <View className="absolute left-0 right-0 flex-row justify-around border-t bg-white" style={{ bottom: Math.max(insets.bottom, 0), paddingVertical: 8 }}>
        <View className="items-center"><Ionicons name="home-outline" size={18} color="#475569"/><Text className="text-xs text-slate-500">Home</Text></View>
        <View className="items-center"><Ionicons name="search-outline" size={18} color="#0d9488"/><Text className="text-xs text-teal-700">Search</Text></View>
        <Pressable onPress={() => setIsCartOpen(true)} className="items-center relative">
          <Ionicons name="cart-outline" size={18} color="#475569"/>
          <Text className="text-xs text-slate-500">Cart</Text>
          {cart.items.length > 0 && (
            <View className="absolute -top-1 -right-1 bg-teal-600 rounded-full w-4 h-4 items-center justify-center">
              <Text className="text-white text-xs">{cart.items.length}</Text>
            </View>
          )}
        </Pressable>
        <View className="items-center"><Ionicons name="medkit-outline" size={18} color="#475569"/><Text className="text-xs text-slate-500">Medications</Text></View>
        <View className="items-center"><Ionicons name="person-outline" size={18} color="#475569"/><Text className="text-xs text-slate-500">Profile</Text></View>
      </View>
    </SafeAreaView>
  );
}
