import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, Switch, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PharmacyHeader from '../components/ui/PharmacyHeader';
import { PharmacyAPI } from '../components/services/pharmacy.api';
import type { PharmacyProfile, NotificationSettings, UserPreferences } from '../../types/pharmacy-types';
import { router } from 'expo-router';

export default function SettingsScreen() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pharmacyId, setPharmacyId] = useState<string>('');
  const [userId, setUserId] = useState<string>('');

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
      
      // Get IDs from AsyncStorage
      const storedPharmacyId = await AsyncStorage.getItem('pharmacyId');
      const storedUserId = await AsyncStorage.getItem('userId');
      
      if (!storedPharmacyId || !storedUserId) {
        Alert.alert('Error', 'Session expired. Please login again.');
        // Navigate to login
        return;
      }

      setPharmacyId(storedPharmacyId);
      setUserId(storedUserId);

      // Load profile data
      try {
        const profileData = await PharmacyAPI.getProfile(storedPharmacyId);
        setProfile(profileData);
      } catch (error) {
        console.log('Profile not found, using defaults');
      }

      // Load notification settings
      try {
        const notifSettings = await PharmacyAPI.getNotificationSettings(storedUserId);
        setNotifications(notifSettings);
      } catch (error) {
        console.log('Notification settings not found, using defaults');
      }

      // Load preferences from AsyncStorage
      const savedPreferences = await AsyncStorage.getItem('userPreferences');
      if (savedPreferences) {
        setPreferences(JSON.parse(savedPreferences));
      }

      const saved2FA = await AsyncStorage.getItem('twoFactorAuth');
      if (saved2FA) setTwoFactorAuth(saved2FA === 'true');

    } catch (error) {
      console.error('Failed to load settings:', error);
      Alert.alert('Error', 'Failed to load settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    try {
      setSaving(true);
      await PharmacyAPI.updateProfile(pharmacyId, profile);
      setIsEditingProfile(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const updateNotifications = async (newSettings: NotificationSettings) => {
    try {
      await PharmacyAPI.updateNotificationSettings(userId, newSettings);
      setNotifications(newSettings);
    } catch (error) {
      console.error('Failed to update notifications:', error);
      Alert.alert('Error', 'Failed to update notification settings');
      // Revert on error
      loadSettings();
    }
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

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.multiRemove(['pharmacyId', 'userId', 'accessToken', 'refreshToken']);
            // Navigate to login screen
            Alert.alert('Logged out', 'You have been logged out successfully');
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


  //------------------------------------------------Logout Function -------------------------------------------------------------//

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
              // Clear all authentication data
              await AsyncStorage.multiRemove([
                'pharmacyId',
                'userId',
                'authToken',
                'accessToken',
                'refreshToken',
                'userRole',
              ]);

              console.log('✅ Pharmacist logged out successfully');
              
              // Navigate to login screen (not registration)
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

  // Complete reset - clears everything
  const handleCompleteReset = async () => {
    Alert.alert(
      'Reset & Start Fresh',
      '⚠️ WARNING: This will delete ALL your pharmacy data and registration. You will need to register from scratch.\n\nAre you absolutely sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes, Delete Everything',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);

              // Optional: Delete from backend if you want
              // Uncomment when backend is ready
              // if (pharmacyId) {
              //   await PharmacyAPI.deletePharmacy(pharmacyId);
              // }

              // Clear ALL local storage
              await AsyncStorage.clear();

              Alert.alert(
                'All Data Cleared',
                'You can now register a new pharmacy from scratch.',
                [
                  {
                    text: 'Start Registration',
                    onPress: () => {
                      router.replace('/pharmacy/pharmacy_register');
                    }
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


  // --------------------------------------------------------------------------------------------------------------------------//


  return (
    <View className="flex-1 bg-[#E6F5F3]">
      <PharmacyHeader title="Settings" badgeCount={3} />

      <ScrollView className="flex-1 p-4">
        {/* Subtitle */}
        <Text className="text-sm text-gray-600 mb-4">
          Manage your pharmacy profile and preferences
        </Text>

        {/* Pharmacy Profile Section */}
        <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
          <View className="flex-row items-center mb-4">
            <Ionicons name="business-outline" size={20} color="#139D92" />
            <Text className="ml-2 font-semibold text-base">Pharmacy Profile</Text>
          </View>

          <View className="gap-4">
            <View>
              <Text className="text-sm text-gray-700 mb-1">Pharmacy Name</Text>
              <TextInput
                value={profile.pharmacyName}
                onChangeText={(text) => setProfile({ ...profile, pharmacyName: text })}
                editable={isEditingProfile}
                className={`bg-gray-50 rounded-xl px-4 py-3 text-gray-900 border ${
                  isEditingProfile ? 'border-[#139D92]' : 'border-gray-200'
                }`}
              />
            </View>

            <View>
              <Text className="text-sm text-gray-700 mb-1">Address</Text>
              <TextInput
                value={profile.address}
                onChangeText={(text) => setProfile({ ...profile, address: text })}
                editable={isEditingProfile}
                multiline
                numberOfLines={2}
                className={`bg-gray-50 rounded-xl px-4 py-3 text-gray-900 border ${
                  isEditingProfile ? 'border-[#139D92]' : 'border-gray-200'
                }`}
              />
            </View>

            <View className="flex-row gap-3">
              <View className="flex-1">
                <Text className="text-sm text-gray-700 mb-1">Phone Number</Text>
                <TextInput
                  value={profile.pharmacyPhone}
                  onChangeText={(text) => setProfile({ ...profile, pharmacyPhone: text })}
                  editable={isEditingProfile}
                  keyboardType="phone-pad"
                  className={`bg-gray-50 rounded-xl px-4 py-3 text-gray-900 border ${
                    isEditingProfile ? 'border-[#139D92]' : 'border-gray-200'
                  }`}
                />
              </View>
              <View className="flex-1">
                <Text className="text-sm text-gray-700 mb-1">Email</Text>
                <TextInput
                  value={profile.pharmacyEmail}
                  onChangeText={(text) => setProfile({ ...profile, pharmacyEmail: text })}
                  editable={isEditingProfile}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  className={`bg-gray-50 rounded-xl px-4 py-3 text-gray-900 border ${
                    isEditingProfile ? 'border-[#139D92]' : 'border-gray-200'
                  }`}
                />
              </View>
            </View>

            <TouchableOpacity
              onPress={() => (isEditingProfile ? updateProfile() : setIsEditingProfile(true))}
              className={`bg-[#139D92] rounded-xl py-3 items-center mt-2 ${saving ? 'opacity-50' : ''}`}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-semibold">
                  {isEditingProfile ? 'Save Profile' : 'Update Profile'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Language & Accessibility */}
        <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
          <View className="flex-row items-center mb-4">
            <Ionicons name="globe-outline" size={20} color="#139D92" />
            <Text className="ml-2 font-semibold text-base">Language & Accessibility</Text>
          </View>

          <View>
            <Text className="text-sm text-gray-700 mb-2">Select Language</Text>
            <TouchableOpacity
              onPress={() => setShowLanguageDropdown(!showLanguageDropdown)}
              className="bg-gray-50 rounded-xl px-4 py-3 flex-row items-center justify-between border border-gray-200"
            >
              <View className="flex-row items-center gap-2">
                <Text className="text-lg">
                  {languages.find(l => l.name === preferences.language)?.icon || '🇬🇧'}
                </Text>
                <Text className="text-gray-900">{preferences.language}</Text>
              </View>
              <Ionicons
                name={showLanguageDropdown ? 'chevron-up' : 'chevron-down'}
                size={20}
                color="#666"
              />
            </TouchableOpacity>

            {showLanguageDropdown && (
              <View className="bg-gray-50 rounded-xl mt-2 overflow-hidden border border-gray-200">
                {languages.map((lang, idx) => (
                  <TouchableOpacity
                    key={lang.code}
                    onPress={() => changeLanguage(lang.name, lang.code)}
                    className={`px-4 py-3 flex-row items-center gap-2 ${
                      idx < languages.length - 1 ? 'border-b border-gray-200' : ''
                    }`}
                  >
                    <Text className="text-lg">{lang.icon}</Text>
                    <Text className="text-gray-900">{lang.name}</Text>
                    {preferences.language === lang.name && (
                      <Ionicons name="checkmark" size={20} color="#139D92" style={{ marginLeft: 'auto' }} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <Text className="text-xs text-gray-500 mt-2">
              Select your preferred language. Some changes will take effect after restarting the app.
            </Text>
          </View>

          <View className="flex-row items-center justify-between mt-6">
            <View className="flex-1 pr-4">
              <Text className="font-medium text-gray-900">Large Font Mode</Text>
              <Text className="text-xs text-gray-500 mt-1">
                Increase text size for better readability
              </Text>
            </View>
            <Switch
              value={preferences.largeFontMode}
              onValueChange={toggleLargeFontMode}
              trackColor={{ false: '#D1D5DB', true: '#139D92' }}
              thumbColor="#fff"
            />
          </View>

          <View className="flex-row items-center justify-between mt-4">
            <View className="flex-1 pr-4">
              <Text className="font-medium text-gray-900">Voice Commands</Text>
              <Text className="text-xs text-gray-500 mt-1">
                Enable voice assistant features
              </Text>
            </View>
            <Switch
              value={preferences.voiceCommands}
              onValueChange={toggleVoiceCommands}
              trackColor={{ false: '#D1D5DB', true: '#139D92' }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* Notifications */}
        <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
          <View className="flex-row items-center mb-4">
            <Ionicons name="notifications-outline" size={20} color="#139D92" />
            <Text className="ml-2 font-semibold text-base">Notifications</Text>
          </View>

          <Text className="text-xs text-gray-500 mb-4">
            Receive alerts for orders and inventory
          </Text>

          <View className="gap-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-gray-700">Low stock alerts</Text>
              <Switch
                value={notifications.lowStock}
                onValueChange={(val) => updateNotifications({ ...notifications, lowStock: val })}
                trackColor={{ false: '#D1D5DB', true: '#139D92' }}
                thumbColor="#fff"
              />
            </View>

            <View className="flex-row items-center justify-between">
              <Text className="text-gray-700">Expiry alerts</Text>
              <Switch
                value={notifications.expiry}
                onValueChange={(val) => updateNotifications({ ...notifications, expiry: val })}
                trackColor={{ false: '#D1D5DB', true: '#139D92' }}
                thumbColor="#fff"
              />
            </View>

            <View className="flex-row items-center justify-between">
              <Text className="text-gray-700">New orders</Text>
              <Switch
                value={notifications.newOrders}
                onValueChange={(val) => updateNotifications({ ...notifications, newOrders: val })}
                trackColor={{ false: '#D1D5DB', true: '#139D92' }}
                thumbColor="#fff"
              />
            </View>

            <View className="flex-row items-center justify-between">
              <Text className="text-gray-700">Delivery updates</Text>
              <Switch
                value={notifications.deliveryUpdates}
                onValueChange={(val) => updateNotifications({ ...notifications, deliveryUpdates: val })}
                trackColor={{ false: '#D1D5DB', true: '#139D92' }}
                thumbColor="#fff"
              />
            </View>
          </View>
        </View>

        {/* Security */}
        <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
          <View className="flex-row items-center mb-4">
            <Ionicons name="shield-checkmark-outline" size={20} color="#139D92" />
            <Text className="ml-2 font-semibold text-base">Security</Text>
          </View>

          <TouchableOpacity 
            className="bg-gray-50 rounded-xl py-3 items-center mb-4"
            onPress={() => Alert.alert('Change Password', 'Password change feature coming soon!')}
          >
            <Text className="text-gray-900 font-medium">Change Password</Text>
          </TouchableOpacity>

          <View className="flex-row items-center justify-between">
            <View className="flex-1 pr-4">
              <Text className="font-medium text-gray-900">Two-Factor Authentication</Text>
              <Text className="text-xs text-gray-500 mt-1">
                Add extra security to your account
              </Text>
            </View>
            <Switch
              value={twoFactorAuth}
              onValueChange={toggle2FA}
              trackColor={{ false: '#D1D5DB', true: '#139D92' }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* Account Actions Section - ADD THIS */}
        <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
          <View className="flex-row items-center mb-4">
            <Ionicons name="exit-outline" size={20} color="#139D92" />
            <Text className="ml-2 font-semibold text-base">Account Actions</Text>
          </View>

          {/* Simple Logout Button */}
          <TouchableOpacity
            className="bg-orange-50 rounded-xl py-4 items-center border border-orange-200 mb-3"
            onPress={handleSimpleLogout}
          >
            <View className="flex-row items-center gap-2">
              <Ionicons name="log-out-outline" size={20} color="#F97316" />
              <Text className="text-orange-600 font-semibold">Logout</Text>
            </View>
            <Text className="text-xs text-orange-500 mt-1">
              Sign out and return to registration
            </Text>
          </TouchableOpacity>

          {/* Complete Reset Button */}
          <TouchableOpacity
            className="bg-red-50 rounded-xl py-4 items-center border border-red-300"
            onPress={handleCompleteReset}
          >
            <View className="flex-row items-center gap-2">
              <Ionicons name="trash-outline" size={20} color="#EF4444" />
              <Text className="text-red-600 font-semibold">Reset Everything</Text>
            </View>
            <Text className="text-xs text-red-500 mt-1">
              Delete all data and start fresh
            </Text>
          </TouchableOpacity>

          <View className="mt-3 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
            <View className="flex-row items-start gap-2">
              <Ionicons name="warning-outline" size={16} color="#F59E0B" />
              <Text className="text-xs text-yellow-700 flex-1">
                Temporary: These actions will be replaced with proper login/logout once authentication is integrated.
              </Text>
            </View>
          </View>
        </View>


        {/* Footer */}
        <View className="items-center pb-8">
          <Text className="text-gray-500 text-sm">PharmaPlus v1.0.0</Text>
          <Text className="text-gray-400 text-xs mt-1">© 2024 MediCare Solutions</Text>
        </View>
      </ScrollView>
    </View>
  );
}