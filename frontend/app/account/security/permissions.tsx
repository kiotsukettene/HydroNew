import React, { useState } from 'react';
import { View, Switch, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { Bell, Megaphone, Folder, RotateCcw, ArrowLeft } from 'lucide-react-native';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';

export default function Permissions() {
  const [inAppNotifications, setInAppNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [fileAccess, setFileAccess] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleRestoreSettings = () => {
    setShowModal(true);
  };

  return (
    <SafeAreaView className="flex-1">
      <View className="px-4 flex-1 items-center">
        {/* ================= Title ==================== */}
        <View className="flex-row items-center w-full px-4 relative">
          <View className="absolute">
            <View className="size-8 rounded-full bg-[#E8E8E9] items-center justify-center">
              <ArrowLeft size={22} color="#6C7278" />
            </View>
          </View>
          <Text className="text-2xl text-primary font-poppins-medium text-center flex-1">
            Preferences
          </Text>
        </View>

        {/* ================= Main Body ==================== */}
        <View className="w-full flex-1 mt-6">
          <Card className="py-2 rounded-lg border border-muted-foreground/10 bg-white shadow-lg">
            <CardContent>

              <View className="flex-col">
                <View className="flex-row items-center justify-between py-2">
                  <View className="flex-row items-center gap-3">
                    <Bell size={22} color="#166534" />
                    <Text className="text-base text-foreground">In-app Notifications</Text>
                  </View>
                  <Switch
                    trackColor={{ false: '#d1d5db', true: '#166534' }}
                    thumbColor={inAppNotifications ? '#fff' : '#f4f3f4'}
                    ios_backgroundColor="#d1d5db"
                    onValueChange={setInAppNotifications}
                    value={inAppNotifications}
                  />
                </View>
                <Separator className="bg-muted-foreground/10" />
              </View>

              <View className="flex-col">
                <View className="flex-row items-center justify-between py-2">
                  <View className="flex-row items-center gap-3">
                    <Megaphone size={22} color="#166534" />
                    <Text className="text-base text-foreground">Push Notifications</Text>
                  </View>
                  <Switch
                    trackColor={{ false: '#d1d5db', true: '#166534' }}
                    thumbColor={pushNotifications ? '#fff' : '#f4f3f4'}
                    ios_backgroundColor="#d1d5db"
                    onValueChange={setPushNotifications}
                    value={pushNotifications}
                  />
                </View>
                <Separator className="bg-muted-foreground/10" />
              </View>

              <View className="flex-col">
                <View className="flex-row items-center justify-between py-2">
                  <View className="flex-row items-center gap-3">
                    <Folder size={22} color="#166534" />
                    <Text className="text-base text-foreground">File Access</Text>
                  </View>
                  <Switch
                    trackColor={{ false: '#d1d5db', true: '#166534' }}
                    thumbColor={fileAccess ? '#fff' : '#f4f3f4'}
                    ios_backgroundColor="#d1d5db"
                    onValueChange={setFileAccess}
                    value={fileAccess}
                  />
                </View>
                <Separator className="bg-muted-foreground/10" />
              </View>

              <View className="flex-col">
                <Pressable
                  onPress={handleRestoreSettings}
                  className="flex-row items-center justify-between py-4"
                >
                  <View className="flex-row items-center gap-3">
                    <RotateCcw size={22} color="#166534" />
                    <Text className="text-base text-foreground">Restore Settings</Text>
                  </View>
                </Pressable>
              </View>
            </CardContent>
          </Card>
        </View>
          {/* ================= Confirmation Modal ==================== */}
          <ConfirmationModal
            visible={showModal}
            icon={<RotateCcw size={40} color="#ffff"/>} 
            iconBgColor="bg-primary"
            modalTitle="Restore Settings?"
            modalDescription="Are you sure you want to restore your settings?"
            confirmText="Restore"
            confirmButtonColor="bg-primary"
            onConfirm={console.log}
            onCancel={() => setShowModal(false)}
          />
      </View>
    </SafeAreaView>
  );
}
