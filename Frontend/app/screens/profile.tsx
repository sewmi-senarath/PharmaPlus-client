import { View, Text, TouchableOpacity, TextInput, ScrollView, Image, Alert } from 'react-native';
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

  const handleSave = () => {
    setIsEditing(false);
    Alert.alert('Success', 'Profile updated successfully!');
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Profile',
          headerShown: true,
          headerStyle: { backgroundColor: '#0d9488' },
          headerTintColor: '#fff',
        }} 
      />
      <SafeAreaView className="flex-1 bg-gray-50">
        <ScrollView className="flex-1">
          {/* Profile Header */}
          <View className="bg-teal-600 pt-6 pb-8 px-4 items-center">
            <View className="relative">
              <View className="w-24 h-24 bg-white rounded-full items-center justify-center border-4 border-teal-400">
                <Ionicons name="person" size={48} color="#0d9488" />
              </View>
              <TouchableOpacity className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full items-center justify-center border-2 border-teal-600">
                <Ionicons name="camera" size={16} color="#0d9488" />
              </TouchableOpacity>
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
          <View className="px-4 mt-6">
            <TouchableOpacity
              onPress={() => isEditing ? handleSave() : setIsEditing(true)}
              className="bg-teal-600 py-3 rounded-xl flex-row items-center justify-center"
            >
              <Ionicons 
                name={isEditing ? 'checkmark' : 'pencil'} 
                size={20} 
                color="white" 
              />
              <Text className="text-white font-semibold ml-2 text-base">
                {isEditing ? 'Save Changes' : 'Edit Profile'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Profile Details */}
          <View className="px-4 mt-6">
            <Text className="text-lg font-bold text-gray-900 mb-4">
              Personal Information
            </Text>

            {/* Name */}
            <View className="bg-white rounded-xl p-4 mb-3">
              <Text className="text-xs text-gray-500 mb-2">Full Name</Text>
              {isEditing ? (
                <TextInput
                  value={profile.name}
                  onChangeText={(text) => setProfile({...profile, name: text})}
                  className="text-gray-900 text-base font-semibold"
                />
              ) : (
                <Text className="text-gray-900 text-base font-semibold">
                  {profile.name}
                </Text>
              )}
            </View>

            {/* Email */}
            <View className="bg-white rounded-xl p-4 mb-3">
              <Text className="text-xs text-gray-500 mb-2">Email</Text>
              {isEditing ? (
                <TextInput
                  value={profile.email}
                  onChangeText={(text) => setProfile({...profile, email: text})}
                  className="text-gray-900 text-base"
                  keyboardType="email-address"
                />
              ) : (
                <Text className="text-gray-900 text-base">{profile.email}</Text>
              )}
            </View>

            {/* Phone */}
            <View className="bg-white rounded-xl p-4 mb-3">
              <Text className="text-xs text-gray-500 mb-2">Phone Number</Text>
              {isEditing ? (
                <TextInput
                  value={profile.phone}
                  onChangeText={(text) => setProfile({...profile, phone: text})}
                  className="text-gray-900 text-base"
                  keyboardType="phone-pad"
                />
              ) : (
                <Text className="text-gray-900 text-base">{profile.phone}</Text>
              )}
            </View>

            {/* Vehicle Information */}
            <Text className="text-lg font-bold text-gray-900 mt-6 mb-4">
              Vehicle Information
            </Text>

            <View className="bg-white rounded-xl p-4 mb-3">
              <Text className="text-xs text-gray-500 mb-2">Vehicle Number</Text>
              {isEditing ? (
                <TextInput
                  value={profile.vehicleNumber}
                  onChangeText={(text) => setProfile({...profile, vehicleNumber: text})}
                  className="text-gray-900 text-base font-semibold"
                />
              ) : (
                <Text className="text-gray-900 text-base font-semibold">
                  {profile.vehicleNumber}
                </Text>
              )}
            </View>

            <View className="bg-white rounded-xl p-4 mb-3">
              <Text className="text-xs text-gray-500 mb-2">Vehicle Type</Text>
              <Text className="text-gray-900 text-base">{profile.vehicleType}</Text>
            </View>

            <View className="bg-white rounded-xl p-4 mb-3">
              <Text className="text-xs text-gray-500 mb-2">License Number</Text>
              <Text className="text-gray-900 text-base">{profile.licenseNumber}</Text>
            </View>

            {/* Action Buttons */}
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
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}