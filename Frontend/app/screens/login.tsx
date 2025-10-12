import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign'; 
import { useRouter } from 'expo-router';
import { authService } from '../../config/authService';
import { pharmacyCheckService } from 'app/pharmacy/components/services/pharmacyCheckService';
import AsyncStorage from '@react-native-async-storage/async-storage';

function GoogleIcon() {
  return <AntDesign name="google" size={24} color="#DB4437" />;
}

// Role Card Component
const RoleCard = ({ iconName, roleTitle, isSelected, onPress }: {
  iconName: string;
  roleTitle: string;
  isSelected: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity
    className={`flex-1 p-4 mx-1 rounded-xl border-2 items-center ${
      isSelected ? 'border-teal-600 bg-teal-50' : 'border-gray-200 bg-white'
    }`}
    onPress={onPress}
  >
    <AntDesign 
      name={iconName} 
      size={28} 
      color={isSelected ? '#41A67E' : '#6B7280'} 
    />
    <Text className={`text-xs font-semibold mt-2 ${
      isSelected ? 'text-teal-600' : 'text-gray-600'
    }`}>
      {roleTitle}
    </Text>
    {isSelected && (
      <View className="absolute top-1 right-1">
        <AntDesign name="checkcircle" size={16} color="#41A67E" />
      </View>
    )}
  </TouchableOpacity>
);

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('Customer'); // Default to Customer
  
  const router = useRouter();

  const roles = [
    { id: 'Customer', icon: 'user', title: 'Customer' },
    { id: 'Pharmacist', icon: 'inbox', title: 'Pharmacist' },
    { id: 'Rider', icon: 'rocket', title: 'Rider' },
    { id: 'Admin', icon: 'lock', title: 'Admin' },
  ];

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

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError('');

      if (!email || !password ) {
        setError('Please enter email and password');
        setLoading(false);
        return;
      }

      if (!selectedRole) {
        setError('Please select a role');
        setLoading(false);
        return;
      }

      const backendRole = getRoleForBackend(selectedRole);
      console.log('Logging in...', { email, role: backendRole });

      console.log('📧 Email:', email);
      console.log('👤 Frontend Role:', selectedRole);
      console.log('🔄 Backend Role:', backendRole);

      // Call backend API with converted role
      const response = await authService.login(email, password, backendRole);
      
      console.log('✅ Login successful!');

      const userId = response.userId || response._id || response.id;
      
      if (!userId) {
        console.error('⚠️ No userId found in response:', response);
        throw new Error('User ID not found in login response');
      }
      
      console.log('👤 User ID:', userId);
      
      // Save tokens and user data
      await AsyncStorage.setItem('authToken', response.accesstoken);
      await AsyncStorage.setItem('refreshToken', response.refreshToken);
      await AsyncStorage.setItem('userRole', selectedRole);
      await AsyncStorage.setItem('userId', userId);
      
      //For Pharmacist, check if they have a registered pharmacy
      if (selectedRole === 'Pharmacist') {
        console.log('🔍 Checking if pharmacist has a registered pharmacy...');
        
        try {
          const userId = response.userId || response._id;
          const pharmacy = await pharmacyCheckService.checkPharmacyExists(userId);
          
          if (pharmacy && pharmacy.data) {
            // Pharmacy exists - go to dashboard
            console.log('✅ Pharmacy found, navigating to dashboard');
            await AsyncStorage.setItem('pharmacyId', pharmacy.data._id);
            router.replace('/pharmacy/(tabs)/dashboard' as any);
          } else {
            // No pharmacy - go to registration
            console.log('ℹ️ No pharmacy found, navigating to registration');
            router.replace('/pharmacy/pharmacy_register' as any);
          }
        } catch (error: any) {
          console.log('ℹ️ Error checking pharmacy, assuming no pharmacy exists');
          // If check fails, assume no pharmacy and go to registration
          router.replace('/pharmacy/pharmacy_register' as any);
        }
        
        return; 
        // Exit here for pharmacist
      }

      // Navigate based on selected role
      switch(selectedRole) {
        case 'Customer':
          router.replace({
            pathname: '/home' as any,
            params: { userRole: 'customer' }
          });
          break;
        case 'Rider':
          router.replace('/screens/rider-dashboard' as any);
          break;
        case 'Admin':
          // Admin can access home dashboard with full privileges
          router.replace({
            pathname: '/home' as any,
            params: { userRole: 'Admin' }
          });
          break;
        default:
          router.replace('/home' as any);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Login failed';
      setError(errorMessage);
      console.error('❌ Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    console.log(`Signing in with Google as ${selectedRole}`);
    // TODO: Implement Google Sign-In with selected role
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
            {/* Title */}
            <Text className="text-2xl font-bold text-center mb-2 mt-2" style={{ color: '#41A67E' }}>
              Welcome to PharmaPlus
            </Text>

            <Text className="text-gray-500 text-center mb-4 text-sm">
              Select your role and sign in
            </Text>

            {/* Role Selection */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">Select Role</Text>
              <View className="flex-row flex-wrap">
                {roles.map((role) => {
                  return (
                    <RoleCard
                      key={role.id}
                      iconName={role.icon}
                      roleTitle={role.title}
                      isSelected={selectedRole === role.id}
                      onPress={() => setSelectedRole(role.id)}
                    />
                  );
                })}
              </View>
            </View>

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
                params: { role: selectedRole }
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
