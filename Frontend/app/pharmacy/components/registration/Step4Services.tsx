import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Card, CardContent } from '@/modules/pharmacy/components/ui/Card';
import { PharmacyFormData } from '../hooks/usePharmacyForm';

type Props = {
  formData: PharmacyFormData;
  updateField: <K extends keyof PharmacyFormData>(
    key: K,
    value: PharmacyFormData[K]
  ) => void;
  toggleService: (service: string) => void;
};

const SERVICES = [
  'Home Delivery',
  '24x7',
  'Emergency Services',
  'Prescription Filling',
  'Health Consultation'
];

export default function Step4Services({ formData, updateField, toggleService }: Props) {
  return (
    <View className="gap-4">
      <Card>
        <CardContent>
          <Text className="text-xl font-bold mb-4 text-[#139D92]">Services Offered</Text>

          <View className="flex-row flex-wrap gap-2 mb-4">
            {SERVICES.map((service) => (
              <TouchableOpacity
                key={service}
                onPress={() => toggleService(service)}
                className={`px-4 py-2 rounded-full border-2 ${
                  formData.pharmacyServices.includes(service)
                    ? 'bg-[#139D92] border-[#139D92]'
                    : 'bg-white border-gray-300'
                }`}
              >
                <Text
                  className={`font-medium ${
                    formData.pharmacyServices.includes(service)
                      ? 'text-white'
                      : 'text-gray-700'
                  }`}
                >
                  {service}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Text className="text-xl font-bold mb-4 text-[#139D92]">Delivery Settings</Text>

          <View className="mb-4">
            <Text className="mb-2 font-medium text-gray-700">Delivery Radius (km)</Text>
            <TextInput
              value={String(formData.deliveryRadiusKm)}
              onChangeText={(t) => updateField('deliveryRadiusKm', Number(t) || 0)}
              placeholder="5"
              keyboardType="numeric"
              className="h-12 rounded-xl border border-gray-300 px-4 bg-white"
            />
            <Text className="text-sm text-gray-500 mt-1">
              Set to 0 if not offering delivery services
            </Text>
          </View>
        </CardContent>
      </Card>

      <Card className="bg-green-50 border-green-200">
        <CardContent>
          <Text className="font-bold text-green-900 mb-2">✓ Ready to Register</Text>
          <Text className="text-green-800 text-sm">
            Review all information and submit to complete your pharmacy registration.
          </Text>
        </CardContent>
      </Card>
    </View>
  );
}