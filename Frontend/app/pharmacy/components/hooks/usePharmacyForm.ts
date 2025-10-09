import { useState } from 'react';
import { Alert } from 'react-native';

export type PharmacyFormData = {
  pharmacyName: string;
  pharmacyEmail: string;
  pharmacyPhone: string;
  pharmacyLicenseNumber: string;
  address: {
    line1: string;
    line2: string;
    city: string;
    district: string;
    postalCode: string;
    coordinates: { lng: number; lat: number };
  };
  openingHours: {
    day: number;
    open: string;
    close: string;
    closed: boolean;
  }[];
  isAvailable: boolean;
  is24x7: boolean;
  pharmacyServices: string[];
  deliveryRadiusKm: number;
  registrationDocument: {
    uri: string;
    name: string;
    type: string;
    size: number;
  } | null;
};

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const usePharmacyForm = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<PharmacyFormData>({
    pharmacyName: '',
    pharmacyEmail: '',
    pharmacyPhone: '',
    pharmacyLicenseNumber: '',
    address: {
      line1: '',
      line2: '',
      city: '',
      district: '',
      postalCode: '',
      coordinates: { lng: 0, lat: 0 }
    },
    openingHours: DAYS.map((_, idx) => ({
      day: idx,
      open: '08:00',
      close: '20:00',
      closed: idx === 6
    })),
    isAvailable: true,
    is24x7: false,
    pharmacyServices: [],
    deliveryRadiusKm: 5,
    registrationDocument: null
  });

  const updateField = <K extends keyof PharmacyFormData>(
    key: K, 
    value: PharmacyFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const updateAddress = <K extends keyof PharmacyFormData['address']>(
    key: K,
    value: PharmacyFormData['address'][K]
  ) => {
    setFormData(prev => ({
      ...prev,
      address: { ...prev.address, [key]: value }
    }));
  };

  const updateOpeningHour = (
    dayIndex: number, 
    field: 'open' | 'close' | 'closed', 
    value: string | boolean
  ) => {
    setFormData(prev => ({
      ...prev,
      openingHours: prev.openingHours.map((hour, idx) =>
        idx === dayIndex ? { ...hour, [field]: value } : hour
      )
    }));
  };

  const toggleService = (service: string) => {
    setFormData(prev => ({
      ...prev,
      pharmacyServices: prev.pharmacyServices.includes(service)
        ? prev.pharmacyServices.filter(s => s !== service)
        : [...prev.pharmacyServices, service]
    }));
  };

  const validateStep = (currentStep: number): boolean => {
    switch (currentStep) {
      case 1:
        if (!formData.pharmacyName.trim()) {
          Alert.alert('Validation Error', 'Pharmacy name is required');
          return false;
        }
        if (!formData.pharmacyEmail.trim() || !formData.pharmacyEmail.includes('@')) {
          Alert.alert('Validation Error', 'Valid email is required');
          return false;
        }
        if (!formData.pharmacyPhone.trim() || formData.pharmacyPhone.length < 10) {
          Alert.alert('Validation Error', 'Valid phone number is required (min 10 digits)');
          return false;
        }
        if (!formData.pharmacyLicenseNumber.trim()) {
          Alert.alert('Validation Error', 'License number is required');
          return false;
        }
        if (!formData.registrationDocument) {
          Alert.alert('Validation Error', 'Registration document is required');
          return false;
        }
        return true;

      case 2:
        if (!formData.address.line1.trim()) {
          Alert.alert('Validation Error', 'Address line 1 is required');
          return false;
        }
        if (!formData.address.city.trim()) {
          Alert.alert('Validation Error', 'City is required');
          return false;
        }
        if (!formData.address.district.trim()) {
          Alert.alert('Validation Error', 'District is required');
          return false;
        }
        if (formData.address.coordinates.lng === 0 && formData.address.coordinates.lat === 0) {
          Alert.alert('Validation Error', 'Please set your pharmacy location');
          return false;
        }
        return true;

      case 3:
      case 4:
        return true;

      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handlePrevious = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  return {
    step,
    formData,
    loading,
    updateField,
    updateAddress,
    updateOpeningHour,
    toggleService,
    handleNext,
    handlePrevious,
    setStep,
    setLoading,
  };
};