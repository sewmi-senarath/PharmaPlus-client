import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Card, CardContent } from '../ui/Card';
import ToggleSwitch from './ToggleSwitch';
import { PharmacyFormData } from '../hooks/usePharmacyForm';

type Props = {
  formData: PharmacyFormData;
  updateField: <K extends keyof PharmacyFormData>(
    key: K,
    value: PharmacyFormData[K]
  ) => void;
  updateOpeningHour: (
    dayIndex: number,
    field: 'open' | 'close' | 'closed',
    value: string | boolean
  ) => void;
};

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function Step3Hours({ formData, updateField, updateOpeningHour }: Props) {
  return (
    <Card>
      <CardContent>
        <Text className="text-xl font-bold mb-4 text-[#139D92]">Operating Hours</Text>

        <View className="mb-4">
          <View className="flex-row items-center justify-between mb-4 bg-gray-50 p-4 rounded-xl">
            <View>
              <Text className="font-medium text-gray-700">24/7 Operation</Text>
              <Text className="text-sm text-gray-500">Enable round-the-clock service</Text>
            </View>
            <ToggleSwitch
              value={formData.is24x7}
              onValueChange={(v) => updateField('is24x7', v)}
            />
          </View>
        </View>

        {!formData.is24x7 && (
          <View>
            {formData.openingHours.map((hour, idx) => (
              <View key={idx} className="mb-3 p-3 bg-gray-50 rounded-xl">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="font-medium text-gray-700">{DAYS[idx]}</Text>
                  <TouchableOpacity
                    onPress={() => updateOpeningHour(idx, 'closed', !hour.closed)}
                    className={`px-3 py-1 rounded-full ${
                      hour.closed ? 'bg-red-100' : 'bg-green-100'
                    }`}
                  >
                    <Text
                      className={`text-xs font-medium ${
                        hour.closed ? 'text-red-700' : 'text-green-700'
                      }`}
                    >
                      {hour.closed ? 'Closed' : 'Open'}
                    </Text>
                  </TouchableOpacity>
                </View>

                {!hour.closed && (
                  <View className="flex-row gap-3">
                    <View className="flex-1">
                      <Text className="text-xs text-gray-600 mb-1">Opening</Text>
                      <TextInput
                        value={hour.open}
                        onChangeText={(t) => updateOpeningHour(idx, 'open', t)}
                        placeholder="08:00"
                        className="h-10 rounded-lg border border-gray-300 px-3 bg-white text-center"
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="text-xs text-gray-600 mb-1">Closing</Text>
                      <TextInput
                        value={hour.close}
                        onChangeText={(t) => updateOpeningHour(idx, 'close', t)}
                        placeholder="20:00"
                        className="h-10 rounded-lg border border-gray-300 px-3 bg-white text-center"
                      />
                    </View>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
      </CardContent>
    </Card>
  );
}