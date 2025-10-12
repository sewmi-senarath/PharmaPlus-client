// app/pharmacy/add-medicine.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Image,
  StyleSheet,
} from "react-native";
import { Camera, CameraView } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from '@expo/vector-icons';

// Type definitions for the form state and API suggestions
type FormState = {
  medicineName: string;
  genericName: string;
  brandName: string;
  dosage: string;
  strength: string;
  doseForm: string;
  route: string;
  category: string;
  manufacturer: string;
  drugCode: string;
  price: string;
  stockQty: string;
  minQty: string;
  batchNo: string;
  expiryDate: string;
  barcodes: string[];
  requiresPrescription: boolean;
  packSize: string;
  description: string;
  usageInstructions: string;
};

type Suggestion = {
  _id: string;
  genericName: string;
  brandNames?: string[];
  strength?: string;
  doseForm?: string;
  route?: string;
  manufacturer?: string;
  atcCode?: string;
  packSize?: string;
};

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "";

const AddMedicineScreen: React.FC = () => {
  const params = useLocalSearchParams();
  const { pharmacyId } = params;

  const [entryMethod, setEntryMethod] = useState<"manual" | "barcode">("manual");
  const [showScanner, setShowScanner] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);

  const [formData, setFormData] = useState<FormState>({
    medicineName: "", genericName: "", brandName: "", dosage: "", strength: "",
    doseForm: "Tablet", route: "Oral", category: "Other", manufacturer: "", drugCode: "",
    price: "", stockQty: "", minQty: "10", batchNo: "", expiryDate: "", barcodes: [],
    requiresPrescription: false, packSize: "", description: "", usageInstructions: "",
  });
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<ImagePicker.ImagePickerAsset[]>([]);

  // Request camera permissions on component mount
  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };
    getCameraPermissions();
  }, []);

  // Barcode scanning handler
  const handleBarcodeScanned = async ({ type, data }: { type: string; data: string }) => {
    setScanned(true); // Prevent multiple scans
    setShowScanner(false);
    setLoading(true);
    
    try {
      const token = await AsyncStorage.getItem("accessToken");
      const res = await axios.post(
        `${API_URL}/api/medicine/pharmacies/${pharmacyId}/scan`,
        { gtin: data, createDraft: false },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const body = res.data;

      if (body.success && body.match === "master") {
        setFormData((prev) => ({ ...prev, ...(body.autoFilledData as any), barcodes: [data] }));
        Alert.alert("Medicine Found!", "Information auto-filled. Please complete price and stock details.");
      } else if (body.success && body.match === "existing") {
        Alert.alert("Already in Inventory", "This medicine is already in your inventory.", [
          { 
            text: "View", 
            onPress: () => router.push({ 
              pathname: "/pharmacy/medicine-details/medicine-id", 
              params: { id: body.medicine._id } 
            }) 
          },
          { text: "OK" },
        ]);
      } else {
        Alert.alert("Not Found", "Medicine not found. Please enter details manually.", [
            { text: "OK", onPress: () => setScanned(false) } // Allow scanning again
        ]);
        setFormData((prev) => ({ ...prev, barcodes: [data] }));
      }
    } catch (e) {
      Alert.alert("Error", "Failed to process barcode. Please try again.", [
        { text: "OK", onPress: () => setScanned(false) } // Allow scanning again
      ]);
      console.error("scan error:", e);
    } finally {
      setLoading(false);
    }
  };
  
  // Your existing functions for handling form submission and image picking
  const handleSubmit = async () => { /* ... your existing logic ... */ };
  const pickImage = async () => { /* ... your existing logic ... */ };

  if (hasPermission === null) {
    return <View className="flex-1 justify-center items-center"><ActivityIndicator /></View>;
  }
  if (hasPermission === false) {
    return <Text className="text-center mt-12 p-4">No access to camera. Please enable it in your phone settings.</Text>;
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4 bg-white">
        <Text className="text-xl font-bold mb-3 text-gray-800">Add a New Medicine</Text>
        <View className="flex-row space-x-3">
          <TouchableOpacity
            className={`flex-1 p-4 rounded-lg flex-row items-center justify-center space-x-2 ${entryMethod === "manual" ? "bg-[#139D92]" : "bg-white border border-gray-300"}`}
            onPress={() => setEntryMethod("manual")}
          >
            <Ionicons name="create-outline" size={20} color={entryMethod === "manual" ? "white" : "#4B5563"} />
            <Text className={`font-semibold ${entryMethod === "manual" ? "text-white" : "text-gray-700"}`}>Manual Entry</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`flex-1 p-4 rounded-lg flex-row items-center justify-center space-x-2 ${entryMethod === "barcode" ? "bg-[#139D92]" : "bg-white border border-gray-300"}`}
            onPress={() => {
              setEntryMethod("barcode");
              setShowScanner(true);
              setScanned(false); // Reset scanned state each time scanner opens
            }}
          >
            <Ionicons name="barcode-outline" size={20} color={entryMethod === "barcode" ? "white" : "#4B5563"} />
            <Text className={`font-semibold ${entryMethod === "barcode" ? "text-white" : "text-gray-700"}`}>Scan Barcode</Text>
          </TouchableOpacity>
        </View>
      </View>

      {showScanner && (
        <View className="h-96 bg-black mx-4 my-4 rounded-lg overflow-hidden">
          <CameraView
            onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: ["ean13", "ean8", "upc_a", "upc_e", "code128"],
            }}
            style={StyleSheet.absoluteFillObject}
          />
           <View className="absolute top-0 left-0 right-0 bottom-0 items-center justify-center pointer-events-none">
              <Text className="text-white text-center -mt-32 font-semibold bg-black/50 px-4 py-2 rounded-lg">Point camera at a barcode</Text>
              <View className="w-64 h-32 border-4 border-white rounded-lg opacity-75"/>
           </View>
          <TouchableOpacity
            className="absolute top-4 right-4 bg-white/70 p-2 rounded-full"
            onPress={() => setShowScanner(false)}
          >
            <Ionicons name="close" size={24} color="black" />
          </TouchableOpacity>
        </View>
      )}

      {/* Your form UI (TextInputs, Pickers, etc.) */}
      <View className="p-4">
        <View className="mb-4">
          <Text className="text-sm font-semibold mb-1 text-gray-700">Medicine Name *</Text>
          <TextInput
              className="border border-gray-300 rounded-lg p-3 bg-white"
              placeholder="Enter medicine name"
              value={formData.medicineName}
              onChangeText={(text) => setFormData((p) => ({ ...p, medicineName: text }))}
          />
        </View>
        
        {/* ... Paste the rest of your form fields here (Dosage, Price, Stock, etc.) ... */}
        
        <TouchableOpacity 
            className={`p-4 rounded-lg ${loading ? "bg-gray-400" : "bg-[#139D92]"} mb-6 mt-6`} 
            onPress={handleSubmit} 
            disabled={loading}
        >
          {loading ? <ActivityIndicator color="white" /> : <Text className="text-white text-center font-bold text-lg">Add to Inventory</Text>}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default AddMedicineScreen;

