import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';

export default function TermsAndConditions() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-4 pt-4 flex-1">
        <View className="flex-row items-center w-full px-4 relative">
          <View className="absolute">
            <View className="size-8 rounded-full bg-[#E8E8E9] items-center justify-center">
              <ArrowLeft size={22} color="#6C7278" />
            </View>
          </View>
          <Text className="text-2xl text-primary font-poppins-medium text-center flex-1">
            Terms & Conditions
          </Text>
        </View>

        {/* Scrollable content */}
        <ScrollView
          showsVerticalScrollIndicator={true}
          contentContainerStyle={{flexGrow: 1}}
        >
          <Text className="text-base font-poppins text-foreground leading-relaxed my-4 text-justify">
            Welcome to Hydronew. By downloading, installing, or using this
            application, you agree to be bound by these Terms and Conditions.
            Please read them carefully before using the service.
          </Text>

          <Text className="text-lg font-poppins-semibold text-primary mb-1">
            1. User Accounts
          </Text>
          <Text className="text-base font-poppins text-muted-foreground leading-relaxed mb-3 text-justify">
            To use certain features, you may be required to create an account.
            You are responsible for maintaining the confidentiality of your login
            credentials and for all activities under your account. You agree to
            provide accurate and complete information and to notify us of any
            unauthorized use of your account.
          </Text>

          <Text className="text-lg font-poppins-semibold text-primary mb-1">
            2. Use of Service
          </Text>
          <Text className="text-base font-poppins text-muted-foreground leading-relaxed mb-3 text-justify">
            You agree to use the application only for lawful purposes and in
            accordance with these Terms. You may not use the application to
            engage in any activity that could damage, disable, or interfere with
            the proper functioning of the service or other users’ access.
          </Text>

          <Text className="text-lg font-poppins-semibold text-primary mb-1">
            3. Privacy and Data Collection
          </Text>
          <Text className="text-base font-poppins text-muted-foreground leading-relaxed mb-3 text-justify">
            Your privacy is important to us. By using the application, you
            consent to the collection, use, and storage of your data as outlined
            in our Privacy Policy. We do not share your personal information with
            third parties except as required by law or as necessary to provide
            the service.
          </Text>

          <Text className="text-lg font-poppins-semibold text-primary mb-1">
            4. Intellectual Property
          </Text>
          <Text className="text-base font-poppins text-muted-foreground leading-relaxed mb-3 text-justify">
            All content, features, and functionality of the application,
            including but not limited to software, text, graphics, and logos, are
            the exclusive property of Hydronew and are protected by copyright,
            trademark, and other intellectual property laws.
          </Text>

          <Text className="text-lg font-poppins-semibold text-primary mb-1">
            5. Limitation of Liability
          </Text>
          <Text className="text-base font-poppins text-muted-foreground leading-relaxed mb-3 text-justify">
            To the maximum extent permitted by law, Hydronew shall not be liable
            for any direct, indirect, incidental, or consequential damages
            resulting from your use of or inability to use the application,
            including but not limited to data loss, service interruption, or
            system errors.
          </Text>

          <Text className="text-lg font-poppins-semibold text-primary mb-1">
            6. Termination
          </Text>
          <Text className="text-base font-poppins text-muted-foreground leading-relaxed mb-3 text-justify">
            We may suspend or terminate your access to the application at any
            time without prior notice if you violate these Terms and Conditions.
            Upon termination, all rights granted to you under these Terms will
            cease immediately.
          </Text>

          <Text className="text-lg font-poppins-semibold text-primary mb-1">
            7. Governing Law
          </Text>
          <Text className="text-base font-poppins text-muted-foreground leading-relaxed mb-3 text-justify">
            These Terms and Conditions shall be governed by and construed in
            accordance with the laws of The Philippines, without regard to its
            conflict of law principles.
          </Text>

          <Text className="text-lg font-poppins-semibold text-primary mb-1">
            8. Changes to Terms
          </Text>
          <Text className="text-base font-poppins text-muted-foreground leading-relaxed mb-3 text-justify">
            We reserve the right to modify or update these Terms at any time. Any
            changes will be effective immediately upon posting within the
            application. Continued use of the service after such changes
            constitutes your acceptance of the new Terms.
          </Text>

          <Text className="text-lg font-poppins-semibold text-primary mb-1">
            9. Contact Us
          </Text>
          <Text className="text-base font-poppins text-muted-foreground leading-relaxed mb-3 text-justify">
            If you have any questions about these Terms and Conditions, please
            contact us at support.hydronew@email.com.
          </Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
