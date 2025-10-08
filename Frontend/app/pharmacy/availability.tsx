import React, { useEffect, useState } from 'react';
import { View, Text, Switch, TextInput, ScrollView } from 'react-native';
import PharmacyHeader from '../../src/modules/pharmacy/components/PharmacyHeader';
import { Card, CardContent } from '../../src/modules/pharmacy/components/ui/Card';
import Button from '../../src/modules/pharmacy/components/ui/Button';
import { PharmacyAPI } from '../../src/modules/pharmacy/components/services/pharmacy.api';
import type { Availability } from '../../src/modules/pharmacy/types';
import { router } from 'expo-router';

export default function AvailabilityScreen() {
  const [state, setState] = useState<Availability>({
    isOpen: true, is24h:false, opening:'08:00', closing:'22:00',
    days: { monday:true, tuesday:true, wednesday:true, thursday:true, friday:true, saturday:true, sunday:false },
  });

  useEffect(() => {
    (async () => {
      try { setState(await PharmacyAPI.getAvailability()); } catch {}
    })();
  }, []);

  const save = async () => { await PharmacyAPI.saveAvailability(state); router.back(); };

  return (
    <View className="flex-1 bg-white">
      <PharmacyHeader title="Pharmacy Availability" showBack onBack={() => router.back()} />
      <ScrollView contentContainerClassName="p-4 gap-4">
        <Card><CardContent>
          <View className="flex-row items-center justify-between">
            <View><Text className="font-medium">Pharmacy Open</Text><Text className="text-gray-600 text-sm">Manually open/close</Text></View>
            <Switch value={state.isOpen} onValueChange={(v)=>setState(s=>({...s, isOpen:v}))} />
          </View>
        </CardContent></Card>

        <Card><CardContent>
          <View className="flex-row items-center justify-between">
            <View><Text className="font-medium">24/7 Operation</Text><Text className="text-gray-600 text-sm">Enable round-the-clock service</Text></View>
            <Switch value={state.is24h} onValueChange={(v)=>setState(s=>({...s, is24h:v}))} />
          </View>

          {!state.is24h && (
            <View className="mt-4 flex-row gap-3">
              <View className="flex-1">
                <Text className="mb-1">Opening</Text>
                <TextInput value={state.opening} onChangeText={(t)=>setState(s=>({...s, opening:t}))} className="h-12 rounded-xl border px-3" />
              </View>
              <View className="flex-1">
                <Text className="mb-1">Closing</Text>
                <TextInput value={state.closing} onChangeText={(t)=>setState(s=>({...s, closing:t}))} className="h-12 rounded-xl border px-3" />
              </View>
            </View>
          )}
        </CardContent></Card>

        {!state.is24h && (
          <Card><CardContent>
            {Object.entries(state.days).map(([d,v])=>(
              <View key={d} className="flex-row items-center justify-between py-2">
                <Text className="capitalize">{d}</Text>
                <Switch value={v} onValueChange={(nv)=>setState(s=>({ ...s, days:{...s.days, [d]: nv} }))} />
              </View>
            ))}
          </CardContent></Card>
        )}

        <Button title="Save Availability Settings" onPress={save} />
      </ScrollView>
    </View>
  );
}