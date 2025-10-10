import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

type Props = {
  title: string;
  onPress?: () => void;
  variant?: 'solid' | 'outline' | 'ghost';
  className?: any;
  disabled?: boolean;
};
export default function Button({ title, onPress, variant='solid', className='', disabled }: Props) {
  const base = 'h-12 rounded-xl items-center justify-center';
  const variants = {
    solid: 'bg-[#139D92]',
    outline: 'border border-gray-300',
    ghost: '',
  } as const;
  return (
    <TouchableOpacity disabled={disabled} onPress={onPress} className={`${base} ${variants[variant]} ${className}`}>
      <Text className={`${variant === 'solid' ? 'text-white' : 'text-gray-900'} font-medium`}>{title}</Text>
    </TouchableOpacity>
  );
}