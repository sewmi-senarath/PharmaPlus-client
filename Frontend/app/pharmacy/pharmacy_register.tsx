import React from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';

import Button from './components/ui/Button';
import ProgressIndicator from './components/registration/ProgressIndicator';
import Step1BasicInfo from './components/registration/Step1BasicInfo';
import Step2Address from './components/registration/Step2Address';
import Step3Hours from './components/registration/Step3Hours';
import Step4Services from './components/registration/Step4Services';

import { usePharmacyForm } from './components/hooks/usePharmacyForm';
import { usePharmacyRegistration } from './components/hooks/usePharmacyRegistration';

export default function PharmacyRegisterScreen() {
  const {
    step,
    formData,
    loading,
    updateField,
    updateAddress,
    updateOpeningHour,
    toggleService,
    handleNext,
    handlePrevious,
  } = usePharmacyForm();

  const { handleSubmit, submitting } = usePharmacyRegistration(formData);

  // If you keep the custom green header, nudge the view a bit more on iOS
  const keyboardOffset = Platform.OS === 'ios' ? 60 : 0;

  return (
    <View className="flex-1 bg-[#E6F5F3]">
      {/* Custom header (keep/remove as you like) */}
      <View className="bg-[#139D92] pt-12 pb-6 px-4">
        <Text className="text-2xl font-bold text-white">Register Your Pharmacy</Text>
        <Text className="text-white/80 mt-1">Complete all steps to get started</Text>
      </View>

      <ProgressIndicator currentStep={step} totalSteps={4} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={keyboardOffset}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <ScrollView
            className="flex-1"
            contentContainerClassName="px-4 pb-8"
            keyboardShouldPersistTaps="handled"
          >
            {step === 1 && (
              <Step1BasicInfo formData={formData} updateField={updateField} />
            )}
            {step === 2 && (
              <Step2Address formData={formData} updateAddress={updateAddress} />
            )}
            {step === 3 && (
              <Step3Hours
                formData={formData}
                updateField={updateField}
                updateOpeningHour={updateOpeningHour}
              />
            )}
            {step === 4 && (
              <Step4Services
                formData={formData}
                updateField={updateField}
                toggleService={toggleService}
              />
            )}

            {/* Navigation Buttons */}
            <View className="flex-row gap-3 mt-6">
              {step > 1 && (
                <Button
                  title="Previous"
                  variant="outline"
                  onPress={handlePrevious}
                  className="flex-1"
                  disabled={loading || submitting}
                />
              )}
              {step < 4 ? (
                <Button title="Next" onPress={handleNext} className="flex-1" />
              ) : (
                <Button
                  title={submitting ? 'Registering...' : 'Complete Registration'}
                  onPress={handleSubmit}
                  disabled={submitting}
                  className="flex-1"
                />
              )}
            </View>

            {submitting && (
              <View className="mt-4">
                <ActivityIndicator size="large" color="#139D92" />
                <Text className="text-center text-gray-600 mt-2">
                  Uploading documents and registering pharmacy...
                </Text>
              </View>
            )}
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
}
