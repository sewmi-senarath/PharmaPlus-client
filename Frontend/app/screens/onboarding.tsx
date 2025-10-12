import React, { useState } from 'react';
import { View, Image, TouchableOpacity, Text, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const onboardingImages = [
  require('../../assets/images/2.png'),
  require('../../assets/images/3.png'),
  require('../../assets/images/4.png'),
  require('../../assets/images/5.png'),
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < onboardingImages.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Last screen, go to login
      router.replace('/screens/login');
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSkip = () => {
    router.replace('/screens/login');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1">
        {/* Skip Button - Top Right */}
        <View className="absolute top-4 right-6 z-10">
          <TouchableOpacity onPress={handleSkip} className="py-2 px-4">
            <Text className="text-gray-600 text-base font-semibold">
              Skip
            </Text>
          </TouchableOpacity>
        </View>

        {/* Image Container */}
        <View className="flex-1 justify-center items-center">
          <Image
            source={onboardingImages[currentIndex]}
            style={{ width: width, height: height * 0.7 }}
            resizeMode="contain"
          />
        </View>

        {/* Pagination Dots */}
        <View className="flex-row justify-center items-center mb-4">
          {onboardingImages.map((_, index) => (
            <View
              key={index}
              className={`h-2 rounded-full mx-1 ${
                index === currentIndex
                  ? 'bg-teal-600 w-8'
                  : 'bg-gray-300 w-2'
              }`}
            />
          ))}
        </View>

        {/* Navigation Buttons - Previous and Next */}
        <View className="flex-row justify-between items-center px-6 pb-8">
          {/* Previous Button */}
          <TouchableOpacity
            onPress={handlePrevious}
            disabled={currentIndex === 0}
            className={`py-3 px-6 ${currentIndex === 0 ? 'opacity-0' : 'opacity-100'}`}
          >
            <Text className="text-gray-600 text-base font-semibold">
              Previous
            </Text>
          </TouchableOpacity>

          {/* Next/Get Started Button */}
          <TouchableOpacity
            onPress={handleNext}
            className="bg-teal-600 py-3 px-8 rounded-lg"
          >
            <Text className="text-white text-base font-semibold">
              {currentIndex === onboardingImages.length - 1 ? 'Get Started' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
