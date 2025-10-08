// import { Text, View } from "react-native";

// export default function Index() {
//   return (
//     <View className="flex-1 justify-center items-center">
//       <Text className="text-5xl text-blue-700">Welcome!!</Text>
//     </View>
//   );
// }

import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Navigate to rider dashboard with params
    router.push({
      pathname: '/screens/rider-dashboard',
      params: { riderId: '12345', riderName: 'Kasun Perera' }
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1 justify-center items-center p-4">
        <View className="w-full max-w-md">
          <Text className="text-3xl font-bold mb-2 text-teal-600 text-center">
            Rider App
          </Text>
          <Text className="text-gray-600 mb-8 text-center">
            Sign in to continue
          </Text>
          
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            className="w-full bg-white p-4 rounded-lg mb-4 border border-gray-300"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            className="w-full bg-white p-4 rounded-lg mb-6 border border-gray-300"
          />
          
          <TouchableOpacity
            onPress={handleLogin}
            className="w-full bg-teal-600 p-4 rounded-lg"
          >
            <Text className="text-white text-center font-semibold text-lg">
              Login
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/screens/rider-dashboard')}
            className="mt-4"
          >
            <Text className="text-teal-600 text-center">Skip to Dashboard</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
