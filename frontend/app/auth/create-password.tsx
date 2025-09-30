import { useState } from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";

export default function CreatePassword() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const requirements = [
    { text: "At least 8 characters", met: newPassword.length >= 8 },
    { text: "One uppercase letter", met: /[A-Z]/.test(newPassword) },
    { text: "One number", met: /\d/.test(newPassword) },
    { text: "One special character", met: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword) },
  ];

  function resetPassword() {
    if (!newPassword || !confirmPassword) {
      Toast.show({ type: "error", text1: "Please fill in all fields" });
      return;
    }
    if (newPassword !== confirmPassword) {
      Toast.show({ type: "error", text1: "Passwords do not match" });
      return;
    }
    if (!requirements.every(req => req.met)) {
      Toast.show({ type: "error", text1: "Password does not meet requirements" });
      return;
    }
    router.push("/auth/password-success");
  }

  return (
    <View className="flex-1 bg-[#F3F3F3] items-center justify-center px-6">
      <View className="bg-white rounded-3xl w-full p-6 relative">
        <TouchableOpacity onPress={() => router.back()} className="w-9 h-9 rounded-full bg-gray-100 items-center justify-center absolute top-4 left-4">
          <Ionicons name="chevron-back" size={20} color="#374151" />
        </TouchableOpacity>

        <View className="items-center mt-8">
          <Text className="text-2xl font-extrabold text-[#1D7A52] mb-2">Create New Password</Text>
          <Text className="text-center text-[#6B7280] mb-6">Create a new secure password for your account.</Text>

          <View className="w-full mb-4">
            <Text className="text-[#374151] text-sm mb-2">New Password</Text>
            <View className="relative">
              <TextInput
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Enter new password"
                secureTextEntry={!showNewPassword}
                className="w-full border border-[#1D7A52] rounded-xl px-4 py-3 bg-white pr-12"
              />
              <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-3">
                <Ionicons name={showNewPassword ? "eye-off" : "eye"} size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>

          <View className="w-full mb-6">
            <Text className="text-[#374151] text-sm mb-2">Confirm Password</Text>
            <View className="relative">
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm new password"
                secureTextEntry={!showConfirmPassword}
                className="w-full border border-[#1D7A52] rounded-xl px-4 py-3 bg-white pr-12"
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-3">
                <Ionicons name={showConfirmPassword ? "eye-off" : "eye"} size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>

          <View className="w-full mb-6">
            <Text className="text-[#374151] text-sm mb-3">Password must contain:</Text>
            {requirements.map((req, index) => (
              <View key={index} className="flex-row items-center mb-2">
                <Ionicons name={req.met ? "checkmark-circle" : "ellipse-outline"} size={16} color={req.met ? "#10B981" : "#D1D5DB"} />
                <Text className={`ml-2 text-sm ${req.met ? "text-[#10B981]" : "text-[#6B7280]"}`}>{req.text}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity onPress={resetPassword} className="bg-[#1D7A52] rounded-xl py-4 items-center w-full">
            <Text className="text-white font-semibold">Reset Password</Text>
          </TouchableOpacity>
        </View>

        <Image source={require("../../assets/images/leaf.png")} className="absolute bottom-0 left-0 w-16 h-16" resizeMode="contain" />
        <Image source={require("../../assets/images/leaf.png")} className="absolute bottom-0 right-0 w-16 h-16" resizeMode="contain" />
      </View>
    </View>
  );
}
