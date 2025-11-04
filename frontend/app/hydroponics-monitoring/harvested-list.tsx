import { PageHeader } from '@/components/ui/page-header'
import { Text } from '@/components/ui/text'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import React, { useMemo, useState } from 'react'
import { Keyboard, Modal, Pressable, ScrollView, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Filter, Search, ChevronRight, X } from 'lucide-react-native'
import { useRouter } from 'expo-router'
import Animated, { FadeInUp } from 'react-native-reanimated'

type HarvestStatus = 'Successful' | 'Replanted'

type HarvestItem = {
  id: string
  cropName: string
  cropType: string
  harvestedAt: string
  yieldKg: number
  durationDays: number
  status: HarvestStatus
  image?: any
}

const MOCK_DATA: HarvestItem[] = [
  {
    id: 'BATCH-1024',
    cropName: 'Lettuce',
    cropType: 'Lettuce',
    harvestedAt: '2025-10-29',
    yieldKg: 1.2,
    durationDays: 45,
    status: 'Successful',
    image: undefined,
  },
  {
    id: 'BATCH-1037',
    cropName: 'Lettuce',
    cropType: 'Lettuce',
    harvestedAt: '2025-10-22',
    yieldKg: 0.6,
    durationDays: 38,
    status: 'Successful',
    image: undefined,
  },
  {
    id: 'BATCH-1041',
    cropName: 'Lettuce',
    cropType: 'Lettuce',
    harvestedAt: '2025-09-30',
    yieldKg: 0.9,
    durationDays: 42,
    status: 'Replanted',
    image: undefined,
  },
]

const monthName = (isoDate: string) => {
  const d = new Date(isoDate)
  return d.toLocaleString(undefined, { month: 'short' })
}

const formatDate = (isoDate: string) => {
  const d = new Date(isoDate)
  return d.toLocaleDateString(undefined, { month: 'short', day: '2-digit', year: 'numeric' })
}

