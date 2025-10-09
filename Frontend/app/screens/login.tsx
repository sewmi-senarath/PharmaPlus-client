import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign'; 
import { useRouter, useLocalSearchParams } from 'expo-router';
import { authService } from '../../config/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';

function GoogleIcon() {
  return <AntDesign name="google" size={24} color="#DB4437" />;
}

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const router = useRouter();
  const { role } = useLocalSearchParams(); // Get the role parameter

  // Display role-specific title
  const getRoleTitle = () => {
    switch(role) {
      case 'Customer':
        return 'Customer Login';
      case 'Pharmacist':
        return 'Pharmacist Login';
      case 'Rider':
        return 'Rider Login';
      case 'Admin':
        return 'Admin Login';
      default:
        return 'Welcome Back';
    }
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError('');

      console.log('📧 Email being sent:', email);
      console.log('🔑 Password being sent:', password); // Check if it's empty
      console.log('👤 Role:', role);

      if (!email || !password) {
        setError('Please enter email and password');
        setLoading(false);
        return;
      }

      // Call backend API
      const response = await authService.login(email, password, role as string);
      
      console.log('Login response:', response); // See what we get
      
      // Save tokens - match your backend response
      await AsyncStorage.setItem('authToken', response.accesstoken); // Changed from 'token' to 'accesstoken'
      await AsyncStorage.setItem('refreshToken', response.refreshToken); // Save refresh token too
      await AsyncStorage.setItem('userRole', role as string);
      // We don't have user._id in response, so skip it for now
      // await AsyncStorage.setItem('userId', response.user._id);
      
      // Navigate based on role
      if (role === 'Customer') {
        router.replace({
          pathname: '/home' as any,
          params: { userRole: 'Customer' }
        });
      } else if (role === 'Pharmacist') {
        router.replace({
          pathname: '/home' as any,
          params: { userRole: 'Pharmacist' }
        });
      } else if (role === 'Rider') {
        router.push('/screens/rider-dashboard');
      } else if (role === 'Admin') {
        router.replace({
          pathname: '/home' as any,
          params: { userRole: 'Admin' }
        });
      }
    } catch (err: any) {
      setError(err.toString());
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    console.log(`Signing in with Google as ${role}`);
  };

  const handleGoBack = () => {
    router.back(); // Go back to role selection
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
              Sign in to continue as {role}
            </Text>

            {/* Email Input */}
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

            {/* Password Input */}
            <View className="mb-6">
              <Text className="text-sm font-medium text-gray-700 mb-1">Password</Text>
              <TextInput
                className="w-full border border-gray-300 p-3 rounded-lg text-gray-700"
                placeholder="••••••••"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>

            {/* Show error message */}
            {error && (
              <Text className="text-red-600 text-sm mb-2">{error}</Text>
            )}

            {/* Login Button */}
            <TouchableOpacity
              onPress={handleLogin}
              disabled={loading}
              className="w-full p-4 rounded-lg shadow-md"
              style={{ backgroundColor: loading ? '#9CA3AF' : '#41A67E' }}
            >
              <Text className="text-white text-center text-lg font-semibold">
                {loading ? 'Logging in...' : 'Log In'}
              </Text>
            </TouchableOpacity>

            {/* OR Separator */}
            <View className="flex-row items-center my-6">
              <View className="flex-1 h-[1px] bg-gray-300" />
              <Text className="text-gray-500 text-sm mx-3">OR</Text>
              <View className="flex-1 h-[1px] bg-gray-300" />
            </View>

            {/* Google Sign In */}
            <TouchableOpacity
              className="w-full flex-row items-center justify-center border border-gray-300 bg-white p-3 rounded-lg shadow-sm"
              onPress={handleGoogleSignIn}
            >
              <GoogleIcon />
              <Text className="text-gray-700 text-base font-medium ml-2">
                Sign in with Google
              </Text>
            </TouchableOpacity>

            {/* Sign Up Link */}
            <View className="mt-8 flex-row justify-center">
              <Text className="text-gray-600 text-sm">
                Do not have an account?
              </Text>
              <TouchableOpacity onPress={() => router.push({
                pathname: '/screens/signup' as any,
                params: { role: role }
              })}>
                <Text className="font-semibold ml-1" style={{ color: '#41A67E' }}>
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LoginScreen;
