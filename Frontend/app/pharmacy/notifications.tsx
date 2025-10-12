import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import PharmacyHeader from './components/ui/PharmacyHeader';
import { Card, CardContent } from './components/ui/Card';
import { PharmacyAPI } from './components/services/pharmacy.api';

type Noti = { id: string; title: string; message: string; createdAt: string; read?: boolean };

export default function NotificationsScreen() {
  const [items, setItems] = useState<Noti[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try { setItems(await PharmacyAPI.listNotifications() as Noti[]); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const mark = async (id: string) => {
    await PharmacyAPI.markNotificationRead(id);
    setItems(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <View className="flex-1 bg-white">
      <PharmacyHeader title="Notifications" showBack onBack={() => history.back()} />
      <ScrollView contentContainerClassName="p-4">
        {loading ? <Text className="text-center text-gray-500 mt-10">Loading…</Text> :
          items.map(n => (
            <Card key={n.id} className={`mb-3 ${n.read ? '' : 'border-l-4 border-l-[#139D92]'}`}>
              <CardContent>
                <View className="flex-row justify-between">
                  <Text className="font-medium">{n.title}</Text>
                  <Text className="text-gray-600 text-xs">{new Date(n.createdAt).toLocaleString()}</Text>
                </View>
                <Text className="text-gray-700 mt-1">{n.message}</Text>
                {!n.read && (
                  <TouchableOpacity onPress={() => mark(n.id)} className="mt-2">
                    <Text className="text-[#139D92] font-medium">Mark as read</Text>
                  </TouchableOpacity>
                )}
              </CardContent>
            </Card>
          ))
        }
      </ScrollView>
    </View>
  );
}