const HarvestedList = () => {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [showFilter, setShowFilter] = useState(false)
  const [showDetails, setShowDetails] = useState<HarvestItem | null>(null)

  const [filterMonth, setFilterMonth] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<HarvestStatus | 'All'>('All')
  const [sortBy, setSortBy] = useState<'date' | 'yield'>('date')

  const data = MOCK_DATA

  const filtered = useMemo(() => {
    let items = data.slice()
    const q = query.trim().toLowerCase()
    if (q) {
      items = items.filter(
        (it) => it.cropName.toLowerCase().includes(q) || it.id.toLowerCase().includes(q)
      )
    }
    if (filterMonth) {
      items = items.filter((it) => monthName(it.harvestedAt) === filterMonth)
    }
    if (filterStatus !== 'All') {
      items = items.filter((it) => it.status === filterStatus)
    }
    if (sortBy === 'date') {
      items.sort((a, b) => +new Date(b.harvestedAt) - +new Date(a.harvestedAt))
    } else {
      items.sort((a, b) => b.yieldKg - a.yieldKg)
    }
    return items
  }, [data, query, filterMonth, filterStatus, sortBy])

  const totalCount = filtered.length

  const triggerSearch = () => {
    Keyboard.dismiss()
  }

  const clearFilters = () => {
    setFilterMonth(null)
    setFilterStatus('All')
    setSortBy('date')
  }

  const isEmpty = filtered.length === 0

  return (
    <SafeAreaView className="relative flex-1 ">
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="pb-40"
        stickyHeaderIndices={[0]}
        showsVerticalScrollIndicator={false}
      >
        {/* Sticky Header */}
        <View className="px-4 pt-2 pb-3 ">
          <View className="relative z-10">
            <PageHeader title="Harvested Crops" />
          </View>
          <Text className="text-muted-foreground mt-1">Here’s your list of freshly harvested lettuce!</Text>
        </View>
        <View className="px-4">

          {/* Search + Filter */}
          <View className="flex-row items-center gap-2 mt-4">
            <View className="flex-1 flex-row items-center border border-muted-foreground/30 rounded-xl px-3 py-2">
              <Search size={18} color="#888" />
              <TextInput
                placeholder="Search harvest batch…"
                placeholderTextColor="#9CA3AF"
                className="flex-1 ml-2 text-base"
                value={query}
                onChangeText={setQuery}
                returnKeyType="search"
                onSubmitEditing={triggerSearch}
              />
            </View>
            <TouchableOpacity onPress={() => setShowFilter(true)} accessibilityRole="button" className="h-12 w-12 rounded-xl items-center justify-center border border-muted-foreground/30 bg-white">
              <Filter size={20} color="#6BBF59" />
            </TouchableOpacity>
          </View>

          {/* List or Empty State */}
          <View className="mt-4">
            {!isEmpty ? (
              <View className="gap-3">
                {filtered.map((item) => (
                  <Animated.View key={item.id} entering={FadeInUp.duration(300).springify()}>
                    <Card className="px-4 bg-white rounded-2xl border border-[#6BBF59]/15 shadow-sm">
                      <View className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl bg-[#6BBF59]" />
                      <CardHeader className="gap-2 pb-0">
                        <Text className="text-xs text-muted-foreground">Batch ID: {item.id}</Text>
                        <CardTitle className="text-base"> Lettuce</CardTitle>
                        <Text className="text-xs text-muted-foreground">Harvested: {formatDate(item.harvestedAt)}</Text>
                      </CardHeader>
                      <CardContent className="mt-3 pt-0">
                        <View className="flex-row items-center justify-between">
                          <View>
                            <Text className="text-xs text-muted-foreground">{item.durationDays} days of growth</Text>
                          </View>
                          <View className="px-3 py-1 rounded-full bg-[#EAF6E7] border border-[#6BBF59]/30">
                            <Text className="text-[#197A2E] text-xs"> Successfully Harvested</Text>
                          </View>
                        </View>
                        <View className="flex-row justify-end mt-2">
                          <Pressable onPress={() => setShowDetails(item)} className="flex-row items-center gap-1">
                            <Text className="text-[#57A0D3]">View Details</Text>
                            <ChevronRight size={16} color="#57A0D3" />
                          </Pressable>
                        </View>
                      </CardContent>
                    </Card>
                  </Animated.View>
                ))}
              </View>
            ) : (
              <View className="items-center mt-10">
                <View className="h-28 w-28 rounded-full bg-green-50 items-center justify-center">
                  <Text className="text-3xl">🪴</Text>
                </View>
                <Text className="text-lg mt-4 text-center">No harvested crops yet 🌱{"\n"}Keep growing — your next harvest will appear here!</Text>
                <Button className="mt-6 px-5" onPress={() => router.push('/(tabs)/home')}>
                  <Text>Go to Dashboard</Text>
                </Button>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Filter Bottom Sheet Modal */}
      <Modal visible={showFilter} animationType="slide" transparent onRequestClose={() => setShowFilter(false)}>
        <View className="flex-1 justify-end bg-black/30">
          <View className="bg-white rounded-t-3xl p-4">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-base font-semibold">Filters</Text>
              <TouchableOpacity onPress={() => setShowFilter(false)} className="p-1">
                <X size={18} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <View className="gap-3">
              {/* Month */}
              <View>
                <Text className="text-sm text-muted-foreground mb-1">Month</Text>
                <View className="flex-row flex-wrap gap-2">
                  {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map((m) => (
                    <Pressable
                      key={m}
                      onPress={() => setFilterMonth(filterMonth === m ? null : m)}
                      className={`px-3 py-2 rounded-full border ${filterMonth === m ? 'border-[#6BBF59] bg-[#6BBF59]/10' : 'border-muted-foreground/30'}`}
                    >
                      <Text className={filterMonth === m ? 'text-[#197A2E]' : 'text-foreground'}>{m}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Status */}
              <View>
                <Text className="text-sm text-muted-foreground mb-1">Status</Text>
                <View className="flex-row gap-2">
                  {(['All','Successful','Replanted'] as const).map((s) => (
                    <Pressable
                      key={s}
                      onPress={() => setFilterStatus(s as any)}
                      className={`px-3 py-2 rounded-full border ${filterStatus === s ? 'border-[#6BBF59] bg-[#6BBF59]/10' : 'border-muted-foreground/30'}`}
                    >
                      <Text className={filterStatus === s ? 'text-[#197A2E]' : 'text-foreground'}>{s}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Sort By */}
              <View>
                <Text className="text-sm text-muted-foreground mb-1">Sort by</Text>
                <View className="flex-row gap-2">
                  <Pressable
                    onPress={() => setSortBy('date')}
                    className={`px-3 py-2 rounded-full border ${sortBy === 'date' ? 'border-[#6BBF59] bg-[#6BBF59]/10' : 'border-muted-foreground/30'}`}
                  >
                    <Text className={sortBy === 'date' ? 'text-[#197A2E]' : 'text-foreground'}>Date Harvested</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setSortBy('yield')}
                    className={`px-3 py-2 rounded-full border ${sortBy === 'yield' ? 'border-[#6BBF59] bg-[#6BBF59]/10' : 'border-muted-foreground/30'}`}
                  >
                    <Text className={sortBy === 'yield' ? 'text-[#197A2E]' : 'text-foreground'}>Yield (High → Low)</Text>
                  </Pressable>
                </View>
              </View>

              <View className="flex-row justify-between mt-2">
                <Button variant="outline" className="px-5 border-[#6BBF59]" onPress={clearFilters}>
                  <Text className="text-[#197A2E]">Reset</Text>
                </Button>
                <Button className="px-6 bg-[#6BBF59]" onPress={() => setShowFilter(false)}>
                  <Text>Apply</Text>
                </Button>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Details Modal */}
      <Modal visible={!!showDetails} animationType="fade" transparent onRequestClose={() => setShowDetails(null)}>
        <View className="flex-1 bg-foreground/50 justify-end">
          <View className="bg-white rounded-t-3xl p-4">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-base font-semibold">Batch Details</Text>
              <TouchableOpacity onPress={() => setShowDetails(null)} className="p-1">
                <X size={18} color="#6B7280" />
              </TouchableOpacity>
            </View>
            {showDetails && (
              <View className="gap-3">
                <Text>Batch ID: {showDetails.id}</Text>
                <Text>Nutrient log summary: avg pH 6.0, EC 1.2, water 3.1L</Text>
                <Text>Growth notes: Healthy growth, adequate lighting, minor leaf curl.</Text>
                <View className="items-end mt-2">
                  <Button className="bg-[#6BBF59]" onPress={() => setShowDetails(null)}>
                    <Text>Done</Text>
                  </Button>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* Sticky Bottom Summary */}
      {!isEmpty && (
        <View className="absolute left-4 right-4 bottom-4">
          <View className="rounded-2xl p-4 shadow-sm" style={{ backgroundColor: '#6BBF59' }}>
            <Text className="text-white text-base mb-1">Summary</Text>
            <View className="bg-white/15 rounded-xl p-3">
              <Text className="text-white">Total Harvests: {totalCount}</Text>
              <Text className="text-white">Average Yield: 1.4 kg</Text>
              <Text className="text-white">Best Crop: Lettuce</Text>
              <Text className="text-white">Avg Growth: 42 days</Text>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  )
}

export default HarvestedList
