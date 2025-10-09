import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { Card, CardContent } from '@/modules/pharmacy/components/ui/Card';
import LocationPicker from './LocationPicker';
import { PharmacyFormData } from '../hooks/usePharmacyForm';

type Props = {
  formData: PharmacyFormData;
  updateAddress: <K extends keyof PharmacyFormData['address']>(
    key: K,
    value: PharmacyFormData['address'][K]
  ) => void;
};

export default function Step2Address({ formData, updateAddress }: Props) {
  const handleAddressAutofill = (address: Partial<{
    city: string;
    district: string;
    postalCode: string;
    line1: string;
  }>) => {
    if (address.city && !formData.address.city) {
      updateAddress('city', address.city);
    }
    if (address.district && !formData.address.district) {
      updateAddress('district', address.district);
    }
    if (address.postalCode && !formData.address.postalCode) {
      updateAddress('postalCode', address.postalCode);
    }
    if (address.line1 && !formData.address.line1) {
      updateAddress('line1', address.line1);
    }
  };

  return (
    <Card>
      <CardContent>
        <Text className="text-xl font-bold mb-4 text-[#139D92]">Address & Location</Text>

        <LocationPicker
          coordinates={formData.address.coordinates}
          onLocationSelected={(coords) => updateAddress('coordinates', coords)}
          onAddressAutofill={handleAddressAutofill}
        />

        <View className="mb-4">
          <Text className="mb-2 font-medium text-gray-700">Address Line 1 *</Text>
          <TextInput
            value={formData.address.line1}
            onChangeText={(t) => updateAddress('line1', t)}
            placeholder="Street address, building number"
            className="h-12 rounded-xl border border-gray-300 px-4 bg-white"
          />
        </View>

        <View className="mb-4">
          <Text className="mb-2 font-medium text-gray-700">Address Line 2</Text>
          <TextInput
            value={formData.address.line2}
            onChangeText={(t) => updateAddress('line2', t)}
            placeholder="Apartment, suite, unit (optional)"
            className="h-12 rounded-xl border border-gray-300 px-4 bg-white"
          />
        </View>

        <View className="flex-row gap-3 mb-4">
          <View className="flex-1">
            <Text className="mb-2 font-medium text-gray-700">City *</Text>
            <TextInput
              value={formData.address.city}
              onChangeText={(t) => updateAddress('city', t)}
              placeholder="Colombo"
              className="h-12 rounded-xl border border-gray-300 px-4 bg-white"
            />
          </View>
          <View className="flex-1">
            <Text className="mb-2 font-medium text-gray-700">District *</Text>
            <TextInput
              value={formData.address.district}
              onChangeText={(t) => updateAddress('district', t)}
              placeholder="Western"
              className="h-12 rounded-xl border border-gray-300 px-4 bg-white"
            />
          </View>
        </View>

        <View className="mb-4">
          <Text className="mb-2 font-medium text-gray-700">Postal Code</Text>
          <TextInput
            value={formData.address.postalCode}
            onChangeText={(t) => updateAddress('postalCode', t)}
            placeholder="00100"
            keyboardType="numeric"
            className="h-12 rounded-xl border border-gray-300 px-4 bg-white"
          />
        </View>
      </CardContent>
    </Card>
  );
}