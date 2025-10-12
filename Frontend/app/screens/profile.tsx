import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

export default function ProfileScreen() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  
  const [profile, setProfile] = useState({
    name: 'Kasun Perera',
    email: 'kasun.perera@example.com',
    phone: '+94 77 123 4567',
    vehicleNumber: 'CAB-1234',
    vehicleType: 'Motorcycle',
    licenseNumber: 'B1234567',
    rating: 4.8,
    totalDeliveries: 1247,
    joinDate: 'Jan 2023',
  });

  // Store original values to revert if cancelled
  const [originalProfile, setOriginalProfile] = useState(profile);

  const handleEdit = () => {
    setOriginalProfile(profile); // Save current state
    setIsEditing(true);
  };

  const handleSave = () => {
    // Validation
    if (!profile.name.trim()) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }
    if (!profile.email.trim() || !profile.email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email');
      return;
    }
    if (!profile.phone.trim()) {
      Alert.alert('Error', 'Phone number cannot be empty');
      return;
    }
    if (!profile.vehicleNumber.trim()) {
      Alert.alert('Error', 'Vehicle number cannot be empty');
      return;
    }
    if (!profile.licenseNumber.trim()) {
      Alert.alert('Error', 'License number cannot be empty');
      return;
    }

    setIsEditing(false);
    Alert.alert('Success', 'Profile updated successfully!');
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel Editing',
      'Are you sure? All changes will be lost.',
      [
        { text: 'Keep Editing', style: 'cancel' },
        { 
          text: 'Discard Changes', 
          style: 'destructive',
          onPress: () => {
            setProfile(originalProfile); // Revert to original
            setIsEditing(false);
          }
        }
      ]
    );
  };

  const updateField = (field: string, value: string) => {
    setProfile({...profile, [field]: value});
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Profile',
          headerShown: true,
          headerStyle: { backgroundColor: '#0d9488' },
          headerTintColor: '#fff',
          headerRight: () => isEditing ? (
            <TouchableOpacity onPress={handleCancel} style={{ marginRight: 15 }}>
              <Text style={{ color: '#fff', fontSize: 16 }}>Cancel</Text>
            </TouchableOpacity>
          ) : null,
        }} 
      />
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
        <ScrollView style={{ flex: 1 }}>
          {/* Profile Header */}
          <View className="bg-teal-600 pt-6 pb-8 px-4 items-center">
            <View className="relative">
              <View className="w-24 h-24 bg-white rounded-full items-center justify-center border-4 border-teal-400">
                <Ionicons name="person" size={48} color="#0d9488" />
              </View>
              {isEditing && (
                <TouchableOpacity 
                  onPress={() => Alert.alert('Photo Upload', 'Camera/Gallery selection would go here')}
                  className="absolute bottom-0 right-0 w-8 h-8 bg-teal-500 rounded-full items-center justify-center border-2 border-white"
                >
                  <Ionicons name="camera" size={16} color="white" />
                </TouchableOpacity>
              )}
            </View>
            <Text className="text-white text-2xl font-bold mt-4">{profile.name}</Text>
            <View className="flex-row items-center mt-2">
              <Ionicons name="star" size={16} color="#FCD34D" />
              <Text className="text-white ml-1 font-semibold">{profile.rating}</Text>
              <Text className="text-teal-100 ml-2">
                {profile.totalDeliveries} deliveries
              </Text>
            </View>
          </View>

          {/* Stats Cards */}
          <View className="flex-row px-4 -mt-6 gap-3">
            <View className="flex-1 bg-white rounded-xl p-4 shadow-sm">
              <Text className="text-gray-500 text-xs mb-1">Member Since</Text>
              <Text className="text-gray-900 font-bold text-lg">{profile.joinDate}</Text>
            </View>
            <View className="flex-1 bg-white rounded-xl p-4 shadow-sm">
              <Text className="text-gray-500 text-xs mb-1">This Month</Text>
              <Text className="text-teal-600 font-bold text-lg">234 orders</Text>
            </View>
          </View>

          {/* Edit/Save Button */}
          {!isEditing && (
            <View className="px-4 mt-6">
              <TouchableOpacity
                onPress={handleEdit}
                className="bg-teal-600 py-3 rounded-xl flex-row items-center justify-center"
              >
                <Ionicons name="pencil" size={20} color="white" />
                <Text className="text-white font-semibold ml-2 text-base">
                  Edit Profile
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Save/Cancel Buttons when editing */}
          {isEditing && (
            <View className="px-4 mt-6 flex-row gap-3">
              <TouchableOpacity
                onPress={handleCancel}
                className="flex-1 bg-gray-200 py-3 rounded-xl flex-row items-center justify-center"
              >
                <Ionicons name="close" size={20} color="#4B5563" />
                <Text className="text-gray-700 font-semibold ml-2 text-base">
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSave}
                className="flex-1 bg-teal-600 py-3 rounded-xl flex-row items-center justify-center"
              >
                <Ionicons name="checkmark" size={20} color="white" />
                <Text className="text-white font-semibold ml-2 text-base">
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Profile Details */}
          <View className="px-4 mt-6">
            <Text className="text-lg font-bold text-gray-900 mb-4">
              Personal Information
            </Text>

            {/* Name */}
            <View className={`bg-white rounded-xl p-4 mb-3 ${isEditing ? 'border-2 border-teal-200' : ''}`}>
              <Text className="text-xs text-gray-500 mb-2">Full Name</Text>
              {isEditing ? (
                <TextInput
                  value={profile.name}
                  onChangeText={(text) => updateField('name', text)}
                  className="text-gray-900 text-base font-semibold border-b border-gray-300 pb-2"
                  placeholder="Enter your full name"
                />
              ) : (
                <Text className="text-gray-900 text-base font-semibold">
                  {profile.name}
                </Text>
              )}
            </View>

            {/* Email */}
            <View className={`bg-white rounded-xl p-4 mb-3 ${isEditing ? 'border-2 border-teal-200' : ''}`}>
              <Text className="text-xs text-gray-500 mb-2">Email</Text>
              {isEditing ? (
                <TextInput
                  value={profile.email}
                  onChangeText={(text) => updateField('email', text)}
                  className="text-gray-900 text-base border-b border-gray-300 pb-2"
                  keyboardType="email-address"
                  placeholder="Enter your email"
                  autoCapitalize="none"
                />
              ) : (
                <Text className="text-gray-900 text-base">{profile.email}</Text>
              )}
            </View>

            {/* Phone */}
            <View className={`bg-white rounded-xl p-4 mb-3 ${isEditing ? 'border-2 border-teal-200' : ''}`}>
              <Text className="text-xs text-gray-500 mb-2">Phone Number</Text>
              {isEditing ? (
                <TextInput
                  value={profile.phone}
                  onChangeText={(text) => updateField('phone', text)}
                  className="text-gray-900 text-base border-b border-gray-300 pb-2"
                  keyboardType="phone-pad"
                  placeholder="Enter your phone number"
                />
              ) : (
                <Text className="text-gray-900 text-base">{profile.phone}</Text>
              )}
            </View>

            {/* Vehicle Information */}
            <Text className="text-lg font-bold text-gray-900 mt-6 mb-4">
              Vehicle Information
            </Text>

            {/* Vehicle Number */}
            <View className={`bg-white rounded-xl p-4 mb-3 ${isEditing ? 'border-2 border-teal-200' : ''}`}>
              <Text className="text-xs text-gray-500 mb-2">Vehicle Number</Text>
              {isEditing ? (
                <TextInput
                  value={profile.vehicleNumber}
                  onChangeText={(text) => updateField('vehicleNumber', text)}
                  className="text-gray-900 text-base font-semibold border-b border-gray-300 pb-2"
                  placeholder="Enter vehicle number"
                  autoCapitalize="characters"
                />
              ) : (
                <Text className="text-gray-900 text-base font-semibold">
                  {profile.vehicleNumber}
                </Text>
              )}
            </View>

            {/* Vehicle Type */}
            <View className={`bg-white rounded-xl p-4 mb-3 ${isEditing ? 'border-2 border-teal-200' : ''}`}>
              <Text className="text-xs text-gray-500 mb-2">Vehicle Type</Text>
              {isEditing ? (
                <View>
                  <Text className="text-gray-900 text-base mb-2">{profile.vehicleType}</Text>
                  <View className="flex-row gap-2 flex-wrap">
                    {['Motorcycle', 'Scooter', 'Car', 'Van'].map((type) => (
                      <TouchableOpacity
                        key={type}
                        onPress={() => updateField('vehicleType', type)}
                        className={`px-4 py-2 rounded-lg ${
                          profile.vehicleType === type 
                            ? 'bg-teal-600' 
                            : 'bg-gray-200'
                        }`}
                      >
                        <Text className={`${
                          profile.vehicleType === type 
                            ? 'text-white' 
                            : 'text-gray-700'
                        } font-semibold`}>
                          {type}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ) : (
                <Text className="text-gray-900 text-base">{profile.vehicleType}</Text>
              )}
            </View>

            {/* License Number */}
            <View className={`bg-white rounded-xl p-4 mb-3 ${isEditing ? 'border-2 border-teal-200' : ''}`}>
              <Text className="text-xs text-gray-500 mb-2">License Number</Text>
              {isEditing ? (
                <TextInput
                  value={profile.licenseNumber}
                  onChangeText={(text) => updateField('licenseNumber', text)}
                  className="text-gray-900 text-base border-b border-gray-300 pb-2"
                  placeholder="Enter license number"
                  autoCapitalize="characters"
                />
              ) : (
                <Text className="text-gray-900 text-base">{profile.licenseNumber}</Text>
              )}
            </View>

            {/* Action Buttons - Only show when NOT editing */}
            {!isEditing && (
              <View className="mt-6 mb-6">
                <TouchableOpacity className="bg-white rounded-xl p-4 mb-3 flex-row items-center border border-gray-200">
                  <Ionicons name="notifications" size={24} color="#0d9488" />
                  <Text className="text-gray-900 ml-3 flex-1 font-semibold">
                    Notification Settings
                  </Text>
                  <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                </TouchableOpacity>

                <TouchableOpacity className="bg-white rounded-xl p-4 mb-3 flex-row items-center border border-gray-200">
                  <Ionicons name="lock-closed" size={24} color="#0d9488" />
                  <Text className="text-gray-900 ml-3 flex-1 font-semibold">
                    Change Password
                  </Text>
                  <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                </TouchableOpacity>

                <TouchableOpacity className="bg-white rounded-xl p-4 mb-3 flex-row items-center border border-gray-200">
                  <Ionicons name="help-circle" size={24} color="#0d9488" />
                  <Text className="text-gray-900 ml-3 flex-1 font-semibold">
                    Help & Support
                  </Text>
                  <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                </TouchableOpacity>

                <TouchableOpacity 
                  onPress={() => router.back()}
                  className="bg-gray-100 rounded-xl p-4 mb-3 flex-row items-center justify-center border border-gray-300"
                >
                  <Ionicons name="arrow-back" size={20} color="#4B5563" />
                  <Text className="text-gray-700 ml-2 font-semibold">
                    Back to Dashboard
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  onPress={() => {
                    Alert.alert(
                      'Logout',
                      'Are you sure you want to logout?',
                      [
                        { text: 'Cancel', style: 'cancel' },
                        { 
                          text: 'Logout', 
                          style: 'destructive', 
                          onPress: () => router.replace('/') 
                        }
                      ]
                    );
                  }}
                  className="bg-red-50 rounded-xl p-4 flex-row items-center justify-center border border-red-200"
                >
                  <Ionicons name="log-out" size={20} color="#EF4444" />
                  <Text className="text-red-600 ml-2 font-semibold">
                    Logout
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Editing mode warning message */}
            {isEditing && (
              <View className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-200">
                <View className="flex-row items-center mb-2">
                  <Ionicons name="information-circle" size={20} color="#3B82F6" />
                  <Text className="text-blue-900 font-semibold ml-2">Editing Mode</Text>
                </View>
                <Text className="text-blue-800 text-sm">
                  Make your changes and tap "Save" to update your profile. Tap "Cancel" to discard changes.
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}