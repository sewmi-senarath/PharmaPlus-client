import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, ScrollView } from 'react-native';
import PharmacyHeader from '../../src/modules/pharmacy/components/PharmacyHeader';
import { Card, CardContent } from '../../src/modules/pharmacy/components/ui/Card';
import Button from '../../src/modules/pharmacy/components/ui/Button';
import type { UpsertMedicine } from '../../src/modules/pharmacy/types';
import { PharmacyAPI } from '../../src/modules/pharmacy/components/services/pharmacy.api';
import { router } from 'expo-router';

const CATS = ['Tablets','Syrup','Injection','Capsules','Drops','Ointment','Inhaler'] as const;
const ADVICE: Record<string,string> = {
  Tablets:'Store in a cool, dry place away from sunlight.',
  Syrup:'Store at room temperature; shake well before use.',
  Injection:'Refrigerate 2-8°C. Do not freeze.',
  Capsules:'Keep dry; avoid heat.', Drops:'Follow bottle instructions.',
  Ointment:'Store at room temp; close tube tightly.',
  Inhaler:'Keep away from heat and sunlight.',
};

export default function AddMedicineScreen() {
  const [form, setForm] = useState<UpsertMedicine>({
    name:'', category:'Tablets', price:0, stockQty:0, expiryDate: new Date().toISOString().slice(0,10),
  });
  const [saving, setSaving] = useState(false);
  const storageAdvice = useMemo(() => ADVICE[form.category] ?? '', [form.category]);

  const set = <K extends keyof UpsertMedicine>(k: K, v: UpsertMedicine[K]) => setForm(p => ({...p, [k]: v}));

  const save = async () => {
    setSaving(true);
    try {
      await PharmacyAPI.createMedicine({ ...form, storageAdvice });
      router.replace('/pharmacy/inventory');
    } finally { setSaving(false); }
  };

  return (
    <View className="flex-1 bg-white">
      <PharmacyHeader title="Add Medicine" showBack onBack={() => router.back()} />
      <ScrollView contentContainerClassName="p-4 gap-4">
        <Card><CardContent>
          <Text className="mb-1">Medicine Name</Text>
          <TextInput value={form.name} onChangeText={t=>set('name', t)} placeholder="e.g., Paracetamol 500mg" className="h-12 rounded-xl border px-3 mb-3" />

          <Text className="mb-1">Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3">
            {CATS.map(c => (
              <Button key={c} title={c} variant={form.category===c?'solid':'outline'} className="mr-2 h-10 px-3" onPress={()=>set('category', c)} />
            ))}
          </ScrollView>

          <View className="flex-row gap-3">
            <View className="flex-1">
              <Text className="mb-1">Price (LKR)</Text>
              <TextInput keyboardType="numeric" value={String(form.price||0)} onChangeText={t=>set('price', Number(t)||0)} className="h-12 rounded-xl border px-3" />
            </View>
            <View className="flex-1">
              <Text className="mb-1">Stock Qty</Text>
              <TextInput keyboardType="numeric" value={String(form.stockQty||0)} onChangeText={t=>set('stockQty', Number(t)||0)} className="h-12 rounded-xl border px-3" />
            </View>
          </View>

          <Text className="mt-3 mb-1">Expiry Date (YYYY-MM-DD)</Text>
          <TextInput value={form.expiryDate} onChangeText={t=>set('expiryDate', t)} className="h-12 rounded-xl border px-3" />

          {storageAdvice ? (
            <Card className="bg-blue-50 border-blue-200 mt-4"><CardContent>
              <Text className="font-medium mb-1 text-blue-900">Storage Advisor</Text>
              <Text className="text-blue-800">{storageAdvice}</Text>
            </CardContent></Card>
          ) : null}
        </CardContent></Card>

        <View className="flex-row gap-3">
          <Button title="Cancel" variant="outline" className="flex-1" onPress={()=>router.back()} />
          <Button title={saving ? 'Saving…':'Save Medicine'} className="flex-1" onPress={save} />
        </View>
      </ScrollView>
    </View>
  );
}