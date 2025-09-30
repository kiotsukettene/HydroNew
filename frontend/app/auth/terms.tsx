import { useRouter } from "expo-router";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Terms() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-[#F3F3F3]">
      <View className="h-[190px] w-full overflow-hidden">
        <Image
          source={require("../../assets/images/bg-2.png")}
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>

      <ScrollView className="-mt-10 px-5" contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="bg-white rounded-2xl p-5 shadow">
          <TouchableOpacity onPress={() => router.back()} className="w-9 h-9 rounded-full bg-white items-center justify-center shadow absolute -top-4 -left-2">
            <Ionicons name="chevron-back" size={22} color="#1F2937" />
          </TouchableOpacity>

          <Text className="text-center text-[#53610D] font-extrabold text-lg mb-3">Terms and Conditions</Text>

          <View className="gap-4">
            <View>
              <Text className="font-semibold text-[#111827]">Acceptance of Terms</Text>
              <Text className="text-[#4B5563] mt-1">
                By creating an account and using this application, you acknowledge that you have read, understood, and agreed to these Terms and Conditions. If you do not agree, you must not proceed with account creation or use of the application.
              </Text>
            </View>

            <View>
              <Text className="font-semibold text-[#111827]">User Responsibilities</Text>
              <Text className="text-[#4B5563] mt-1">
                You agree to provide accurate information during registration and maintain the confidentiality of your login credentials. Any unauthorized use of your account or security breach must be reported immediately. Misuse of the application, including fraudulent activities, may result in account suspension or termination.
              </Text>
            </View>

            <View>
              <Text className="font-semibold text-[#111827]">Data Usage and Privacy</Text>
              <Text className="text-[#4B5563] mt-1">
                By using this application, you consent to the collection, storage, and use of your data in accordance with our Privacy Policy. We ensure that your information will not be shared with third parties without your consent, except where required by law.
              </Text>
            </View>

            <View>
              <Text className="font-semibold text-[#111827]">Limitation of Liability</Text>
              <Text className="text-[#4B5563] mt-1">
                The application is provided “as is,” without warranties of any kind. We are not liable for any loss, damage, or inconvenience arising from the use or inability to use the application. Continued use signifies your full acceptance of these terms.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}


