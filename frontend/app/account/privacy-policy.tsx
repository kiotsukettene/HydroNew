import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ArrowLeft } from 'lucide-react-native'
import { PageHeader } from '@/components/ui/page-header';

export default function PrivacyPolicy() {
  return (
     <SafeAreaView className='flex-1'>
      <View className='px-4 pt-4 flex-1'>
        {/* ================= Title  ==================== */}
        <PageHeader title="Privacy Policy" showNotificationButton={false} />
        <ScrollView
          showsVerticalScrollIndicator={true}
          contentContainerStyle={{ flexGrow: 1 }}
        >

          <Text className="text-base font-poppins text-muted-foreground leading-relaxed my-4 text-justify">
            Last updated: 2025
          </Text>

          <Text className="text-base font-poppins text-muted-foreground leading-relaxed mb-3 text-justify">
            Hydronew values your privacy. This Privacy Policy explains how we collect,
            use, and protect your information when you use our mobile application.
          </Text>

          <Text className="text-lg font-poppins-semibold text-primary mb-1">
            Information We Collect
          </Text>
          <Text className="text-base font-poppins text-muted-foreground leading-relaxed mb-3 text-justify">
            When using Hydronew, we may collect the following personal information:
          </Text>
          <Text className="text-base font-poppins text-muted-foreground leading-relaxed mb-3 ml-4 text-justify">
            • Name{'\n'}
            • Email address{'\n'}
            • Phone number{'\n'}
            • Date of birth
          </Text>

          <Text className="text-lg font-poppins-semibold text-primary mb-1">
            How We Use Information
          </Text>
          <Text className="text-base font-poppins text-muted-foreground leading-relaxed mb-3 text-justify">
            We may use the collected information to:
          </Text>
          <Text className="text-base font-poppins text-muted-foreground leading-relaxed mb-3 ml-4 text-justify">
            • Create and manage your account{'\n'}
            • Provide and improve our services{'\n'}
            • Communicate and connect with you {"\u00A0"}{"\u00A0"}(e.g., notifications, updates, support){'\n'}
            • Personalize your experience within the {"\u00A0"}{"\u00A0"}app
          </Text>

          <Text className="text-lg font-poppins-semibold text-primary mb-1">
            Sharing of Information
          </Text>
          <Text className="text-base font-poppins text-muted-foreground leading-relaxed mb-3 text-justify">
            We do not sell, trade, or rent your personal information to third parties.
            We may only share your information with trusted third-party services necessary
            to operate the app (such as authentication, hosting, or analytics providers),
            in compliance with their own privacy policies.
          </Text>

          <Text className="text-lg font-poppins-semibold text-primary mb-1">
            Data Security
          </Text>
          <Text className="text-base font-poppins text-muted-foreground leading-relaxed mb-3 text-justify">
            We take reasonable steps to protect your personal information. However, please
            note that no method of transmission over the internet or electronic storage is
            100% secure.
          </Text>

          <Text className="text-lg font-poppins-semibold text-primary mb-1">
            Children’s Privacy
          </Text>
          <Text className="text-base font-poppins text-muted-foreground leading-relaxed mb-3 text-justify">
            Our app is not directed toward children under 13, and we do not knowingly collect
            personal information from children.
          </Text>

          <Text className="text-lg font-poppins-semibold text-primary mb-1">
            Changes to This Policy
          </Text>
          <Text className="text-base font-poppins text-muted-foreground leading-relaxed mb-3 text-justify">
            We may update this Privacy Policy from time to time. Any updates will be posted
            here with a revised date.
          </Text>

          <Text className="text-lg font-poppins-semibold text-primary mb-1">
            Contact Us
          </Text>
          <Text className="text-base font-poppins text-muted-foreground leading-relaxed mb-3 text-justify">
            If you have any questions or concerns about this Privacy Policy, please contact us at:{'\n'}
            📧 support.hydronew@email.com
          </Text>

        </ScrollView>
      </View> 

      </SafeAreaView>
  )
} 