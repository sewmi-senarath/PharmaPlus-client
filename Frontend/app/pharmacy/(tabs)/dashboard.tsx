import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { router } from 'expo-router';

import PharmacyHeader from '@/modules/pharmacy/components/PharmacyHeader';
import { Card, CardContent } from '@/modules/pharmacy/components/ui/Card';
import Button from '@/modules/pharmacy/components/ui/Button';
import { PharmacyAPI } from '@/modules/pharmacy/components/services/pharmacy.api';

export default function DashboardScreen() {
  const [pharmacyName, setPharmacyName] = useState<string>('Pharmacy');

  useEffect(() => {
    (async () => {
      try {
        const info = await PharmacyAPI.getInfo();
        if (info?.name) setPharmacyName(info.name);
      } catch {
        // ignore; keep fallback name
      }
    })();
  }, []);

  const metrics = [
    { title: 'Total Medicines', value: '1,247' },
    { title: 'Low Stock', value: '23' },
    { title: 'Expiry Alerts', value: '8' },
    { title: 'Incoming Orders', value: '15' },
  ];

  const actions = [
    // Non-tab screens
    { label: 'Add Medicine',   to: '/pharmacy/add-medicine' },
    { label: 'Pharmacy Hours', to: '/pharmacy/availability' },
    // Tab screens
    { label: 'View Inventory', to: '/pharmacy/inventory' },
    { label: 'Orders',         to: '/pharmacy/orders' },
  ];

  return (
    <View className="flex-1 bg-[#E6F5F3]">
      {/* header shows pharmacy name */}
      <PharmacyHeader title={pharmacyName} badgeCount={3} />

      <ScrollView contentContainerClassName="p-4 gap-4">
        {/* small subtitle under header */}
        <Text className="text-base font-semibold mb-1">Pharmacy Dashboard</Text>

        <View className="flex-row flex-wrap -mx-2">
          {metrics.map((m, i) => (
            <View key={i} className="w-1/2 px-2 mb-4">
              <Card>
                <CardContent>
                  <Text className="text-gray-500 text-xs">{m.title}</Text>
                  <Text className="text-2xl font-semibold mt-1">{m.value}</Text>
                </CardContent>
              </Card>
            </View>
          ))}
        </View>

        <Card>
          <CardContent>
            <Text className="text-base font-semibold mb-3">Quick Actions</Text>
            <View className="flex-row flex-wrap -mx-2">
              {actions.map((a) => (
                <View key={a.label} className="w-1/2 px-2 mb-3">
                  <Button
                    title={a.label}
                    variant="outline"
                    onPress={() => router.push(a.to as any)}
                  />
                </View>
              ))}
            </View>
          </CardContent>
        </Card>
      </ScrollView>
    </View>
  );
}