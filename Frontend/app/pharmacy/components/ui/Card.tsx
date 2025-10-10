import React, { PropsWithChildren } from 'react';
import { View } from 'react-native';

export function Card({ children, className = '' as any }: PropsWithChildren<{ className?: any }>) {
  return <View className={`bg-white rounded-2xl border border-gray-200 ${className}`}>{children}</View>;
}

export function CardContent({ children, className = '' as any }: PropsWithChildren<{ className?: any }>) {
  return <View className={`p-4 ${className}`}>{children}</View>;
}