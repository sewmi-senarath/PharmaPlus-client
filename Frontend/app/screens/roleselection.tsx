import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';

// Define your primary theme color for consistency
const PRIMARY_COLOR = '#41A67E'; 

/**
 * Reusable Role Card Component
 */
const RoleCard = ({ iconName, roleTitle, roleDescription, onPress }: {
  iconName: string;
  roleTitle: string;
  roleDescription: string;
  onPress: () => void;
}) => (
  <TouchableOpacity
    className="w-full bg-white p-4 my-2 rounded-xl border border-gray-200 flex-row items-center justify-between"
    onPress={onPress}
  >
    <View className="flex-row items-center">
      {/* Icon */}
      <AntDesign name={iconName} size={24} color={PRIMARY_COLOR} className="mr-4" />
      
      {/* Text Content */}
      <View className="ml-4">
        <Text className="text-lg font-semibold text-gray-800">
          {roleTitle}
        </Text>
        <Text className="text-sm text-gray-500 mt-1">
          {roleDescription}
        </Text>
      </View>
    </View>

    {/* Arrow Icon */}
    <AntDesign name="right" size={18} color="gray" />
  </TouchableOpacity>
);

const RoleSelectionScreen = () => {
  const router = useRouter();

  const handleRoleSelect = (role: string) => {
    console.log(`Selected role: ${role}`);
    // Navigate to login screen with role parameter
    router.push({
      pathname: '/screens/login',
      params: { role: role }
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1 items-center px-6 pt-12">
        
        {/* === Header Text === */}
        <View className="mb-8 w-full">
          <Text className="text-3xl font-bold text-gray-800 text-center mb-2">
            Welcome to PharmaPlus
          </Text>
          <Text className="text-lg text-gray-600 text-center">
            Choose your role to get started
          </Text>
        </View>

        {/* === Role Cards Container === */}
        <View className="w-full max-w-sm">

          <RoleCard
            iconName="user"
            roleTitle="Customer/Patient"
            roleDescription="Order medicines and track deliveries"
            onPress={() => handleRoleSelect('Customer')}
          />

          <RoleCard
            iconName="inbox"
            roleTitle="Pharmacist"
            roleDescription="Manage inventory and fulfill orders"
            onPress={() => handleRoleSelect('Pharmacist')}
          />

          <RoleCard
            iconName="rocket"
            roleTitle="Rider"
            roleDescription="Deliver medicines to customers"
            onPress={() => handleRoleSelect('Rider')}
          />
          <RoleCard
            iconName="lock"
            roleTitle="Admin"
            roleDescription="Manage the system"
            onPress={() => handleRoleSelect('Admin')}
          />

        </View>

      </View>
    </SafeAreaView>
  );
};

export default RoleSelectionScreen;