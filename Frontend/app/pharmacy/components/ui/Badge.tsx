import React, { PropsWithChildren } from 'react';
import { Text, View } from 'react-native';

export default function Badge({ children, className = '' as any }: PropsWithChildren<{ className?: any }>) {
  return (
    <View className={`px-2 py-1 rounded-md border border-gray-200 ${className}`}>
      <Text className="text-[10px] font-semibold">{children}</Text>
    </View>
  );
}