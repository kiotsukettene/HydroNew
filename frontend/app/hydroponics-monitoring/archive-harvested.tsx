import { PageHeader } from '@/components/ui/page-header';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import React, { useMemo, useState } from 'react';
import {
  Keyboard,
  Modal,
  Pressable,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Filter,
  Search,
  X,
  Archive,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';

type ArchiveItem = {
  id: string;
  cropType: string;
  harvestedAt: string;
  archivedAt: string;
  durationDays: number;
};

const MOCK_ARCHIVED_DATA: ArchiveItem[] = [
  {
    id: 'BATCH-1001',
    cropType: 'Olmetie',
    harvestedAt: '2025-08-15',
    archivedAt: '2025-09-01',
    durationDays: 40,
  },
  {
    id: 'BATCH-1002',
    cropType: 'Green rapid',
    harvestedAt: '2025-07-20',
    archivedAt: '2025-08-15',
    durationDays: 35,
  },
  {
    id: 'BATCH-1003',
    cropType: 'Romaine',
    harvestedAt: '2025-06-10',
    archivedAt: '2025-07-05',
    durationDays: 42,
  },
];


const monthName = (isoDate: string) => {
  const d = new Date(isoDate);
  return d.toLocaleString(undefined, { month: 'short' });
};

const formatDate = (isoDate: string) => {
  const d = new Date(isoDate);
  return d.toLocaleDateString(undefined, { month: 'short', day: '2-digit', year: 'numeric' });
};

export default function ArchiveList() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [showDetails, setShowDetails] = useState<ArchiveItem | null>(null);
  const [filterMonth, setFilterMonth] = useState<string | null>(null);

  const data = MOCK_ARCHIVED_DATA;

  const filtered = useMemo(() => {
    let items = data.slice();
    const q = query.trim().toLowerCase();
    if (q) {
      items = items.filter(
        (it) => it.cropType.toLowerCase().includes(q) || it.id.toLowerCase().includes(q)
      );
    }
    if (filterMonth) {
      items = items.filter((it) => monthName(it.archivedAt) === filterMonth);
    }
   
    return items;
  }, [data, query, filterMonth]);

  const totalCount = filtered.length;

  const triggerSearch = () => {
    Keyboard.dismiss();
  };

  const clearFilters = () => {
    setFilterMonth(null);
  };

  const isEmpty = filtered.length === 0;

  return (
    <SafeAreaView className="relative flex-1 bg-background">
      <View className="relative z-10">
        <PageHeader title="Archived Harvests List" />
      </View>
      
      <View className='px-2'>
       
        <ScrollView
          keyboardShouldPersistTaps="handled"
          stickyHeaderIndices={[0]}
          showsVerticalScrollIndicator={false}>
          
          <View className="px-4 relative flex-1">
            {/* Search + Filter */}
            <View className="mt-4 flex-row items-center gap-2">
              <View className="flex-1 flex-row items-center rounded-xl border border-muted-foreground/30 px-3 py-2">
                <Search size={18} color="#888" />
                <TextInput
                  placeholder="Search archived batch…"
                  placeholderTextColor="#9CA3AF"
                  className="ml-2 flex-1 text-base"
                  value={query}
                  onChangeText={setQuery}
                  returnKeyType="search"
                  onSubmitEditing={triggerSearch}
                />
              </View>
              <TouchableOpacity
                onPress={() => setShowFilter(true)}
                accessibilityRole="button"
                className="h-12 w-12 items-center justify-center rounded-xl border border-muted-foreground/30 bg-white">
                <Filter size={20} />
              </TouchableOpacity>
            </View>

            {/* List and Empty State */}
            <View className="mt-2">
              {!isEmpty ? (
                <View className="gap-3 pb-10 pt-2">
                  {filtered.map((item) => (
                    <Pressable onPress={() => setShowDetails(item)} key={item.id}>
                      <Card className='border border-muted-foreground/20 p-2'>
                        <View className="flex-row items-center gap-2 rounded-2xl bg-white p-4 shadow-sm">
                          <View className="flex-1">
                            <View className="flex-row items-center gap-2">
                              <Text className="text-base font-medium text-foreground" numberOfLines={1}>
                                {item.cropType}
                              </Text>
                            </View>
                            <View className="mt-1 flex-row items-center gap-2">
                             
                              <Text className="text-xs text-muted-foreground">
                                Archived: {formatDate(item.archivedAt)}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </Card>
                    </Pressable>
                  ))}
                </View>
              ) : (
                <View className="mt-10 items-center">
                  <View className="h-28 w-28 items-center justify-center rounded-full bg-amber-50">
                    <Archive size={48} color="#F59E0B" />
                  </View>
                  <Text className="mt-4 text-center text-lg">
                    No archived harvests yet!
                  </Text>
                  <Text className="mt-2 text-center text-sm text-muted-foreground">
                    Archived harvests will appear here
                  </Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>

        {/* Filter Bottom Sheet  */}
        <Modal
          visible={showFilter}
          animationType="slide"
          transparent
          onRequestClose={() => setShowFilter(false)}>
          <View className="flex-1 justify-end bg-black/30">
            <View className="rounded-t-3xl bg-white p-6">
              <View className="mb-2 flex-row items-center justify-between">
                <Text className="text-base font-semibold"> Filters </Text>
                <TouchableOpacity onPress={() => setShowFilter(false)} className="p-1">
                  <X size={18} color="#6B7280" />
                </TouchableOpacity>
              </View>

              <View className="gap-3">
                {/* Month */}
                <View>
                  <Text className="mb-1 text-sm text-muted-foreground">Archive Month</Text>
                  <View className="flex-row flex-wrap gap-2">
                    {[
                      'Jan',
                      'Feb',
                      'Mar',
                      'Apr',
                      'May',
                      'Jun',
                      'Jul',
                      'Aug',
                      'Sep',
                      'Oct',
                      'Nov',
                      'Dec',
                    ].map((m) => (
                      <Pressable
                        key={m}
                        onPress={() => setFilterMonth(filterMonth === m ? null : m)}
                        className={`rounded-full border px-3 py-2 ${filterMonth === m ? 'border-[#F59E0B] bg-[#F59E0B]/10' : 'border-muted-foreground/30'}`}>
                        <Text className={filterMonth === m ? 'text-[#D97706]' : 'text-foreground'}>
                          {m}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>

                <View className="mt-2 flex-col gap-2 justify-between">
                  <Button variant="outline" className=" w-full" onPress={clearFilters}>
                    <Text className="">Reset</Text>
                  </Button>
                  <Button className="  w-full" onPress={() => setShowFilter(false)}>
                    <Text>Apply</Text>
                  </Button>
                </View>
              </View>
            </View>
          </View>
        </Modal>

        {/* Details Modal */}
        <Modal
          visible={!!showDetails}
          animationType="fade"
          transparent
          onRequestClose={() => setShowDetails(null)}>
          <View className="flex-1 justify-end bg-foreground/50">
            <View className="rounded-t-3xl bg-white p-8">
              <View className="mb-2 flex-row items-center justify-between">
                <Text className="text-lg font-semibold">Archived Batch Details</Text>
              </View>
              {showDetails && (
                <View className="gap-4 py-4">
                  {/* Crop Info Section */}
                  <View className="gap-3">
                    <View>
                      <Text className="text-sm font-medium text-muted-foreground mb-1">Crop Name</Text>
                      <Text className="text-base font-semibold text-foreground">{showDetails.cropType}</Text>
                    </View>
                    
                    <View className="flex-row gap-4">
                      <View className="flex-1">
                        <Text className="text-sm font-medium text-muted-foreground mb-1">Harvested Date</Text>
                        <Text className="text-base font-medium text-foreground">{formatDate(showDetails.harvestedAt)}</Text>
                      </View>
                      
                      <View className="flex-1">
                        <Text className="text-sm font-medium text-muted-foreground mb-1">Duration</Text>
                        <Text className="text-base font-medium text-foreground">{showDetails.durationDays} days</Text>
                      </View>
                    </View>

                    <View>
                      <Text className="text-sm font-medium text-muted-foreground mb-1">Archived Date</Text>
                      <Text className="text-base font-medium text-foreground">{formatDate(showDetails.archivedAt)}</Text>
                    </View>
                  </View>
                  
                  {/* Action Button Section */}
                  <View className="border-t border-muted pt-4">
                    <Button className="w-full" onPress={() => setShowDetails(null)}>
                      <Text className="font-medium">Done</Text>
                    </Button>
                  </View>
                </View>
              )}
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}