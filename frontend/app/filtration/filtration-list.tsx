import { ScrollView, View, Pressable, ActivityIndicator, TextInput, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { PageHeader } from '@/components/ui/page-header'
import { Text } from '@/components/ui/text'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect } from '@react-navigation/native'
import { CheckCircle2, Search, Filter } from 'lucide-react-native'
import { router } from 'expo-router'

interface FiltrationRecord {
  id: string;
  date: string;
  completedAt: string;
  stages: Array<{
    id: number;
    title: string;
    name: string;
    description: string;
    status: string;
    statusText: string;
  }>;
}



export default function FiltrationList() {
  const [filtrations, setFiltrations] = useState<FiltrationRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFiltrations = async () => {
    try {
      setLoading(true);
      const data = await AsyncStorage.getItem('filtration_list');
      if (data) {
        const parsedData = JSON.parse(data);
        setFiltrations(parsedData);
      } else {
        setFiltrations([]);
      }
    } catch (error) {
      console.error('Error loading filtrations:', error);
      setFiltrations([]);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadFiltrations();
    }, [])
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const totalSuccessful = filtrations.length;
  const completedStagesCount = filtrations.reduce((total, filtration) => {
    return total + filtration.stages.filter(stage => stage.status === 'completed').length;
  }, 0);

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* ===== Page Header ===== */}
      <View className="relative z-10">
        <PageHeader title="Filtration List" />
      </View>

      {/* ===== Main Content ===== */}
      <View className="flex-1 relative">
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <View className="px-5 pt-6">
            {/* ===== Total Success Card ===== */}
            <Card className="mb-6 border-0 bg-[#dfecb9] p-6 " >
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-sm text-[#5a6c3d] mb-2 font-medium">Total Successful Filtration</Text>
                  <Text className="text-4xl font-bold text-[#3d4a2a] mb-1">{totalSuccessful}</Text>
                  <Text className="text-xs text-[#6b7d4f] mt-1 font-medium">
                    {completedStagesCount} stages completed
                  </Text>
                </View>
                <View className="h-20 w-20 rounded-full bg-white/60 items-center justify-center" style={{ shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 }}>
                  <CheckCircle2 size={36} color="#5a6c3d" />
                </View>
              </View>
            </Card>

            {/* Search + Filter */}
            <View className="mt-1 mb-3 flex-row items-center gap-2">
              <View className="flex-1 flex-row items-center rounded-xl border border-muted-foreground/30 px-3 py-2">
                <Search size={18} color="#888" />
                <TextInput
                  placeholder="Search here…"
                  placeholderTextColor="#9CA3AF"
                  className="ml-2 flex-1 text-base "
                  returnKeyType="search"
                />
              </View>
              <TouchableOpacity
                accessibilityRole="button"
                className="h-12 w-12 items-center justify-center rounded-xl border border-muted-foreground/30 bg-white">
                <Filter size={20} />
              </TouchableOpacity>
            </View>

            {/* ===== Filtration List ===== */}
            {loading ? (
              <View className="mt-10 items-center py-10">
                <ActivityIndicator size="large" color="#D2E0AA" />
                <Text className="mt-4 text-center text-[#6b7d4f] font-medium">
                  Loading...
                </Text>
              </View>
            ) : filtrations.length === 0 ? (
              <Card className="p-10 items-center rounded-3xl bg-[#F9F2EF] border-0 shadow-md">
                <Text className="text-lg font-semibold text-[#8b6f5f] mb-2">
                  No Filtration Records
                </Text>
                <Text className="text-sm text-[#a68a7a] text-center">
                  Complete a filtration process to see it here
                </Text>
              </Card>
            ) : (
              <View className="gap-4">
                {filtrations.map((filtration, index) => {
                  const completedCount = filtration.stages.filter(
                    stage => stage.status === 'completed'
                  ).length;
                  const totalStages = filtration.stages.length;
                  const filtrationNumber = filtrations.length - index;

                  return (
                    <Pressable
                      key={filtration.id}
                      onPress={() => router.push('/filtration/filtration-details')}
                    >
                      <Card className=" bg-white p-5 rounded-3xl border-muted-foreground/30" >
                        <View className="flex-row items-center justify-between mb-1">
                          <View className="flex-1">
                            <Text className="text-lg font-bold  mb-1">
                              #{filtrationNumber} - Filtration
                            </Text>
                            <Text className="text-xs text-muted-foreground mt-1 font-medium">
                              {formatDate(filtration.completedAt)}
                            </Text>
                          </View>
                          <Badge className="bg-muted px-3 py-1 rounded-full">
                            <Text className="text-primary text-xs font-semibold">Completed</Text>
                          </Badge>
                        </View>

                        {/* Stages Summary */}
                        <View className="mt-1 pt-2 border-t border-[#E2E8F0]">
                          <Text className="text-xs text-muted-foreground mb-1 font-medium">
                            Stages: {completedCount}/{totalStages} completed
                          </Text>
                        
                        </View>
                      </Card>
                    </Pressable>
                  );
                })}
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}
