import {
  Image,
  TextInput,
  View,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ImageBackground
} from "react-native";
import React from "react";
import { PageHeader } from '@/components/ui/page-header'
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Link, useRouter } from "expo-router";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { SafeAreaView } from "react-native-safe-area-context";


export default function AddDevice () {

    return (
        <SafeAreaView className="flex-1 bg-background">
            <ImageBackground className="flex-1" source={require('@/assets/images/device-con-bg.png')} resizeMode="cover">
                <View className=''>
                    <PageHeader title="Device Connection" showNotificationButton={false} />
                </View>
            </ImageBackground>
        </SafeAreaView>
    )
}