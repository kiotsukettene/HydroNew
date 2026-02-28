import { View, ScrollView } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { PageHeader } from '@/components/ui/page-header'
import { Text } from '@/components/ui/text'
import { Badge } from '@/components/ui/badge'
import { useTreatmentStore } from '@/store/treatment/treatmentStore'
import type { TreatmentReportListItem, TreatmentReportStage } from '@/types/treatment'

export default function FiltrationDetails() {
  const { reportId } = useLocalSearchParams<{ reportId: string }>()
  const { reports } = useTreatmentStore()

  const report = reports?.find((r) => String(r.id) === reportId) ?? null

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (!report) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <PageHeader title="Filtration Details" showNotificationButton={false} />
        <View className="p-6">
          <Text className="text-muted-foreground text-center">
            Report not found. It may have been loaded from a different session.
          </Text>
        </View>
      </SafeAreaView>
    )
  }

  const sortedStages = report.stages
    .slice()
    .sort((a, b) => a.stage_order - b.stage_order)
  const completedCount = report.stages.filter((s) => s.status === 'passed').length
  const totalStages = report.stages.length

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View>
        <PageHeader title="Filtration Details" showNotificationButton={false} />
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Report summary */}
        <View className="p-5 border-b border-muted-foreground/20 bg-muted/30">
          <Text className="text-xl font-bold mb-1">Filtration Report</Text>
          <Text className="text-sm text-muted-foreground">
            Completed at: {formatDate(report.end_time)}
          </Text>
          {report.water_liters != null && (
            <Text className="text-sm text-muted-foreground mt-0.5">
              {report.water_liters} L · {report.total_cycles} cycles
            </Text>
          )}
          <Badge
            className={
              report.final_status === 'success'
                ? 'bg-emerald-100 mt-2 self-start'
                : 'bg-muted mt-2 self-start'
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

        <View className="p-4 mt-2">
          <Text className="text-lg font-semibold mb-1">Stages</Text>
          <Text className="text-sm text-muted-foreground mb-4">
            {completedCount}/{totalStages} passed
          </Text>

          {sortedStages.map((stage) => (
            <StageCard key={stage.id} stage={stage} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

function StageCard({ stage }: { stage: TreatmentReportStage }) {
  return (
    <View className="mb-4 p-4 border border-muted-foreground/20 rounded-xl shadow-sm bg-white">
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-lg font-medium">{stage.stage_name}</Text>
        <Badge
          variant="outline"
          className={
            stage.status === 'passed'
              ? 'border-emerald-500 bg-emerald-50'
              : 'border-amber-500 bg-amber-50'
          }
        >
          <Text
            className={
              stage.status === 'passed' ? 'text-emerald-700 text-xs' : 'text-amber-700 text-xs'
            }
          >
            {stage.status}
          </Text>
        </Badge>
      </View>
      {(stage.ph != null || stage.tds != null || stage.turbidity != null) && (
        <Text className="text-sm text-muted-foreground">
          {[stage.ph != null && `pH ${stage.ph}`, stage.tds != null && `TDS ${stage.tds}`, stage.turbidity != null && `Turb ${stage.turbidity}`]
            .filter(Boolean)
            .join(' · ')}
        </Text>
      )}

    </View>
  )
}

function formatStageTime(iso: string) {
  try {
    return new Date(iso).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  } catch {
    return iso
  }
}
