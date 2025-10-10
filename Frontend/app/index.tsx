
// import { Redirect } from 'expo-router';
// import { useEffect, useState } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// export default function Index() {
//   const [hasPharmacy, setHasPharmacy] = useState<boolean | null>(null);

//   useEffect(() => {
//     checkPharmacyRegistration();
//   }, []);

//   const checkPharmacyRegistration = async () => {
//     const pharmacyId = await AsyncStorage.getItem('pharmacyId');
//     setHasPharmacy(!!pharmacyId);
//   };

//   if (hasPharmacy === null) return null; // Loading state

//   return <Redirect href={hasPharmacy ? "/pharmacy/dashboard" : "/pharmacy/pharmacy_register"} />;

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

