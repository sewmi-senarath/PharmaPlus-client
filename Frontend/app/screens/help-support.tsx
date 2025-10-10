import { View, Text, TouchableOpacity, ScrollView, Linking, Alert } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

export default function HelpSupportScreen() {
  const router = useRouter();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: 'How do I update my delivery status?',
      answer: 'You can update your delivery status by tapping the status buttons on each order card, or use voice commands in the Voice tab for hands-free updates while driving.'
    },
    {
      question: 'What should I do if the customer is unavailable?',
      answer: 'First, try calling the customer using the Call button. If they don\'t answer, wait 5 minutes and try again. If still unavailable, use the "Customer unavailable" voice command or contact support.'
    },
    {
      question: 'How do I handle special delivery instructions?',
      answer: 'Special instructions are shown in yellow warning boxes on order cards. Some orders have audio instructions - tap the Audio button to listen. For QR code verification, tap the QR Code button.'
    },
    {
      question: 'What if I have a vehicle breakdown?',
      answer: 'Immediately contact support using the emergency contact number. Mark all active orders with "Delay reported" and provide your location. Support will arrange assistance and reassign orders if needed.'
    },
    {
      question: 'How is my payment calculated?',
      answer: 'Your payment is calculated based on: base delivery fee, distance traveled, delivery time, and customer tips. You can view detailed earnings in your profile stats.'
    },
    {
      question: 'Can I reject an order?',
      answer: 'You can reject orders if you\'re offline. Once you accept an order while online, please complete it. Frequent rejections may affect your rating and account standing.'
    },
    {
      question: 'How do I use voice commands?',
      answer: 'Go to the Voice tab and tap the microphone button. Speak clearly with commands like "Pickup confirmed" or "In transit". Voice commands work with Bluetooth headsets too.'
    },
    {
      question: 'What if medication requires special handling?',
      answer: 'Orders with special handling requirements will have warning notices. Audio instructions provide detailed handling information. Keep medications away from heat and direct sunlight.'
    }
  ];

  const contactOptions = [
    {
      icon: 'call',
      title: 'Call Support',
      subtitle: '24/7 Hotline',
      value: '+94 11 234 5678',
      action: () => handleCall('+94112345678')
    },
    {
      icon: 'logo-whatsapp',
      title: 'WhatsApp',
      subtitle: 'Quick messaging',
      value: '+94 77 234 5678',
      action: () => handleWhatsApp('+94772345678')
    },
    {
      icon: 'mail',
      title: 'Email Support',
      subtitle: 'Response within 24 hours',
      value: 'support@meddelivery.lk',
      action: () => handleEmail('support@meddelivery.lk')
    },
    {
      icon: 'time',
      title: 'Emergency Line',
      subtitle: 'Urgent issues only',
      value: '+94 11 999 8888',
      action: () => handleEmergencyCall('+94119998888')
    }
  ];

  const quickLinks = [
    {
      icon: 'document-text',
      title: 'Rider Guidelines',
      subtitle: 'Delivery best practices'
    },
    {
      icon: 'shield-checkmark',
      title: 'Safety Protocols',
      subtitle: 'Stay safe on the road'
    },
    {
      icon: 'cash',
      title: 'Payment & Earnings',
      subtitle: 'How payments work'
    },
    {
      icon: 'star',
      title: 'Rating System',
      subtitle: 'Maintain your rating'
    }
  ];

  const handleCall = (phoneNumber: string) => {
    const phoneUrl = `tel:${phoneNumber}`;
    Linking.openURL(phoneUrl).catch(() => 
      Alert.alert('Error', 'Unable to make phone call')
    );
  };

  const handleWhatsApp = (phoneNumber: string) => {
    const message = 'Hello, I need help with my delivery rider account.';
    const whatsappUrl = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
    Linking.openURL(whatsappUrl).catch(() => 
      Alert.alert('Error', 'WhatsApp is not installed on your device')
    );
  };

  const handleEmail = (email: string) => {
    const emailUrl = `mailto:${email}?subject=Rider Support Request`;
    Linking.openURL(emailUrl).catch(() => 
      Alert.alert('Error', 'Unable to open email client')
    );
  };

  const handleEmergencyCall = (phoneNumber: string) => {
    Alert.alert(
      'Emergency Line',
      'This line is for urgent issues only. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Call Now', 
          onPress: () => handleCall(phoneNumber)
        }
      ]
    );
  };

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Help & Support',
          headerShown: true,
          headerStyle: { backgroundColor: '#0d9488' },
          headerTintColor: '#fff',
        }} 
      />
      <SafeAreaView className="flex-1 bg-gray-50">
        <ScrollView className="flex-1">
          {/* Header */}
          <View className="bg-teal-600 pt-6 pb-8 px-4">
            <View className="items-center">
              <View className="w-20 h-20 bg-white/20 rounded-full items-center justify-center mb-4">
                <Ionicons name="help-circle" size={48} color="white" />
              </View>
              <Text className="text-white text-2xl font-bold mb-2">
                How can we help?
              </Text>
              <Text className="text-teal-100 text-center">
                We're here to support you 24/7
              </Text>
            </View>
          </View>

          {/* Contact Options */}
          <View className="px-4 -mt-4 mb-6">
            <Text className="text-lg font-bold text-gray-900 mb-3">
              Contact Us
            </Text>
            {contactOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                onPress={option.action}
                className="bg-white rounded-xl p-4 mb-3 shadow-sm flex-row items-center"
              >
                <View className="w-12 h-12 bg-teal-100 rounded-full items-center justify-center mr-4">
                  <Ionicons name={option.icon as any} size={24} color="#0d9488" />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-900 font-semibold text-base">
                    {option.title}
                  </Text>
                  <Text className="text-gray-500 text-xs mt-1">
                    {option.subtitle}
                  </Text>
                  <Text className="text-teal-600 text-sm mt-1 font-medium">
                    {option.value}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            ))}
          </View>

          {/* FAQ Section */}
          <View className="px-4 mb-6">
            <Text className="text-lg font-bold text-gray-900 mb-3">
              Frequently Asked Questions
            </Text>
            {faqs.map((faq, index) => (
              <View key={index} className="bg-white rounded-xl mb-3 shadow-sm overflow-hidden">
                <TouchableOpacity
                  onPress={() => toggleFaq(index)}
                  className="p-4 flex-row items-center justify-between"
                >
                  <Text className="text-gray-900 font-semibold flex-1 pr-2">
                    {faq.question}
                  </Text>
                  <Ionicons 
                    name={expandedFaq === index ? 'chevron-up' : 'chevron-down'} 
                    size={20} 
                    color="#0d9488" 
                  />
                </TouchableOpacity>
                {expandedFaq === index && (
                  <View className="px-4 pb-4 pt-0">
                    <View className="border-t border-gray-100 pt-3">
                      <Text className="text-gray-600 leading-6">
                        {faq.answer}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            ))}
          </View>

          {/* Quick Links */}
          <View className="px-4 mb-6">
            <Text className="text-lg font-bold text-gray-900 mb-3">
              Resources
            </Text>
            {quickLinks.map((link, index) => (
              <TouchableOpacity
                key={index}
                className="bg-white rounded-xl p-4 mb-3 shadow-sm flex-row items-center"
              >
                <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-3">
                  <Ionicons name={link.icon as any} size={20} color="#3B82F6" />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-900 font-semibold">
                    {link.title}
                  </Text>
                  <Text className="text-gray-500 text-xs mt-1">
                    {link.subtitle}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            ))}
          </View>

          {/* Emergency Notice */}
          <View className="px-4 mb-6">
            <View className="bg-red-50 rounded-xl p-4 border border-red-200">
              <View className="flex-row items-start">
                <Ionicons name="alert-circle" size={24} color="#EF4444" />
                <View className="flex-1 ml-3">
                  <Text className="text-red-900 font-semibold mb-2">
                    Emergency Situations
                  </Text>
                  <Text className="text-red-800 text-sm leading-5">
                    In case of accidents, medical emergencies, or safety threats, 
                    immediately call emergency services (119) first, then contact our 
                    emergency line.
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* App Info */}
          <View className="px-4 mb-8">
            <View className="bg-gray-100 rounded-xl p-4">
              <Text className="text-gray-600 text-sm text-center">
                Med Delivery Rider App v1.0.0
              </Text>
              <Text className="text-gray-500 text-xs text-center mt-1">
                © 2024 Med Delivery. All rights reserved.
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}