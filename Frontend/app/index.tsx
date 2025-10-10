import { useEffect } from 'react';
import { View, Image } from 'react-native';
import { useRouter } from 'expo-router';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    // Navigate to onboarding after 3 seconds
    const timer = setTimeout(() => {
      router.replace('/screens/onboarding');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View className="flex-1 bg-white justify-center items-center">
      <Image
        source={require('../assets/images/1.png')}
        className="w-full h-full"
        resizeMode="cover"
      />
    </View>
  );
}
