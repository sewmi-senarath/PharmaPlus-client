import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';

type DocumentFile = {
  uri: string;
  name: string;
  type: string;
  size: number;
} | null;

type Props = {
  document: DocumentFile;
  onDocumentSelected: (doc: DocumentFile) => void;
};

export default function PharmacyDocumentPicker({ document, onDocumentSelected }: Props) {
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const file = result.assets[0];

      // Check file size (max 5MB)
      if (file.size && file.size > 5 * 1024 * 1024) {
        Alert.alert('File Too Large', 'Please select a file smaller than 5MB.');
        return;
      }

      onDocumentSelected({
        uri: file.uri,
        name: file.name,
        type: file.mimeType || 'application/octet-stream',
        size: file.size || 0,
      });

      Alert.alert('Success', `Document "${file.name}" selected successfully!`);
    } catch (error) {
      console.error('Document picker error:', error);
      Alert.alert('Error', 'Failed to pick document. Please try again.');
    }
  };

  const removeDocument = () => {
    Alert.alert(
      'Remove Document',
      'Are you sure you want to remove this document?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => onDocumentSelected(null),
        },
      ]
    );
  };

  return (
    <View className="mb-4">
      <Text className="mb-2 font-medium text-gray-700">Registration Document *</Text>
      <Text className="text-sm text-gray-500 mb-2">
        Upload your pharmacy license or registration certificate (PDF or Image, max 5MB)
      </Text>

      {document ? (
        <View className="bg-green-50 border border-green-200 rounded-xl p-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-1 mr-3">
              <Text className="font-medium text-green-900" numberOfLines={1}>
                📄 {document.name}
              </Text>
              <Text className="text-sm text-green-700 mt-1">
                {(document.size / 1024).toFixed(2)} KB
              </Text>
            </View>
            <TouchableOpacity
              onPress={removeDocument}
              className="bg-red-500 px-4 py-2 rounded-lg"
            >
              <Text className="text-white font-medium">Remove</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity
          onPress={pickDocument}
          className="h-32 border-2 border-dashed border-gray-300 rounded-xl items-center justify-center bg-gray-50"
        >
          <Text className="text-4xl mb-2">📁</Text>
          <Text className="font-medium text-gray-700">Tap to Upload Document</Text>
          <Text className="text-sm text-gray-500 mt-1">PDF or Image (max 5MB)</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}