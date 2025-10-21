import { View, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PageHeader } from '@/components/ui/page-header';
import { Dimensions } from 'react-native';
import FolderBg from '@/components/ui/folder-bg';

import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Droplet } from 'lucide-react-native';

const { height: screenHeight } = Dimensions.get('window');

export default function Hydroponics() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1">
        {/* =========== Page Header =========== */}
          <PageHeader title="Hydroponics Monitoring" />

      </View>
      
    </SafeAreaView>
  );
}
