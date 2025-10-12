import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert, Modal, ActivityIndicator, Image, Platform } from 'react-native';
import { useRouter, Stack, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { userService } from '../../services/userService';
import api from '../../config/api';

export default function ProfileScreen() {
  const router = useRouter();
  const { userRole } = useLocalSearchParams();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  // Custom alert state for web compatibility
  const [customAlert, setCustomAlert] = useState<{
    visible: boolean;
    title: string;
    message: string;
    buttons: Array<{ text: string; onPress?: () => void; style?: string }>;
  }>({
    visible: false,
    title: '',
    message: '',
    buttons: [],
  });
  
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

  // Custom alert function that works on both web and mobile
  const showAlert = (
    title: string,
    message: string,
    buttons: Array<{ text: string; onPress?: () => void; style?: string }> = [{ text: 'OK' }]
  ) => {
    if (Platform.OS === 'web') {
      // Use custom modal for web
      setCustomAlert({
        visible: true,
        title,
        message,
        buttons,
      });
    } else {
      // Use native Alert for mobile
      Alert.alert(title, message, buttons as any);
    }
  };

  const closeCustomAlert = () => {
    setCustomAlert({ visible: false, title: '', message: '', buttons: [] });
  };

  // Load user profile from backend
  useEffect(() => {
    loadUserProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadUserProfile = async () => {
    try {
      setRefreshing(true);
      console.log('📥 FETCH: Requesting user profile from backend...');
      
      const userData = await userService.getUserDetails();
      
      console.log('📥 FETCH: User data received');
      console.log('   Full user data:', JSON.stringify(userData, null, 2));
      console.log('   Avatar field:', userData.avatar);
      console.log('   Avatar type:', typeof userData.avatar);
      console.log('   Avatar exists:', !!userData.avatar);
      
      setProfile({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        avatar: userData.avatar || '',
        preferred_language: userData.preferred_language || 'en',
        role: userData.role || userRole || '',
        joinDate: userData.createdAt ? new Date(userData.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A',
      });
      
      console.log('✅ FETCH: Profile state updated');
      console.log('   Profile avatar set to:', userData.avatar || '(empty)');
    } catch (error) {
      console.error('❌ FETCH ERROR: Failed to load profile:', error);
      showAlert('Error', 'Failed to load profile data');
    } finally {
      setRefreshing(false);
      console.log('🏁 FETCH: Profile load completed');
    }
  };

  // Helper function to get the correct avatar URL
  const getAvatarUrl = (avatar: string): string => {
    console.log('🖼️ DISPLAY: Getting avatar URL...');
    console.log('   Input avatar:', avatar);
    
    if (!avatar) {
      console.log('   ❌ No avatar provided');
      return '';
    }
    
    // If already a full URL, return as is
    if (avatar.startsWith('http://') || avatar.startsWith('https://')) {
      console.log('   ✅ Full URL detected:', avatar);
      return avatar;
    }
    
    // Otherwise, construct the full URL
    const API_BASE = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';
    console.log('   API_BASE from env:', API_BASE);
    
    const baseUrl = API_BASE.replace('/api', ''); // Remove /api suffix if present
    console.log('   Base URL (without /api):', baseUrl);
    
    const fullUrl = `${baseUrl}${avatar.startsWith('/') ? avatar : '/' + avatar}`;
    console.log('   ✅ Constructed full URL:', fullUrl);
    
    return fullUrl;
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
      showAlert('Success', 'Profile updated successfully!');
      
      // Reload profile to get latest data
      await loadUserProfile();
    } catch (error: any) {
      console.error('❌ Failed to update profile:', error);
      showAlert('Error', error.toString() || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    console.log('🔐 STEP 0: handleChangePassword called');
    console.log('   Current password length:', currentPassword?.length);
    console.log('   New password length:', newPassword?.length);
    console.log('   Confirm password length:', confirmPassword?.length);
    
    // Validation - Check if all fields are filled
    if (!currentPassword || !newPassword || !confirmPassword) {
      console.log('❌ VALIDATION: Missing fields');
      showAlert(
        'Missing Information',
        'Please fill in all password fields to continue.',
        [{ text: 'OK' }]
      );
      return;
    }

    // Validation - Check password length
    if (newPassword.length < 6) {
      console.log('❌ VALIDATION: Password too short');
      showAlert(
        'Password Too Short',
        'Your new password must be at least 6 characters long.\n\nPassword Requirements:\n• Minimum 6 characters\n• Use a mix of letters and numbers for better security',
        [{ text: 'OK' }]
      );
      return;
    }

    // Validation - Check if passwords match
    if (newPassword !== confirmPassword) {
      console.log('❌ VALIDATION: Passwords do not match');
      showAlert(
        'Passwords Do Not Match',
        'The new password and confirm password fields must match. Please check and try again.',
        [{ text: 'OK' }]
      );
      return;
    }

    // Validation - Check if new password is different from current
    if (currentPassword === newPassword) {
      console.log('❌ VALIDATION: New password same as current');
      showAlert(
        'Same Password',
        'Your new password must be different from your current password. Please choose a new password.',
        [{ text: 'OK' }]
      );
      return;
    }

    // Optional: Check password strength (basic)
    const hasNumber = /\d/.test(newPassword);
    const hasLetter = /[a-zA-Z]/.test(newPassword);
    
    if (!hasNumber || !hasLetter) {
      console.log('⚠️ VALIDATION: Weak password');
      showAlert(
        'Weak Password',
        'For better security, your password should contain both letters and numbers.\n\nDo you want to continue with this password?',
        [
          { text: 'Change Password', style: 'cancel' },
          { 
            text: 'Continue Anyway', 
            style: 'default',
            onPress: () => {
              console.log('User chose to continue with weak password');
              // Continue with password change
              proceedWithPasswordChange();
            }
          }
        ]
      );
      return;
    }

    console.log('✅ VALIDATION: All checks passed');
    await proceedWithPasswordChange();
  };

  const proceedWithPasswordChange = async () => {
    try {
      setLoading(true);
      console.log('🔐 STEP 1: Starting password update API call...');
      console.log('   Endpoint: /users/update-password');
      
      const response = await userService.updatePassword({
        currentPassword,
        newPassword,
      });

      console.log('✅ STEP 2: API response received');
      console.log('   Response:', JSON.stringify(response, null, 2));
      console.log('   Response type:', typeof response);
      console.log('   Response keys:', Object.keys(response || {}));
      
      // Clear form fields
      console.log('🔐 STEP 3: Clearing form fields');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      // Close modal first
      console.log('🔐 STEP 4: Closing modal');
      setShowPasswordModal(false);
      
      console.log('🔐 STEP 5: Setting timeout for success alert');
      // Show success message after modal closes
      setTimeout(() => {
        console.log('🎉 STEP 6: Showing success alert NOW');
        showAlert(
          'Password Changed Successfully! ✅',
          'Your password has been updated successfully.\n\nPlease use your new password the next time you log in.',
          [
            {
              text: 'OK',
              onPress: () => console.log('✅ Password change alert dismissed')
            }
          ]
        );
      }, 300);
      
      console.log('✅ Password update process completed successfully');
      
    } catch (error: any) {
      console.error('❌ STEP ERROR: Password update failed');
      console.error('   Error object:', error);
      console.error('   Error type:', typeof error);
      console.error('   Error message:', error.message);
      console.error('   Error response:', error.response?.data);
      console.error('   Error status:', error.response?.status);
      
      // Extract error message
      let errorMessage = 'Failed to update password';
      
      if (typeof error === 'string') {
        errorMessage = error;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      console.error('   Final error message:', errorMessage);
      
      // Show specific error messages
      if (errorMessage.toLowerCase().includes('current password') || errorMessage.toLowerCase().includes('incorrect')) {
        showAlert(
          'Incorrect Password',
          'The current password you entered is incorrect. Please try again.',
          [{ text: 'OK' }]
        );
      } else if (errorMessage.toLowerCase().includes('unauthorized') || errorMessage.toLowerCase().includes('401')) {
        showAlert(
          'Session Expired',
          'Your session has expired. Please log in again to change your password.',
          [{ text: 'OK' }]
        );
      } else {
        showAlert(
          'Password Change Failed',
          errorMessage,
          [{ text: 'OK' }]
        );
      }
    } finally {
      console.log('🏁 FINALLY: Setting loading to false');
      setLoading(false);
    }
  };

  const handlePickImage = async () => {
    try {
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        showAlert('Permission Required', 'Please allow access to your photo library to upload a profile picture.');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await handleUploadImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('❌ Image picker error:', error);
      showAlert('Error', 'Failed to pick image');
    }
  };

  const handleDeleteAvatar = async () => {
    showAlert(
      'Delete Profile Picture',
      'Are you sure you want to remove your profile picture?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setUploadingImage(true);
              
              console.log('🗑️ Deleting avatar...');
              const response = await api.delete('/users/delete-avatar');
              
              console.log('✅ Avatar deleted:', response.data);
              
              setProfile({
                ...profile,
                avatar: '',
              });
              
              showAlert('Success', 'Profile picture removed successfully!');
              await loadUserProfile();
            } catch (error: any) {
              console.error('❌ Delete avatar error:', error);
              showAlert('Error', error.response?.data?.message || 'Failed to delete profile picture');
            } finally {
              setUploadingImage(false);
            }
          }
        }
      ]
    );
  };

  const handleUploadImage = async (imageUri: string) => {
    try {
      setUploadingImage(true);

      console.log('📤 STEP 1: Starting upload...');
      console.log('   Platform:', Platform.OS);
      console.log('   Image URI:', imageUri);

      // Create form data
      const formData = new FormData();
      const fieldName = 'profilePicture';
      
      // Handle web (blob URL) differently from mobile
      if (Platform.OS === 'web' && imageUri.startsWith('blob:')) {
        console.log('   🌐 Web platform detected - converting blob to file');
        
        try {
          // Fetch the blob
          const response = await fetch(imageUri);
          const blob = await response.blob();
          
          console.log('   Blob size:', blob.size, 'bytes');
          console.log('   Blob type:', blob.type);
          
          // Create a File object from the blob
          const file = new File([blob], `profile-${Date.now()}.jpg`, {
            type: blob.type || 'image/jpeg'
          });
          
          console.log('   File created:', file.name, file.type, file.size);
          console.log(`   Field name: "${fieldName}"`);
          
          // Append the file to FormData
          formData.append(fieldName, file);
          
        } catch (blobError) {
          console.error('❌ Failed to convert blob:', blobError);
          throw new Error('Failed to process image on web');
        }
        
      } else {
        // Mobile: use URI directly
        console.log('   📱 Mobile platform - using URI directly');
        
        const uriParts = imageUri.split('.');
        const fileType = uriParts[uriParts.length - 1];
        
        let mimeType = 'image/jpeg';
        if (fileType.toLowerCase() === 'png') mimeType = 'image/png';
        else if (fileType.toLowerCase() === 'jpg' || fileType.toLowerCase() === 'jpeg') mimeType = 'image/jpeg';
        
        console.log('   File type:', fileType);
        console.log('   MIME type:', mimeType);
        console.log(`   Field name: "${fieldName}"`);
        
        formData.append(fieldName, {
          uri: imageUri,
          name: `profile-${Date.now()}.${fileType}`,
          type: mimeType,
        } as any);
      }
      
      console.log('   Endpoint: /users/upload-avatar');
      
      // Get auth token to verify
      const token = await AsyncStorage.getItem('authToken');
      console.log('   Auth token exists:', !!token);

      // Upload to backend
      console.log('   Full URL will be: API_BASE + /users/upload-avatar');
      const response = await api.post('/users/upload-avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('✅ STEP 2: Upload response received');
      console.log('   Full response:', JSON.stringify(response.data, null, 2));
      console.log('   Response status:', response.status);

      if (response.data.success || response.data.avatar) {
        const avatarUrl = response.data.avatar || response.data.data?.avatar;
        
        console.log('✅ STEP 3: Avatar URL extracted from response');
        console.log('   Avatar URL:', avatarUrl);
        console.log('   Avatar type:', typeof avatarUrl);
        
        setProfile({
          ...profile,
          avatar: avatarUrl,
        });

        console.log('✅ STEP 4: Profile state updated with new avatar');
        console.log('   New profile avatar:', avatarUrl);

        showAlert('Success', 'Profile picture updated successfully!');
        
        // Reload profile to get updated data
        console.log('📥 STEP 5: Reloading profile from backend...');
        await loadUserProfile();
      } else {
        console.error('❌ Upload response invalid:', response.data);
        showAlert('Error', 'Failed to upload profile picture');
      }
    } catch (error: any) {
      console.error('❌ UPLOAD ERROR:', error);
      console.error('   Error message:', error.message);
      console.error('   Error response:', JSON.stringify(error.response?.data, null, 2));
      console.error('   Error status:', error.response?.status);
      console.error('   Error config URL:', error.config?.url);
      console.error('   Error config baseURL:', error.config?.baseURL);
      
      // Show detailed error to user
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.error
        || error.message 
        || 'Failed to upload profile picture';
        
      showAlert(
        'Upload Failed',
        `Error: ${errorMessage}`,
        [{ text: 'OK' }]
      );
    } finally {
      setUploadingImage(false);
      console.log('🏁 Upload process completed');
    }
  };

  const handleLogout = async () => {
    console.log('🚪 Logout button clicked');
    
    showAlert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('🔄 User confirmed logout');
              setLoading(true);
              
              // Call backend logout API (optional - continues even if fails)
              try {
                console.log('📡 Calling backend logout API...');
                await userService.logout();
                console.log('✅ Backend logout successful');
              } catch (apiError) {
                console.warn('⚠️ Backend logout failed, continuing with local logout:', apiError);
              }
              
              // Clear all stored authentication data
              console.log('🧹 Clearing all auth tokens from AsyncStorage...');
              await AsyncStorage.multiRemove([
                'authToken',
                'refreshToken',
                'userRole',
                'userId',
                'pharmacyId',
                'riderId'
              ]);
              
              console.log('✅ All tokens cleared');
              console.log('✅ User logged out successfully');
              
              // Navigate to login screen
              console.log('🔄 Navigating to login screen: /screens/login');
              router.replace('/screens/login');
              console.log('✅ Navigation to login complete');
            } catch (error) {
              console.error('❌ Logout error:', error);
              showAlert('Error', 'Failed to logout. Please try again.');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
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
              <View className="w-24 h-24 bg-white rounded-full items-center justify-center border-4 border-teal-400 overflow-hidden">
                {profile.avatar ? (
                  <Image
                    source={{ uri: getAvatarUrl(profile.avatar) }}
                    className="w-full h-full"
                    resizeMode="cover"
                    onError={(error) => {
                      console.error('❌ Image load error:', error.nativeEvent.error);
                      console.log('❌ Failed to load image from:', getAvatarUrl(profile.avatar));
                    }}
                    onLoad={() => {
                      console.log('✅ Image loaded successfully from:', getAvatarUrl(profile.avatar));
                    }}
                  />
                ) : (
                  <Ionicons name="person" size={48} color="#0d9488" />
                )}
                {uploadingImage && (
                  <View className="absolute inset-0 bg-black/50 items-center justify-center">
                    <ActivityIndicator size="small" color="white" />
                  </View>
                )}
              </View>
              <View className="absolute bottom-0 right-0 flex-row gap-2">
                <TouchableOpacity 
                  onPress={handlePickImage}
                  disabled={uploadingImage}
                  className="w-8 h-8 bg-white rounded-full items-center justify-center border-2 border-teal-600"
                >
                  <Ionicons name="camera" size={16} color="#0d9488" />
                </TouchableOpacity>
                
                {profile.avatar && (
                  <TouchableOpacity 
                    onPress={handleDeleteAvatar}
                    disabled={uploadingImage}
                    className="w-8 h-8 bg-red-500 rounded-full items-center justify-center border-2 border-white"
                  >
                    <Ionicons name="trash" size={14} color="white" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
            <Text className="text-white text-2xl font-bold mt-4">{profile.name}</Text>
            {(userRole === 'Customer' || userRole === 'Pharmacist' || userRole === 'Rider') && (
              <Text className="text-teal-100 text-sm mt-1">
                {userRole === 'Customer' ? 'Customer Account' :
                 userRole === 'Pharmacist' ? 'Pharmacist Account' :
                 'Rider Account'}
              </Text>
            )}
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
                onPress={handleLogout}
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

        {/* Custom Alert Modal (for web compatibility) */}
        <Modal
          visible={customAlert.visible}
          transparent={true}
          animationType="fade"
          onRequestClose={closeCustomAlert}
        >
          <View className="flex-1 bg-black/50 justify-center items-center px-4">
            <View className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
              {/* Title */}
              <Text className="text-xl font-bold text-gray-800 mb-3">
                {customAlert.title}
              </Text>
              
              {/* Message */}
              <Text className="text-gray-600 text-base mb-6 leading-6">
                {customAlert.message}
              </Text>
              
              {/* Buttons */}
              <View className="flex-row gap-3">
                {customAlert.buttons.map((button, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      closeCustomAlert();
                      button.onPress?.();
                    }}
                    className={`flex-1 py-3 rounded-lg ${
                      button.style === 'cancel' 
                        ? 'bg-gray-200' 
                        : button.style === 'destructive'
                        ? 'bg-red-600'
                        : 'bg-teal-600'
                    }`}
                  >
                    <Text className={`text-center font-semibold ${
                      button.style === 'cancel' 
                        ? 'text-gray-700' 
                        : 'text-white'
                    }`}>
                      {button.text}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </>
  );
}