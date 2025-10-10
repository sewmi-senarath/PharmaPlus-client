import React, { useState } from "react";
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";

export default function AdminMedicineAdd() {
  const insets = useSafeAreaInsets();
  const [pharmacyId, setPharmacyId] = useState<string>(process.env.EXPO_PUBLIC_PHARMACY_ID || "");
  const [masterMedicineId, setMasterMedicineId] = useState(""); // optional
  const [skuCode, setSkuCode] = useState("");
  const [price, setPrice] = useState("");
  const [stockQty, setStockQty] = useState("");
  const [minQty, setMinQty] = useState("");
  const [discountPct, setDiscountPct] = useState("");
  const [barcode, setBarcode] = useState("");
  const [batchNo, setBatchNo] = useState("");
  const [expiry, setExpiry] = useState(""); // YYYY-MM-DD
  const [batchQty, setBatchQty] = useState("");
  const [saving, setSaving] = useState(false);

  const getBaseUrl = () => {
    const base = process.env.EXPO_PUBLIC_API_BASE_URL;
    if (!base) throw new Error("EXPO_PUBLIC_API_BASE_URL is not set");
    return base.replace(/\/$/, "");
  };

  const onSave = async () => {
    if (!pharmacyId) {
      Alert.alert("Missing", "Please enter Pharmacy ID (from your backend database)");
      return;
    }
    if (!price || isNaN(Number(price))) {
      Alert.alert("Invalid", "Enter a valid price");
      return;
    }
    if (!stockQty || isNaN(Number(stockQty))) {
      Alert.alert("Invalid", "Enter a valid stock quantity");
      return;
    }
    // Client-side rule: sum of batches must equal stockQty (we have one batch here)
    const stock = Number(stockQty);
    const bQty = batchQty ? Number(batchQty) : 0;
    if (bQty !== stock) {
      Alert.alert("Mismatch", "Batch quantity must equal Stock Quantity");
      return;
    }
    if (!batchNo || !expiry) {
      Alert.alert("Missing", "Please fill Batch No and Expiry (YYYY-MM-DD)");
      return;
    }
    // Expiry must be in the future (align with Joi .greater("now"))
    const expDate = new Date(expiry);
    if (!(expDate instanceof Date) || isNaN(expDate.getTime()) || expDate <= new Date()) {
      Alert.alert("Invalid Expiry", "Expiry must be a future date (YYYY-MM-DD)");
      return;
    }

    try {
      setSaving(true);
      const url = `${getBaseUrl()}/pharmacies/${encodeURIComponent(pharmacyId)}/add`;
      const body = {
        ...(masterMedicineId ? { masterMedicineId } : {}),
        skuCode: skuCode || undefined,
        price: Number(price),
        stockQty: Number(stockQty),
        minQty: minQty ? Number(minQty) : undefined,
        discountPct: discountPct ? Number(discountPct) : undefined,
        barcodes: barcode ? [barcode] : [],
        batches: [{ batchNo, expiry, qty: batchQty ? Number(batchQty) : 0 }],
        // images: [] // optional
      } as any;

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add Authorization header here if your backend requires a token
        },
        body: JSON.stringify(body),
      });

      const data = await res.json().catch(() => ({} as any));
      if (!res.ok) {
        const message = data?.message || `Request failed (${res.status})`;
        throw new Error(message);
      }

      Alert.alert("Success", "Medicine saved successfully", [
        { text: "OK", onPress: () => router.back() },
      ]);
      return;
    } catch (e: any) {
      Alert.alert("Failed", e?.message || "Unexpected error while saving");
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 120 }}>
        <Text className="text-xl font-bold mt-4 mb-3">Add Medicine (Admin)</Text>

        <View className="bg-white rounded-2xl p-4 mb-4">
          <Text className="text-gray-600 mb-1">Pharmacy ID</Text>
          <TextInput value={pharmacyId} onChangeText={setPharmacyId} placeholder="e.g. 66f1c1..." className="border rounded px-3 py-2" />
          <Text className="text-xs text-gray-500 mt-1">Tip: set EXPO_PUBLIC_PHARMACY_ID in .env to prefill this</Text>
        </View>

        <View className="bg-white rounded-2xl p-4 mb-4">
          <Text className="text-gray-600 mb-1">Master Medicine ID (optional)</Text>
          <TextInput value={masterMedicineId} onChangeText={setMasterMedicineId} placeholder="If selected from master catalog" className="border rounded px-3 py-2" />
        </View>

        <View className="bg-white rounded-2xl p-4 mb-4">
          <Text className="text-gray-600 mb-1">SKU Code (optional)</Text>
          <TextInput value={skuCode} onChangeText={setSkuCode} placeholder="SKU-123" className="border rounded px-3 py-2" />
        </View>

        <View className="bg-white rounded-2xl p-4 mb-4">
          <Text className="text-gray-600 mb-1">Price</Text>
          <TextInput value={price} onChangeText={setPrice} keyboardType="numeric" placeholder="0" className="border rounded px-3 py-2" />

          <Text className="text-gray-600 mb-1 mt-3">Stock Quantity</Text>
          <TextInput value={stockQty} onChangeText={setStockQty} keyboardType="numeric" placeholder="0" className="border rounded px-3 py-2" />

          <Text className="text-gray-600 mb-1 mt-3">Min Quantity (optional)</Text>
          <TextInput value={minQty} onChangeText={setMinQty} keyboardType="numeric" placeholder="0" className="border rounded px-3 py-2" />

          <Text className="text-gray-600 mb-1 mt-3">Discount % (optional)</Text>
          <TextInput value={discountPct} onChangeText={setDiscountPct} keyboardType="numeric" placeholder="0" className="border rounded px-3 py-2" />
        </View>

        <View className="bg-white rounded-2xl p-4 mb-4">
          <Text className="text-gray-600 mb-1">Barcode (optional)</Text>
          <TextInput value={barcode} onChangeText={setBarcode} placeholder="e.g. 8901234567890" className="border rounded px-3 py-2" />
        </View>

        <View className="bg-white rounded-2xl p-4 mb-4">
          <Text className="font-semibold mb-2">Batch</Text>
          <Text className="text-gray-600 mb-1">Batch No</Text>
          <TextInput value={batchNo} onChangeText={setBatchNo} placeholder="B-001" className="border rounded px-3 py-2" />

          <Text className="text-gray-600 mb-1 mt-2">Expiry (YYYY-MM-DD)</Text>
          <TextInput value={expiry} onChangeText={setExpiry} placeholder="2026-12-31" className="border rounded px-3 py-2" />

          <Text className="text-gray-600 mb-1 mt-2">Quantity</Text>
          <TextInput value={batchQty} onChangeText={setBatchQty} keyboardType="numeric" placeholder="0" className="border rounded px-3 py-2" />
        </View>
      </ScrollView>

      <View style={{ paddingBottom: Math.max(insets.bottom, 16) }} className="px-5 pb-4 bg-white">
        <TouchableOpacity disabled={saving} onPress={onSave} className={`rounded-xl py-4 ${saving ? 'bg-gray-300' : 'bg-emerald-600'}`}>
          <Text className="text-center text-white font-semibold">{saving ? 'Saving…' : 'Save'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
