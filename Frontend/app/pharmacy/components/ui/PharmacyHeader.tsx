import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function PharmacyHeader({
  title, showBack, onBack, showBell = true, badgeCount = 0
}: { title: string; showBack?: boolean; onBack?: () => void; showBell?: boolean; badgeCount?: number; }) {
  return (
    <View className="flex-row items-center justify-between p-4 bg-[#139D92]">
      <View className="flex-row items-center gap-2">
        {showBack ? (
          <TouchableOpacity onPress={onBack} className="p-2 -ml-2">
            <Ionicons name="arrow-back" size={20} color="white" />
          </TouchableOpacity>
        ) : null}
        <Text className="text-white text-lg font-semibold">{title}</Text>
      </View>
      {showBell ? (
        <View className="relative p-2">
          <Ionicons name="notifications-outline" color="white" size={20} />
          {badgeCount > 0 && (
            <View className="absolute -top-1 -right-1 bg-red-500 rounded-full w-4 h-4 items-center justify-center">
              <Text className="text-white text-[10px]">{badgeCount}</Text>
            </View>
          )}
        </View>
      ) : null}
    </View>
  );
}