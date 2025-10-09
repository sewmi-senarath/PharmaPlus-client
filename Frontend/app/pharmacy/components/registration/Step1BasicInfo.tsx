import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { Card, CardContent } from '@/modules/pharmacy/components/ui/Card';
import DocumentPicker from './DocumentPicker';
import { PharmacyFormData } from '../hooks/usePharmacyForm';

type Props = {
  formData: PharmacyFormData;
  updateField: <K extends keyof PharmacyFormData>(
    key: K,
    value: PharmacyFormData[K]
  ) => void;
};

export default function Step1BasicInfo({ formData, updateField }: Props) {
  return (
    <Card>
      <CardContent>
        <Text className="text-xl font-bold mb-4 text-[#139D92]">Basic Information</Text>

        <View className="mb-4">
          <Text className="mb-2 font-medium text-gray-700">Pharmacy Name *</Text>
          <TextInput
            value={formData.pharmacyName}
            onChangeText={(t) => updateField('pharmacyName', t)}
            placeholder="e.g., Green Cross Pharmacy"
            className="h-12 rounded-xl border border-gray-300 px-4 bg-white"
          />
        </View>

        <View className="mb-4">
          <Text className="mb-2 font-medium text-gray-700">Email Address *</Text>
          <TextInput
            value={formData.pharmacyEmail}
            onChangeText={(t) => updateField('pharmacyEmail', t)}
            placeholder="pharmacy@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            className="h-12 rounded-xl border border-gray-300 px-4 bg-white"
          />
        </View>

        <View className="mb-4">
          <Text className="mb-2 font-medium text-gray-700">Phone Number *</Text>
          <TextInput
            value={formData.pharmacyPhone}
            onChangeText={(t) => updateField('pharmacyPhone', t)}
            placeholder="+94 77 123 4567"
            keyboardType="phone-pad"
            className="h-12 rounded-xl border border-gray-300 px-4 bg-white"
          />
        </View>

        <View className="mb-4">
          <Text className="mb-2 font-medium text-gray-700">License Number *</Text>
          <TextInput
            value={formData.pharmacyLicenseNumber}
            onChangeText={(t) => updateField('pharmacyLicenseNumber', t)}
            placeholder="LIC-12345"
            className="h-12 rounded-xl border border-gray-300 px-4 bg-white"
          />
        </View>

        <DocumentPicker
          document={formData.registrationDocument}
          onDocumentSelected={(doc) => updateField('registrationDocument', doc)}
        />
      </CardContent>
    </Card>
  );
}