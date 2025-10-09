import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Index() {
  const [hasPharmacy, setHasPharmacy] = useState<boolean | null>(null);

  useEffect(() => {
    checkPharmacyRegistration();
  }, []);

  const checkPharmacyRegistration = async () => {
    const pharmacyId = await AsyncStorage.getItem('pharmacyId');
    setHasPharmacy(!!pharmacyId);
  };

  if (hasPharmacy === null) return null; // Loading state

  return <Redirect href={hasPharmacy ? "/pharmacy/dashboard" : "/pharmacy/pharmacy_register"} />;
}

