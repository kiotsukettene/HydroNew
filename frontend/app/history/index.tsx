import { View, TextInput, ScrollView, TouchableOpacity, Keyboard } from "react-native"
import { Search, ClipboardCheck } from "lucide-react-native"
import React, { useState, useMemo } from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import { PageHeader } from "@/components/ui/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Text } from "@/components/ui/text"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const historyData = [
  {
    date: "Today – Sept 4, 2025",
    activities: ["Water successfully filtered and ready for hydroponics.", "Lettuce growth progress updated to 82%."],
  },
  {
    date: "Sept 3, 2025",
    activities: ["Filtration failed – High turbidity detected.", "Lettuce growth progress updated to 82%."],
  },
  {
    date: "Sept 2, 2025",
    activities: ["Water pump activated for 5 minutes."],
  },
  {
    date: "Sept 2, 2025",
    activities: ["Filtration started."],
  },
  {
    date: "Sept 2, 2025",
    activities: ["Lettuce reached 9 days old."],
  },
]

export default function Index() {
  const [query, setQuery] = useState("")

  const filteredHistory = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return historyData

    return historyData
      .map((item) => {
        const activities = item.activities.filter((a) => a.toLowerCase().includes(q))
        return {
          ...item,
          activities,
        }
      })
      .filter((item) => item.date.toLowerCase().includes(q) || item.activities.length > 0)
  }, [query])

  const triggerSearch = () => {
    Keyboard.dismiss()
  }

  return (
    <ScrollView>
      <SafeAreaView className="p-4">
        <View>
          {/* ===== Page Header ===== */}
          <PageHeader title="History" />

          {/* ===== Search Bar ===== */}
          <View className="mt-4">
            <View className="bg-gray-200 rounded-full px-4 py-3 flex-row items-center">
              <TextInput
                placeholder="Search Here"
                placeholderTextColor="#9CA3AF"
                className="flex-1 text-base"
                value={query}
                onChangeText={setQuery}
                returnKeyType="search"
                onSubmitEditing={triggerSearch}
              />
              <TouchableOpacity onPress={triggerSearch} accessibilityRole="button" accessibilityLabel="Search">
                <Search size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>

          {/* ===== Filter Section ===== */}
          <View className="mt-3 flex-row items-center justify-between">
            <Badge className="bg-primary px-4 py-1.5">
              <Text className="text-white text-sm font-medium">All</Text>
            </Badge>
          </View>

          {/* ===== History List ===== */}
          <View className="mt-4">
            {filteredHistory.map((item, index) => (
              <Card key={index} className="mb-3 rounded-2xl border border-gray-300 shadow-sm">
                <CardContent className="px-3 pt-1 pb-3">
                  <View className="flex-row items-center justify-between mb-2">
                    <Text className="text-sm font-semibold text-gray-900">{item.date}</Text>
                    <TouchableOpacity>
                      <ClipboardCheck size={18} color="#6B7280" />
                    </TouchableOpacity>
                  </View>
                  <View className="gap-2">
                    {item.activities.map((activity, actIndex) => (
                      <View key={actIndex} className="flex-row gap-2">
                        <Text className="text-gray-600 text-sm">•</Text>
                        <Text className="text-gray-600 text-sm flex-1">{activity}</Text>
                      </View>
                    ))}
                  </View>
                </CardContent>
              </Card>
            ))}
            {filteredHistory.length === 0 && (
              <View className="items-center justify-center py-8">
                <Text className="text-gray-500">No history found</Text>
              </View>
            )}
          </View>
          
          {/* Bottom Spacing */}
          <View className="h-20" />
        </View>
      </SafeAreaView>
    </ScrollView>
  )
}
