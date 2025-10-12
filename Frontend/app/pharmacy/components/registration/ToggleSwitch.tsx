import React from 'react';
import { TouchableOpacity, View } from 'react-native';

type Props = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
};

export default function ToggleSwitch({ value, onValueChange, disabled = false }: Props) {
  return (
    <TouchableOpacity
      onPress={() => !disabled && onValueChange(!value)}
      disabled={disabled}
      className={`w-14 h-8 rounded-full p-1 ${
        value ? 'bg-[#139D92]' : 'bg-gray-300'
      } ${disabled ? 'opacity-50' : ''}`}
    >
      <View 
        className={`w-6 h-6 bg-white rounded-full transition-all ${
          value ? 'ml-6' : 'ml-0'
        }`} 
      />
    </TouchableOpacity>
  );
}