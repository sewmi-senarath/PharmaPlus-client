import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert, Modal, ActivityIndicator } from 'react-native';
import { useRouter, Stack, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userService } from '../../services/userService';

export default function ProfileScreen() {
  const router = useRouter();
  const { userRole } = useLocalSearchParams();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  
  // Profile state
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    avatar: '',
    preferred_language: 'en',
    role: userRole || '',
    joinDate: 'Loading...',
  });

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Load user profile from backend
  useEffect(() => {
    loadUserProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadUserProfile = async () => {
    try {
      setRefreshing(true);
      const userData = await userService.getUserDetails();
      console.log('📥 User data loaded:', userData);
      
      setProfile({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        avatar: userData.avatar || '',
        preferred_language: userData.preferred_language || 'en',
        role: userData.role || userRole || '',
        joinDate: userData.createdAt ? new Date(userData.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A',
      });
    } catch (error) {
      console.error('❌ Failed to load profile:', error);
      Alert.alert('Error', 'Failed to load profile data');
    } finally {
      setRefreshing(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      // Prepare update data
      const updateData = {
        name: profile.name,
        phone: profile.phone,
        avatar: profile.avatar,
        preferred_language: profile.preferred_language,
      };

      await userService.updateProfile(updateData);
      console.log('✅ Profile updated successfully');
      
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully!');
      
      // Reload profile to get latest data
      await loadUserProfile();
    } catch (error: any) {
      console.error('❌ Failed to update profile:', error);
      Alert.alert('Error', error.toString() || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all password fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      
      await userService.updatePassword({
        currentPassword,
        newPassword,
      });

      console.log('✅ Password updated successfully');
      
      setShowPasswordModal(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      Alert.alert('Success', 'Password updated successfully!');
    } catch (error: any) {
      console.error('❌ Failed to update password:', error);
      Alert.alert('Error', error.toString() || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      
      // Call backend logout API
      try {
        await userService.logout();
        console.log('✅ Backend logout successful');
      } catch (apiError) {
        console.warn('⚠️ Backend logout failed, continuing with local logout:', apiError);
      }
      
      // Clear all stored authentication data
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('refreshToken');
      await AsyncStorage.removeItem('userRole');
      
      console.log('✅ User logged out successfully');
      
      // Navigate to login screen
      router.replace('/screens/login');
    } catch (error) {
      console.error('❌ Logout error:', error);
      Alert.alert('Error', 'Failed to logout. Please try again.');
    } finally {
      setLoading(false);
    }
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
            <Text className="text-teal-100 text-sm mt-1">
              {userRole === 'Customer' ? 'Customer Account' :
               userRole === 'Pharmacist' ? 'Pharmacist Account' :
               userRole === 'Rider' ? 'Rider Account' : 'Admin Account'}
            </Text>
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
              disabled={loading || refreshing}
              className={`bg-teal-600 py-3 rounded-xl flex-row items-center justify-center ${(loading || refreshing) ? 'opacity-50' : ''}`}
            >
              {loading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <>
                  <Ionicons 
                    name={isEditing ? 'checkmark' : 'pencil'} 
                    size={20} 
                    color="white" 
                  />
                  <Text className="text-white font-semibold ml-2 text-base">
                    {isEditing ? 'Save Changes' : 'Edit Profile'}
                  </Text>
                </>
              )}
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


            {/* Action Buttons */}
            <View className="mt-6 mb-6">
              <TouchableOpacity className="bg-white rounded-xl p-4 mb-3 flex-row items-center border border-gray-200">
                <Ionicons name="notifications" size={24} color="#0d9488" />
                <Text className="text-gray-900 ml-3 flex-1 font-semibold">
                  Notification Settings
                </Text>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={() => setShowPasswordModal(true)}
                className="bg-white rounded-xl p-4 mb-3 flex-row items-center border border-gray-200"
              >
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
                        onPress: handleLogout 
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

        {/* Change Password Modal */}
        <Modal
          visible={showPasswordModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowPasswordModal(false)}
        >
          <View className="flex-1 bg-black/50 justify-end">
            <View className="bg-white rounded-t-3xl p-6 max-h-[80%]">
              <View className="flex-row justify-between items-center mb-6">
                <Text className="text-2xl font-bold text-gray-800">
                  Change Password
                </Text>
                <TouchableOpacity onPress={() => setShowPasswordModal(false)}>
                  <Ionicons name="close" size={28} color="#6B7280" />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Current Password */}
                <View className="mb-4">
                  <Text className="text-sm font-semibold text-gray-700 mb-2">
                    Current Password
                  </Text>
                  <TextInput
                    className="w-full border border-gray-300 p-3 rounded-lg text-gray-800"
                    placeholder="Enter current password"
                    secureTextEntry
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                  />
                </View>

                {/* New Password */}
                <View className="mb-4">
                  <Text className="text-sm font-semibold text-gray-700 mb-2">
                    New Password
                  </Text>
                  <TextInput
                    className="w-full border border-gray-300 p-3 rounded-lg text-gray-800"
                    placeholder="Enter new password (min 6 characters)"
                    secureTextEntry
                    value={newPassword}
                    onChangeText={setNewPassword}
                  />
                </View>

                {/* Confirm New Password */}
                <View className="mb-6">
                  <Text className="text-sm font-semibold text-gray-700 mb-2">
                    Confirm New Password
                  </Text>
                  <TextInput
                    className="w-full border border-gray-300 p-3 rounded-lg text-gray-800"
                    placeholder="Re-enter new password"
                    secureTextEntry
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                  />
                </View>

                {/* Update Button */}
                <TouchableOpacity
                  onPress={handleChangePassword}
                  disabled={loading}
                  className={`bg-teal-600 py-4 rounded-xl flex-row items-center justify-center ${loading ? 'opacity-50' : ''}`}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <>
                      <Ionicons name="lock-closed" size={20} color="white" />
                      <Text className="text-white font-semibold ml-2 text-lg">
                        Update Password
                      </Text>
                    </>
                  )}
                </TouchableOpacity>

                {/* Cancel Button */}
                <TouchableOpacity
                  onPress={() => {
                    setShowPasswordModal(false);
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                  }}
                  className="bg-gray-100 py-3 rounded-xl mt-3"
                >
                  <Text className="text-gray-700 text-center font-semibold">
                    Cancel
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </>
  );
}