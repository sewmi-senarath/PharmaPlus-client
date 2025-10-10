import React, { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";

type Role = "customer" | "pharmacist" | "rider" | "admin";

const RoleButton = ({ role, label, selected, onPress, icon }: { role: Role; label: string; selected: boolean; onPress: (r: Role) => void; icon: keyof typeof Ionicons.glyphMap }) => (
  <Pressable
    onPress={() => onPress(role)}
    className={`flex-1 flex-row items-center justify-center px-3 py-3 rounded-xl border ${selected ? "bg-teal-600 border-teal-600" : "bg-white border-gray-200"}`}
  >
    <Ionicons name={icon} size={16} color={selected ? "#fff" : "#0d9488"} />
    <Text className={`ml-2 font-semibold ${selected ? "text-white" : "text-gray-700"}`}>{label}</Text>
  </Pressable>
);

export default function Login() {
  const insets = useSafeAreaInsets();
  const [role, setRole] = useState<Role>("customer");
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hide, setHide] = useState(true);

  const quickFill = () => {
    setEmail("customer@test.com");
    setPassword("123456");
    setRole("customer");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 24) }}>
        {/* Header */}
        <View className="items-center mt-8 mb-6">
          <View className="h-16 w-16 rounded-full bg-teal-600 items-center justify-center">
            <Ionicons name="shield-outline" size={28} color="#fff" />
          </View>
          <Text className="text-2xl text-teal-700 font-semibold mt-3">PharmaPlus</Text>
          <Text className="text-gray-500 mt-1">Secure Healthcare Access</Text>
        </View>

        {/* Role Picker */}
        <View className="px-5">
          <Text className="text-gray-600 mb-2">Select User Type</Text>
          <View className="flex-row gap-3">
            <RoleButton role="customer" label="Customer" selected={role === "customer"} onPress={setRole} icon="person-outline" />
            <RoleButton role="pharmacist" label="Pharmacist" selected={role === "pharmacist"} onPress={setRole} icon="people-outline" />
          </View>
          <View className="flex-row gap-3 mt-3">
            <RoleButton role="rider" label="Rider" selected={role === "rider"} onPress={setRole} icon="location-outline" />
            <RoleButton role="admin" label="Admin" selected={role === "admin"} onPress={setRole} icon="shield-outline" />
          </View>
        </View>

        {/* Segmented toggle */}
        <View className="px-5 mt-5">
          <View className="flex-row bg-gray-100 rounded-full p-1">
            <Pressable onPress={() => setTab("login")} className={`flex-1 py-2 rounded-full items-center ${tab === "login" ? "bg-white" : ""}`}>
              <Text className="font-semibold">Login</Text>
            </Pressable>
            <Pressable onPress={() => { setTab("signup"); router.replace("/auth/signup"); }} className={`flex-1 py-2 rounded-full items-center ${tab === "signup" ? "bg-white" : ""}`}>
              <Text className="font-semibold">Sign Up</Text>
            </Pressable>
          </View>
        </View>

        {/* Email */}
        <View className="px-5 mt-5">
          <Text className="text-gray-600 mb-1">Email</Text>
          <View className="flex-row items-center bg-gray-100 rounded-xl px-3">
            <Ionicons name="mail-outline" size={16} color="#94a3b8" />
            <TextInput
              placeholder="Enter email"
              inputMode="email"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              className="flex-1 py-3 ml-2"
            />
          </View>
        </View>

        {/* Password */}
        <View className="px-5 mt-4">
          <Text className="text-gray-600 mb-1">Password</Text>
          <View className="flex-row items-center bg-gray-100 rounded-xl px-3">
            <Ionicons name="key-outline" size={16} color="#94a3b8" />
            <TextInput
              placeholder="Enter password"
              secureTextEntry={hide}
              value={password}
              onChangeText={setPassword}
              className="flex-1 py-3 ml-2"
            />
            <Pressable onPress={() => setHide((h) => !h)}>
              <Ionicons name={hide ? "eye-outline" : "eye-off-outline"} size={18} color="#64748b" />
            </Pressable>
          </View>
        </View>

        {/* Login button */}
        <View className="px-5 mt-5">
          <Pressable
            className="bg-teal-600 rounded-xl py-4 items-center"
            onPress={() => {
              const route =
                role === "rider" ? "/usermain_page/deliveryperson" :
                role === "customer" ? "/usermain_page/customer" :
                role === "pharmacist" ? "/usermain_page/pharmacist" :
                "/usermain_page/admin";
              router.replace(route);
            }}
          > 
            <Text className="text-white font-semibold">Login</Text>
          </Pressable>
        </View>

        {/* Demo creds */}
        <View className="px-5 mt-5">
          <View className="bg-blue-50 rounded-xl p-4">
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-700 font-semibold">Demo credentials for customer:</Text>
              <Pressable className="bg-white rounded-full px-3 py-1 border border-gray-200" onPress={quickFill}>
                <Text className="text-gray-700 text-xs">Quick Fill</Text>
              </Pressable>
            </View>
            <View className="flex-row items-center mt-3">
              <Ionicons name="mail-outline" size={14} color="#64748b" />
              <Text className="ml-2 text-gray-700">customer@test.com</Text>
            </View>
            <View className="flex-row items-center mt-2">
              <Ionicons name="key-outline" size={14} color="#64748b" />
              <Text className="ml-2 text-gray-700">123456</Text>
            </View>
          </View>
        </View>

        {/* Biometrics row */}
        <View className="px-5 mt-6 mb-8 flex-row gap-3">
          <Pressable className="flex-1 border rounded-xl py-3 items-center">
            <Text className="font-medium">Fingerprint</Text>
          </Pressable>
          <Pressable className="flex-1 border rounded-xl py-3 items-center">
            <Text className="font-medium">Face ID</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
