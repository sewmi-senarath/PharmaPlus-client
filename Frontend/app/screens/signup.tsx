import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Alert, ActivityIndicator } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign'; 
import { useRouter, useLocalSearchParams } from 'expo-router';
import api from '../../config/api';

const SignUpScreen = () => {
  const router = useRouter();
  const { role } = useLocalSearchParams();

  // Common fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('en');
  const [isLoading, setIsLoading] = useState(false);

  // Role-specific fields
  const [address, setAddress] = useState('');
  const [pharmacyLicense, setPharmacyLicense] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');

  const getRoleTitle = () => {
    switch(role) {
      case 'Customer':
        return 'Customer Sign Up';
      case 'Pharmacist':
        return 'Pharmacist Sign Up';
      case 'Rider':
        return 'Rider Sign Up';
      case 'Admin':
        return 'Admin Sign Up';
      default:
        return 'Sign Up';
    }
  };

  // Convert frontend role to backend role
  const getRoleForBackend = (frontendRole: string) => {
    const roleMap: any = {
      'Customer': 'customer',
      'Pharmacist': 'pharmacist',
      'Rider': 'driver', // Backend uses "driver" not "rider"
      'Admin': 'admin',
    };
    return roleMap[frontendRole] || frontendRole.toLowerCase();
  };

  const handleSignUp = async () => {
    // Validate all required fields
    if (!fullName || !email || !phone || !password) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    // Validate passwords match
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match!');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    // Prepare data for backend (only fields backend expects)
    const userData = {
      name: fullName,
      email,
      phone,
      password,
      role: getRoleForBackend(role as string),
      preferred_language: preferredLanguage,
    };

    console.log('Signing up with:', userData);
    
    try {
      setIsLoading(true);
      
      // Backend route: router.post("/register", registerUserController);
      // Mounted at: app.use('/api/users', userRouter)
      // API baseURL already includes /api, so we just need /users/register
      const response = await api.post('/users/register', userData);
      
      const data = response.data;
      
      console.log('✅ Signup response:', data);
      
      if (data.success) {
        console.log('🎉 Signup successful for role:', role);
        
        // Clear loading state before showing alert
        setIsLoading(false);
        
        // Show success message and redirect
        Alert.alert(
          'Registration Successful! ✅',
          'Your account has been created. Please login to continue.',
          [
            {
              text: 'Go to Login',
              onPress: () => {
                console.log('🔄 Redirecting to login with role:', role);
                router.replace({
                  pathname: '/screens/login',
                  params: { role: role }
                });
              }
            }
          ],
          { cancelable: false }
        );
      } else {
        Alert.alert('Error', data.message || 'Registration failed. Please try again.');
      }
    } catch (error: any) {
      console.error('❌ Registration error:', error);
      console.error('Error response:', error.response?.data);
      
      const errorMessage = error.response?.data?.message || error.message || 'Network error. Please check your connection and try again.';
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ paddingVertical: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center justify-center px-6">
          
          {/* Card Container */}
          <View
            className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-lg border-t-4"
            style={{ borderTopColor: '#41A67E' }}
          >
            {/* Back Button */}
            <TouchableOpacity 
              className="absolute left-4 top-4"
              onPress={handleGoBack}
            >
              <AntDesign name="left" size={24} color="#41A67E" />
            </TouchableOpacity>

            {/* Title */}
            <Text className="text-xl font-semibold text-center mb-1 mt-6" style={{ color: '#41A67E' }}>
              {getRoleTitle()}
            </Text>

            <Text className="text-gray-500 text-center mb-6 text-sm">
              Create your account as {role}
            </Text>

            {/* Full Name */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-1">Full Name</Text>
              <TextInput
                className="w-full border border-gray-300 p-3 rounded-lg text-gray-700"
                placeholder="John Doe"
                value={fullName}
                onChangeText={setFullName}
              />
            </View>

            {/* Email */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-1">Email Address</Text>
              <TextInput
                className="w-full border border-gray-300 p-3 rounded-lg text-gray-700"
                placeholder="you@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            {/* Phone Number */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-1">Phone Number</Text>
              <TextInput
                className="w-full border border-gray-300 p-3 rounded-lg text-gray-700"
                placeholder="+94 71 234 5678"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />
            </View>

            {/* Preferred Language */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-1">Preferred Language</Text>
              <View className="flex-row gap-2">
                <TouchableOpacity
                  className={`flex-1 p-3 rounded-lg border ${preferredLanguage === 'en' ? 'border-[#41A67E] bg-[#41A67E]/10' : 'border-gray-300'}`}
                  onPress={() => setPreferredLanguage('en')}
                >
                  <Text className={`text-center ${preferredLanguage === 'en' ? 'text-[#41A67E] font-semibold' : 'text-gray-700'}`}>
                    English
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`flex-1 p-3 rounded-lg border ${preferredLanguage === 'si' ? 'border-[#41A67E] bg-[#41A67E]/10' : 'border-gray-300'}`}
                  onPress={() => setPreferredLanguage('si')}
                >
                  <Text className={`text-center ${preferredLanguage === 'si' ? 'text-[#41A67E] font-semibold' : 'text-gray-700'}`}>
                    Sinhala
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`flex-1 p-3 rounded-lg border ${preferredLanguage === 'ta' ? 'border-[#41A67E] bg-[#41A67E]/10' : 'border-gray-300'}`}
                  onPress={() => setPreferredLanguage('ta')}
                >
                  <Text className={`text-center ${preferredLanguage === 'ta' ? 'text-[#41A67E] font-semibold' : 'text-gray-700'}`}>
                    Tamil
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Address - for Customer, Pharmacist, Rider */}
            {(role === 'Customer' || role === 'Pharmacist' || role === 'Rider') && (
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-1">Address</Text>
                <TextInput
                  className="w-full border border-gray-300 p-3 rounded-lg text-gray-700"
                  placeholder="123 Main Street, Colombo"
                  value={address}
                  onChangeText={setAddress}
                  multiline
                  numberOfLines={2}
                />
              </View>
            )}

            {/* Pharmacy License - Only for Pharmacist */}
            {role === 'Pharmacist' && (
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-1">Pharmacy License Number</Text>
                <TextInput
                  className="w-full border border-gray-300 p-3 rounded-lg text-gray-700"
                  placeholder="PL-123456"
                  value={pharmacyLicense}
                  onChangeText={setPharmacyLicense}
                />
              </View>
            )}

            {/* Vehicle Number - Only for Rider */}
            {role === 'Rider' && (
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-1">Vehicle Number</Text>
                <TextInput
                  className="w-full border border-gray-300 p-3 rounded-lg text-gray-700"
                  placeholder="ABC-1234"
                  autoCapitalize="characters"
                  value={vehicleNumber}
                  onChangeText={setVehicleNumber}
                />
              </View>
            )}

            {/* Password */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-1">Password</Text>
              <TextInput
                className="w-full border border-gray-300 p-3 rounded-lg text-gray-700"
                placeholder="••••••••"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>

            {/* Confirm Password */}
            <View className="mb-6">
              <Text className="text-sm font-medium text-gray-700 mb-1">Confirm Password</Text>
              <TextInput
                className="w-full border border-gray-300 p-3 rounded-lg text-gray-700"
                placeholder="••••••••"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </View>

            {/* Sign Up Button */}
            <TouchableOpacity
              className="w-full p-4 rounded-lg shadow-md"
              style={{ backgroundColor: isLoading ? '#9CA3AF' : '#41A67E' }}
              onPress={handleSignUp}
              disabled={isLoading}
            >
              {isLoading ? (
                <View className="flex-row justify-center items-center">
                  <ActivityIndicator color="#fff" />
                  <Text className="text-white text-center text-lg font-semibold ml-2">
                    Creating Account...
                  </Text>
                </View>
              ) : (
                <Text className="text-white text-center text-lg font-semibold">
                  Sign Up
                </Text>
              )}
            </TouchableOpacity>

            {/* Already have account - Link to Login */}
            <View className="mt-6 flex-row justify-center">
              <Text className="text-gray-600 text-sm">
                Already have an account?
              </Text>
              <TouchableOpacity onPress={() => router.back()}>
                <Text className="font-semibold ml-1" style={{ color: '#41A67E' }}>
                  Log In
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUpScreen;
