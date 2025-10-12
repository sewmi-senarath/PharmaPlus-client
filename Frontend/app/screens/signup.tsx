import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Alert, ActivityIndicator } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign'; 
import { useRouter, useLocalSearchParams } from 'expo-router';
import { authService } from '../../config/authService';

const SignUpScreen = () => {
  const router = useRouter();
  const { role } = useLocalSearchParams();

  // Common fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

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
      'Rider': 'driver',
      'Admin': 'admin',
    };
    return roleMap[frontendRole] || frontendRole.toLowerCase();
  };

  const handleSignUp = async () => {
    // Validate passwords match
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match!');
      return;
    }

    // Validate required fields
    if (!fullName || !email || !phone || !password) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    // Prepare data based on role - MATCH BACKEND REQUIREMENTS
    const userData: any = {
      name: fullName,
      email,
      phone,
      password,
      role: getRoleForBackend(role as string),
      preferred_language: 'en', // Required by backend - default to English
    };

    // Note: Backend doesn't handle these fields in user registration
    // They should be saved separately after user is created
    // For now, we'll just register the basic user info

    setLoading(true);
    try {
      console.log('Signing up with:', userData);
      const response = await authService.signup(userData);
      
      console.log('Signup successful:', response);
      Alert.alert(
        'Success',
        'Account created successfully! Please login.',
        [
          {
            text: 'OK',
            onPress: () => router.push({
              pathname: '/screens/login',
              params: { role: role }
            })
          }
        ]
      );
    } catch (error: any) {
      console.error('Signup error:', error);
      Alert.alert(
        'Signup Failed',
        error.message || 'Failed to create account. Please try again.'
      );
    } finally {
      setLoading(false);
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
              style={{ backgroundColor: loading ? '#9CA3AF' : '#41A67E' }}
              onPress={handleSignUp}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
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