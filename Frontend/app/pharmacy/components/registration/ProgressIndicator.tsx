import React from 'react';
import { View, Text } from 'react-native';

type Props = {
  currentStep: number;
  totalSteps: number;
};

const STEP_LABELS = ['Basic', 'Address', 'Hours', 'Services'];

export default function ProgressIndicator({ currentStep, totalSteps }: Props) {
  return (
    <View className="flex-row justify-between items-center mb-6 px-4">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
        <React.Fragment key={step}>
          <View className="items-center">
            <View
              className={`w-10 h-10 rounded-full items-center justify-center ${
                step === currentStep
                  ? 'bg-[#139D92]'
                  : step < currentStep
                  ? 'bg-[#139D92]/70'
                  : 'bg-gray-300'
              }`}
            >
              <Text className="text-white font-semibold">{step}</Text>
            </View>
            <Text 
              className={`text-xs mt-1 ${
                step === currentStep ? 'text-[#139D92]' : 'text-gray-500'
              }`}
            >
              {STEP_LABELS[step - 1]}
            </Text>
          </View>
          {step < totalSteps && (
            <View 
              className={`flex-1 h-1 mx-2 ${
                step < currentStep ? 'bg-[#139D92]/70' : 'bg-gray-300'
              }`} 
            />
          )}
        </React.Fragment>
      ))}
    </View>
  );
}