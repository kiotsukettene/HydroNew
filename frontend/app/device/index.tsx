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
import React, {useState} from "react";
import { PageHeader } from '@/components/ui/page-header'
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Link, useRouter } from "expo-router";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { SafeAreaView } from "react-native-safe-area-context";
import { WifiOff } from "lucide-react-native"
import WifiModal from "@/components/ui/wifi-connection";

export default function DeviceConnection () {
const [wifiModal, setWifiModal] = useState(false);

    return (
        <ImageBackground className="flex-1" source={require('@/assets/images/device-con-bg.png')} resizeMode="cover">
            <SafeAreaView className="flex-1">
                <View className='flex-1 p-4'>
                    <PageHeader title="Device Connection" showNotificationButton={false} />
                    <ImageBackground
                        source={require('@/assets/images/add-device-circle.png')}
                        resizeMode="contain"
                        className="h-80 w-64 justify-center items-center self-center"
                    >
                        <View className="p-4 items-center justify-center">
                            <Text className="text-secondary font-bold text-5xl">+</Text>
                        </View>
                    </ImageBackground>
                    <ScrollView className="flex-1 bg-white/20 rounded-3xl p-4">
                        <View className="mt-4 justify-center items-center">
                            <WifiOff size={48} color="white" />
                            <Text className="text-white">No Device Connected</Text>

                        </View>
                    </ScrollView>
                    <Button className="bg-[#155036] mt-3" onPress={() => setWifiModal(true)}> <Text className="text-white">Add Device</Text></Button>
                </View>

                <WifiModal
                    visible={wifiModal}
                    onClose={() => setWifiModal(false)}
                    onConnect={({ ssid, password }) => {
                        console.log("Connecting with:", ssid, password);
                        setWifiModal(false); 
                    }}
                />

            </SafeAreaView>
        </ImageBackground> 
    )
}