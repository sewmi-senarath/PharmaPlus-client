import React, { useState, useEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import * as Location from 'expo-location';
import Button from '@/modules/pharmacy/components/ui/Button';

type Coordinates = { lng: number; lat: number };

type Props = {
  coordinates: Coordinates;
  onLocationSelected: (coords: Coordinates) => void;
  onAddressAutofill?: (address: Partial<{
    city: string;
    district: string;
    postalCode: string;
    line1: string;
  }>) => void;
};

export default function LocationPicker({ 
  coordinates, 
  onLocationSelected,
  onAddressAutofill 
}: Props) {
  const [loading, setLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Location.getForegroundPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const getCurrentLocation = async () => {
    try {
      setLoading(true);

      // Request permission
      let { status } = await Location.getForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        const { status: newStatus } = await Location.requestForegroundPermissionsAsync();
        if (newStatus !== 'granted') {
          Alert.alert('Permission Denied', 'Location permission is required.');
          return;
        }
        status = newStatus;
      }

      setHasPermission(true);

      // Get location
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      // Update coordinates
      onLocationSelected({
        lng: location.coords.longitude,
        lat: location.coords.latitude
      });

      // Reverse geocode
      if (onAddressAutofill) {
        const [address] = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        if (address) {
          onAddressAutofill({
            city: address.city || undefined,
            district: address.region || undefined,
            postalCode: address.postalCode || undefined,
            line1: address.street 
              ? `${address.street}${address.streetNumber ? ' ' + address.streetNumber : ''}` 
              : undefined,
          });
        }
      }

      Alert.alert('Success', 'Location captured successfully!');
    } catch (error) {
      console.error('Location error:', error);
      Alert.alert('Error', 'Failed to get location. Please enter manually.');
    } finally {
      setLoading(false);
    }
  };

  const hasCoordinates = coordinates.lat !== 0 && coordinates.lng !== 0;

  return (
    <View className="mb-4">
      <View className="flex-row items-center justify-between mb-2">
        <Text className="font-medium text-gray-700">GPS Location *</Text>
        {hasCoordinates && (
          <View className="bg-green-100 px-2 py-1 rounded">
            <Text className="text-xs text-green-700 font-medium">✓ Set</Text>
          </View>
        )}
      </View>

      <Button
        title={loading ? 'Getting Location...' : '📍 Use My Current Location'}
        onPress={getCurrentLocation}
        disabled={loading}
        variant="outline"
        className="mb-3"
      />

      {hasCoordinates && (
        <View className="bg-blue-50 p-3 rounded-xl border border-blue-200">
          <Text className="text-sm text-blue-900 font-medium mb-1">Coordinates:</Text>
          <Text className="text-xs text-blue-700">
            Lat: {coordinates.lat.toFixed(6)}
          </Text>
          <Text className="text-xs text-blue-700">
            Lng: {coordinates.lng.toFixed(6)}
          </Text>
        </View>
      )}
    </View>
  );
}