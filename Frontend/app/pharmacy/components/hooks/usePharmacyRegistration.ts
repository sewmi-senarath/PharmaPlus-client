import { useState } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PharmacyFormData } from './usePharmacyForm';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://192.168.1.10:5000:5000/api';

export const usePharmacyRegistration = (formData: PharmacyFormData) => {
  const [submitting, setSubmitting] = useState(false);

  const uploadDocument = async () => {
    if (!formData.registrationDocument) return '';

    const uploadFormData = new FormData();
    uploadFormData.append('file', {
      uri: formData.registrationDocument.uri,
      name: formData.registrationDocument.name,
      type: formData.registrationDocument.type,
    } as any);

    const response = await fetch(`${API_BASE_URL}/pharmacy/upload-document`, {
      method: 'POST',
      body: uploadFormData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to upload document');
    }

    const result = await response.json();
    return result.url || result.filePath;
  };

  const registerPharmacy = async (documentUrl: string) => {
    // Get user ID from AsyncStorage
    const userId = await AsyncStorage.getItem('userId');
    
    if (!userId) {
      throw new Error('User ID not found. Please login again.');
    }

    const payload = {
      pharmacyName: formData.pharmacyName,
      pharmacyEmail: formData.pharmacyEmail,
      pharmacyPhone: formData.pharmacyPhone,
      pharmacyLicenseNumber: formData.pharmacyLicenseNumber,
      address: {
        line1: formData.address.line1,
        line2: formData.address.line2,
        city: formData.address.city,
        district: formData.address.district,
        postalCode: formData.address.postalCode,
        geo: {
          type: 'Point',
          coordinates: [
            formData.address.coordinates.lng,
            formData.address.coordinates.lat
          ]
        }
      },
      openingHours: formData.openingHours,
      isAvailable: formData.isAvailable,
      pharmacyServices: formData.pharmacyServices,
      deliveryRadiusKm: formData.deliveryRadiusKm,
      registrationDocument: documentUrl,
      createdBy: userId,  // links pharmacy to user
      updatedBy: userId,
    };

    console.log('Registering pharmacy with payload:', { ...payload, registrationDocument: '...' });

    const response = await fetch(`${API_BASE_URL}/pharmacy/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Registration failed');
    }

    return response.json();
  };

  const saveToStorage = async (result: any) => {
    await AsyncStorage.setItem('pharmacyId', result._id || result.pharmacyId);
    await AsyncStorage.setItem('pharmacyData', JSON.stringify(result));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      // Step 1: Upload document
      console.log('Step 1: Uploading document...');
      const documentUrl = await uploadDocument();
      console.log('Document uploaded:', documentUrl);

      // Step 2: Register pharmacy
      console.log('Step 2: Registering pharmacy...');
      const result = await registerPharmacy(documentUrl);
      console.log('Pharmacy registered:', result);

      // Step 3: Save to local storage
      console.log('Step 3: Saving to storage...');
      await saveToStorage(result);

      // Step 4: Show success and redirect
      Alert.alert(
        'Success! 🎉',
        'Your pharmacy has been registered successfully!',
        [
          {
            text: 'Get Started',
            onPress: () => router.replace('/pharmacy/(tabs)/dashboard'),
          },
        ]
      );
    } catch (error: any) {
      console.error('Registration error:', error);
      Alert.alert(
        'Registration Failed',
        error.message || 'Failed to register pharmacy. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setSubmitting(false);
    }
  };

  return {
    handleSubmit,
    submitting,
  };
};