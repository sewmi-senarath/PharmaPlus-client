import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import PharmacyHeader from '../../../src/modules/pharmacy/components/PharmacyHeader';
import { Card, CardContent } from '../../../src/modules/pharmacy/components/ui/Card';
import Button from '../../../src/modules/pharmacy/components/ui/Button';
import { PharmacyAPI } from '../../../src/modules/pharmacy/components/services/pharmacy.api';
import type { Order } from '../../../src/modules/pharmacy/types';

export default function OrdersScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try { setOrders(await PharmacyAPI.listOrders()); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const nextStatus = (s: Order['status']): Order['status'] => ({
    pending: 'accepted', accepted: 'in-progress', 'in-progress': 'completed', completed: 'completed'
  } as const)[s];

  const progress = async (o: Order) => {
    const upd = await PharmacyAPI.updateOrderStatus(o.id, nextStatus(o.status));
    setOrders(prev => prev.map(p => p.id === o.id ? upd : p));
  };

  return (
    <View className="flex-1 bg-white">
      <PharmacyHeader title="Orders" />
      <ScrollView contentContainerClassName="p-4">
        {loading ? <Text className="text-center text-gray-500 mt-10">Loading…</Text> :
          orders.map(o => (
            <Card key={o.id} className="mb-3">
              <CardContent>
                <View className="flex-row justify-between">
                  <Text className="font-medium">{o.customerName}</Text>
                  <Text className="text-gray-600 text-sm">{new Date(o.orderDate).toLocaleString()}</Text>
                </View>
                <Text className="text-gray-700 mt-1">Items: {o.items.length} • Total: LKR {o.totalAmount.toFixed(2)}</Text>
                <View className="flex-row gap-3 mt-3">
                  <Button title={o.status === 'completed' ? 'Completed' : 'Next Status'}
                          onPress={() => progress(o)}
                          variant={o.status === 'completed' ? 'outline' : 'solid'}
                          className="flex-1" />
                  <Button title="Refresh" variant="outline" className="flex-1" onPress={load} />
                </View>
              </CardContent>
            </Card>
          ))
        }
      </ScrollView>
    </View>
  );
}