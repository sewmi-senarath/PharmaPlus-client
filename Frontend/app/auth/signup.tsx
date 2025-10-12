// import React, { useState } from "react";
// import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import Ionicons from "@expo/vector-icons/Ionicons";
// import { router } from "expo-router";

// export default function Signup() {
//   const [role, setRole] = useState("admin");
//   const [fullName, setFullName] = useState("");
//   const [email, setEmail] = useState("");
//   const [phone, setPhone] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirm, setConfirm] = useState("");

//   const RoleBtn = ({ value, label, icon }: { value: string; label: string; icon: keyof typeof Ionicons.glyphMap }) => (
//     <Pressable onPress={() => setRole(value)} className={`flex-1 flex-row items-center justify-center px-3 py-3 rounded-xl border ${role === value ? "bg-teal-600 border-teal-600" : "bg-white border-gray-200"}`}>
//       <Ionicons name={icon} size={16} color={role === value ? "#fff" : "#0d9488"} />
//       <Text className={`ml-2 font-semibold ${role === value ? "text-white" : "text-gray-700"}`}>{label}</Text>
//     </Pressable>
//   );

//   return (
//     <SafeAreaView className="flex-1 bg-white">
//       <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 24 }}>
//         <View className="items-center mt-8 mb-6">
//           <View className="h-16 w-16 rounded-full bg-teal-600 items-center justify-center">
//             <Ionicons name="shield-outline" size={28} color="#fff" />
//           </View>
//           <Text className="text-2xl text-teal-700 font-semibold mt-3">PharmaPlus</Text>
//           <Text className="text-gray-500 mt-1">Secure Healthcare Access</Text>
//         </View>

//         {/* Role Picker */}
//         <View className="px-5">
//           <Text className="text-gray-600 mb-2">Select User Type</Text>
//           <View className="flex-row gap-3">
//             <RoleBtn value="customer" label="Customer" icon="person-outline" />
//             <RoleBtn value="pharmacist" label="Pharmacist" icon="people-outline" />
//           </View>
//         </View>
//         <View className="px-5 mt-3">
//           <View className="flex-row gap-3">
//             <RoleBtn value="rider" label="Rider" icon="location-outline" />
//             <RoleBtn value="admin" label="Admin" icon="shield-outline" />
//           </View>
//         </View>

//         {/* Segmented toggle */}
//         <View className="px-5 mt-5">
//           <View className="flex-row bg-gray-100 rounded-full p-1">
//             <Pressable onPress={() => router.replace("/auth/login")} className="flex-1 py-2 rounded-full items-center">
//               <Text className="font-semibold">Login</Text>
//             </Pressable>
//             <Pressable className="flex-1 py-2 rounded-full items-center bg-white">
//               <Text className="font-semibold">Sign Up</Text>
//             </Pressable>
//           </View>
//         </View>

//         {/* Form */}
//         <View className="px-5 mt-5">
//           <Text className="text-gray-600 mb-1">Full Name *</Text>
//           <TextInput placeholder="Enter full name" value={fullName} onChangeText={setFullName} className="bg-gray-100 rounded-xl px-3 py-3" />
//         </View>
//         <View className="px-5 mt-4">
//           <Text className="text-gray-600 mb-1">Email *</Text>
//           <TextInput placeholder="Enter email" inputMode="email" autoCapitalize="none" value={email} onChangeText={setEmail} className="bg-gray-100 rounded-xl px-3 py-3" />
//         </View>
//         <View className="px-5 mt-4">
//           <Text className="text-gray-600 mb-1">Phone Number *</Text>
//           <TextInput placeholder="+94 77 123 4567" inputMode="tel" value={phone} onChangeText={setPhone} className="bg-gray-100 rounded-xl px-3 py-3" />
//         </View>
//         <View className="px-5 mt-4">
//           <Text className="text-gray-600 mb-1">Password *</Text>
//           <TextInput placeholder="Create password" secureTextEntry value={password} onChangeText={setPassword} className="bg-gray-100 rounded-xl px-3 py-3" />
//         </View>
//         <View className="px-5 mt-4">
//           <Text className="text-gray-600 mb-1">Confirm Password *</Text>
//           <TextInput placeholder="Confirm password" secureTextEntry value={confirm} onChangeText={setConfirm} className="bg-gray-100 rounded-xl px-3 py-3" />
//         </View>

//         {/* Create */}
//         <View className="px-5 mt-6 mb-10">
//           <Pressable className="bg-teal-600 rounded-xl py-4 items-center" onPress={() => router.replace("/auth/login")}>
//             <Text className="text-white font-semibold">Create Account</Text>
//           </Pressable>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }
