import { ScrollView, View, Pressable, ActivityIndicator, TextInput, TouchableOpacity } from 'react-native'
import React, { useState, useMemo } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { PageHeader } from '@/components/ui/page-header'
import { Text } from '@/components/ui/text'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useFocusEffect } from '@react-navigation/native'
import { CheckCircle2, Search, Filter } from 'lucide-react-native'
import { router } from 'expo-router'
import { useTreatmentStore } from '@/store/treatment/treatmentStore'
import type { TreatmentReportListItem } from '@/types/treatment'

export default function FiltrationList() {
  const { reports, loading, fetchTreatmentReports } = useTreatmentStore();
  const [searchQuery, setSearchQuery] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      fetchTreatmentReports();
    }, [fetchTreatmentReports])
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

  const totalSuccessful = reports?.filter((r) => r.final_status === 'success').length ?? 0;
  const completedStagesCount =
    reports?.reduce((total, report) => {
      return total + report.stages.filter((s) => s.status === 'passed').length;
    }, 0) ?? 0;

  const filteredReports = useMemo(() => {
    if (!reports?.length) return [];
    const q = searchQuery.trim().toLowerCase();
    if (!q) return reports;
    return reports.filter((report) => {
      const dateStr = formatDate(report.start_time) + formatDate(report.end_time ?? '');
      const status = (report.final_status ?? '').toLowerCase();
      const waterCycles = `${report.water_liters ?? ''} ${report.total_cycles ?? ''}`;
      const stageNames = report.stages?.map((s) => s.stage_name ?? '').join(' ').toLowerCase() ?? '';
      const searchable = `${dateStr} ${status} ${waterCycles} ${stageNames}`.toLowerCase();
      return searchable.includes(q);
    });
  }, [reports, searchQuery]);

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
                  placeholder="Search by date, status, cycles, stages…"
                  placeholderTextColor="#9CA3AF"
                  className="ml-2 flex-1 text-base "
                  returnKeyType="search"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
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
            ) : !reports?.length ? (
              <Card className="p-10 items-center rounded-3xl bg-[#F9F2EF] border-0 shadow-md">
                <Text className="text-lg font-semibold text-[#8b6f5f] mb-2">
                  No Filtration Records
                </Text>
                <Text className="text-sm text-[#a68a7a] text-center">
                  Complete a filtration process to see it here
                </Text>
              </Card>
            ) : !filteredReports.length ? (
              <Card className="p-10 items-center rounded-3xl bg-[#F9F2EF] border-0 shadow-md">
                <Text className="text-lg font-semibold text-[#8b6f5f] mb-2">
                  No matching results
                </Text>
                <Text className="text-sm text-[#a68a7a] text-center">
                  Try a different search (date, status, cycles, or stage name)
                </Text>
              </Card>
            ) : (
              <View className="gap-4">
                {(filteredReports as TreatmentReportListItem[]).map((report, index) => {
                  const filtrationNumber = filteredReports.length - index;
                  const endTime = report.end_time;

                  return (
                    <Pressable
                      key={report.id}
                      onPress={() =>
                        router.push({
                          pathname: '/filtration/filtration-details',
                          params: { reportId: String(report.id) },
                        })
                      }
                    >
                      <Card className="bg-white p-5 rounded-3xl border-muted-foreground/30">
                        <View className="flex-row items-center justify-between mb-1">
                          <View className="flex-1">
                            <Text className="text-lg font-bold mb-1">
                              #{filtrationNumber} - Filtration
                            </Text>
                            <Text className="text-xs text-muted-foreground mt-1 font-medium">
                              Completed at: {formatDate(endTime)}
                            </Text>
                            {report.water_liters != null && (
                              <Text className="text-xs text-muted-foreground mt-0.5 font-medium">
                                {report.water_liters} L · {report.total_cycles} cycles
                              </Text>
                            )}
                          </View>
                          <Badge
                            className={
                              report.final_status === 'success'
                                ? 'bg-emerald-100 px-3 py-1 rounded-full'
                                : 'bg-muted px-3 py-1 rounded-full'
                            }
                          >
                            <Text
                              className={
                                report.final_status === 'success'
                                  ? 'text-emerald-700 text-xs font-semibold'
                                  : 'text-primary text-xs font-semibold'
                              }
                            >
                              {report.final_status === 'success' ? 'Completed' : report.final_status}
                            </Text>
                          </Badge>
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
