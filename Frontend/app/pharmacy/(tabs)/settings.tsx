// app/pharmacy/(tabs)/settings.tsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  ScrollView, 
  Switch, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { mockPharmacy } from '../../../lib/mock-pharmacy';

// ✅ Add these type definitions
type PharmacyProfile = {
  pharmacyName: string;
  pharmacyEmail: string;
  pharmacyPhone: string;
  address: string;
};

type NotificationSettings = {
  lowStock: boolean;
  expiry: boolean;
  newOrders: boolean;
  deliveryUpdates: boolean;
};

type UserPreferences = {
  language: string;
  languageCode: string;
  largeFontMode: boolean;
  voiceCommands: boolean;
};

export default function SettingsScreen() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Profile State
  const [profile, setProfile] = useState<PharmacyProfile>({
    pharmacyName: '',
    pharmacyEmail: '',
    pharmacyPhone: '',
    address: '',
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Notification Settings
  const [notifications, setNotifications] = useState<NotificationSettings>({
    lowStock: true,
    expiry: true,
    newOrders: true,
    deliveryUpdates: true,
  });

  // Language & Accessibility
  const [preferences, setPreferences] = useState<UserPreferences>({
    language: 'English',
    languageCode: 'en',
    largeFontMode: false,
    voiceCommands: false,
  });
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  // Security
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  const languages = [
    { code: 'en', name: 'English', icon: '🇬🇧' },
    { code: 'si', name: 'Sinhala', icon: '🇱🇰' },
    { code: 'ta', name: 'Tamil', icon: '🇱🇰' }
  ];

  // Load settings on mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      
      // Use mock data
      setProfile({
        pharmacyName: mockPharmacy.name,
        pharmacyEmail: mockPharmacy.email,
        pharmacyPhone: mockPharmacy.phone,
        address: mockPharmacy.address,
      });

      // Load preferences from AsyncStorage
      const savedPreferences = await AsyncStorage.getItem('userPreferences');
      if (savedPreferences) {
        setPreferences(JSON.parse(savedPreferences));
      }

      const saved2FA = await AsyncStorage.getItem('twoFactorAuth');
      if (saved2FA) setTwoFactorAuth(saved2FA === 'true');

    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    try {
      setSaving(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsEditingProfile(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const updateNotifications = async (newSettings: NotificationSettings) => {
    setNotifications(newSettings);
  };

  const changeLanguage = async (langName: string, langCode: string) => {
    const newPreferences = {
      ...preferences,
      language: langName,
      languageCode: langCode,
    };
    setPreferences(newPreferences);
    setShowLanguageDropdown(false);
    await AsyncStorage.setItem('userPreferences', JSON.stringify(newPreferences));
    
    Alert.alert(
      'Language Changed',
      'The app language has been changed. Some changes will take effect after restarting the app.',
      [{ text: 'OK' }]
    );
  };

  const toggleLargeFontMode = async (value: boolean) => {
    const newPreferences = { ...preferences, largeFontMode: value };
    setPreferences(newPreferences);
    await AsyncStorage.setItem('userPreferences', JSON.stringify(newPreferences));
  };

  const toggleVoiceCommands = async (value: boolean) => {
    const newPreferences = { ...preferences, voiceCommands: value };
    setPreferences(newPreferences);
    await AsyncStorage.setItem('userPreferences', JSON.stringify(newPreferences));
  };

  const toggle2FA = async (value: boolean) => {
    setTwoFactorAuth(value);
    await AsyncStorage.setItem('twoFactorAuth', value.toString());
    
    if (value) {
      Alert.alert(
        '2FA Enabled',
        'Two-factor authentication has been enabled for your account.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleSimpleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.multiRemove([
                'pharmacyId',
                'userId',
                'authToken',
                'accessToken',
                'refreshToken',
                'userRole',
              ]);

              console.log('✅ Logged out successfully');
              router.replace('/screens/login');
              Alert.alert('Success', 'Logged out successfully!');
            } catch (error) {
              console.error('❌ Logout error:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          }
        }
      ]
    );
  };

  const handleCompleteReset = async () => {
    Alert.alert(
      'Reset & Start Fresh',
      '⚠️ WARNING: This will delete ALL your pharmacy data. Are you absolutely sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes, Delete Everything',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await AsyncStorage.clear();
              Alert.alert(
                'All Data Cleared',
                'You can now register a new pharmacy.',
                [
                  {
                    text: 'Start Registration',
                    onPress: () => router.replace('/pharmacy/pharmacy_register')
                  }
                ]
              );
            } catch (error) {
              console.error('Reset error:', error);
              Alert.alert('Error', 'Failed to reset. Please try again.');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View className="flex-1 bg-[#E6F5F3] items-center justify-center">
        <ActivityIndicator size="large" color="#139D92" />
        <Text className="mt-4 text-gray-600">Loading settings...</Text>
      </View>
    );
  }

  // ... rest of your JSX remains the same
  return (
    <View className="flex-1 bg-[#E6F5F3]">
      {/* Your existing JSX */}
    </View>
  );
}