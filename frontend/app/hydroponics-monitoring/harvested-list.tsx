import { PageHeader } from '@/components/ui/page-header';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import React, { useMemo, useState } from 'react';
import {
  Image,
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
  MoreVertical,
  X,
  Archive,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Badge } from '@/components/ui/badge';



type HarvestItem = {
  id: string;
  cropName: string;
  cropType: string;
  harvestedAt: string;
  durationDays: number;
};

const MOCK_DATA: HarvestItem[] = [
  {
    id: 'BATCH-1024',
    cropName: 'Lettuce',
    cropType: 'Lettuce',
    harvestedAt: '2025-10-29',
    durationDays: 45,
  },
  {
    id: 'BATCH-1037',
    cropName: 'Lettuce',
    cropType: 'Lettuce',
    harvestedAt: '2025-10-22',
    durationDays: 38,
  },
  {
    id: 'BATCH-1041',
    cropName: 'Lettuce',
    cropType: 'Lettuce',
    harvestedAt: '2025-09-30',
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

const HarvestedList = () => {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [showDetails, setShowDetails] = useState<HarvestItem | null>(null);
  const [selectedItemMenu, setSelectedItemMenu] = useState<string | null>(null);

  const [filterMonth, setFilterMonth] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'date' | 'yield'>('date');

  const data = MOCK_DATA;

  const filtered = useMemo(() => {
    let items = data.slice();
    const q = query.trim().toLowerCase();
    if (q) {
      items = items.filter(
        (it) => it.cropName.toLowerCase().includes(q) || it.id.toLowerCase().includes(q)
      );
    }
    if (filterMonth) {
      items = items.filter((it) => monthName(it.harvestedAt) === filterMonth);
    }
   
    return items;
  }, [data, query, filterMonth,  sortBy]);

  const totalCount = filtered.length;

  const triggerSearch = () => {
    Keyboard.dismiss();
  };

  const clearFilters = () => {
    setFilterMonth(null);
    setSortBy('date');
  };

  const isEmpty = filtered.length === 0;

  return (
    <SafeAreaView className="relative flex-1 bg-background">
      

        <View className="relative z-10">
          <PageHeader title="Harvested Crops" />
        </View>
     <View className='px-2'>
         {/* Summary */}
          {!isEmpty && (
              
               <View>
                 
            

                   {/* ===== Growth Card ===== */}
            <View className="mt-5 px-3">
              <Card className=" bg-lime-50 relative min-h-28 overflow-hidden border border-muted py-4 px-6" >
                {/* <Image
                  source={require('@/assets/images/email-verify-bg.png')}
                  style={{ 
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    width: '100%',
                    height: 90,
                    zIndex: 0
                  }}
                  resizeMode="cover"
                /> */}

                <View className="relative z-10">
                  {/* Badge and Title */}
                  <View>
                    <View className="mb-2 self-start rounded-full bg-lime-400/20 px-3 py-1">
                      <Text className="text-xs font-semibold uppercase tracking-wide ">
                        Total Harvested
                      </Text>
                    </View>
                    
                     {/* Total Count */}
                  <View className="flex-row items-baseline mt-2">
                    <Text className="text-5xl font-bold ">
                      {totalCount}
                    </Text>
                   
                  </View>
                  </View>
                  
                 
                </View>
              </Card>
            </View>

               </View>
              
          )}

      
      <ScrollView
        keyboardShouldPersistTaps="handled"
        stickyHeaderIndices={[0]}
        showsVerticalScrollIndicator={false}>



        {/* <Text className="text-muted-foreground mt-1">Here's your list of freshly harvested lettuce!</Text> */}
        <View className="px-4 relative flex-1">
         
          {/* Search + Filter */}
          <View className="mt-4 flex-row items-center gap-2">
            <View className="flex-1 flex-row items-center rounded-xl border border-muted-foreground/30 px-3 py-2">
              <Search size={18} color="#888" />
              <TextInput
                placeholder="Search harvest batch…"
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
              <Filter size={20}  />
            </TouchableOpacity>
          </View>

          {/* List and Empty State */}
          <View className="mt-2">
            {!isEmpty ? (
              <View className="gap-3 pb-10 pt-2">
                {filtered.map((item) => (
                    <Pressable onPress={() => setShowDetails(item)} key={item.id}>
                  <Card className='border border-muted-foreground/20 p-2 '>
                  
                      <View
                        className="flex-row items-center gap-2 rounded-2xl bg-white p-4 shadow-sm"
                        >
                       

                        <View className="flex-1">
                          <Text className="text-base font-medium text-foreground" numberOfLines={1}>
                            {item.cropName} 
                          </Text>
                          <View className="mt-1 flex-row items-center gap-2">
                            <Text className="text-xs text-muted-foreground">
                              Duration: {item.durationDays} days
                            </Text>
                          </View>
                        </View>

                        {/* Ellipsis Button */}
                        <TouchableOpacity className="p-1">
                          <MoreVertical size={20} color="#6B7280" />
                        </TouchableOpacity>
                      </View>
                   
                  </Card>
                   </Pressable>
                ))}
              </View>
            ) : (
              <View className="mt-10 items-center">
                <View className="h-28 w-28 items-center justify-center rounded-full bg-green-50">
                  <Text className="text-3xl"><X /></Text>
                </View>
                <Text className="mt-4 text-center text-lg">
                  No harvested crops yet!
                </Text>
               
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Filter Bottom Sheet Modal */}
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
                <Text className="mb-1 text-sm text-muted-foreground">Month</Text>
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
                      className={`rounded-full border px-3 py-2 ${filterMonth === m ? 'border-[#6BBF59] bg-[#6BBF59]/10' : 'border-muted-foreground/30'}`}>
                      <Text className={filterMonth === m ? 'text-[#197A2E]' : 'text-foreground'}>
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
              <Text className="text-base font-semibold">Batch Details</Text>
             
            </View>
            {showDetails && (
              <View className="gap-4 py-4">
                {/* Crop Info Section */}
                <View className="gap-3">
                  <View>
                    <Text className="text-sm font-medium text-muted-foreground mb-1">Crop Name</Text>
                    <Text className="text-base font-semibold text-foreground">{showDetails.cropName}</Text>
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
                </View>
                
                {/* Nutrient Summary Section */}
                <View className="border-t border-muted pt-4">
                  <View className="flex-row flex-wrap gap-2">
                    <Badge className="bg-blue-50 ">
                      <Text className="text-blue-700 text-sm font-medium">pH 6.5</Text>
                    </Badge>
                    
                  </View>
                </View>
                
                {/* Action Button Section */}
                <View className="border-t border-muted pt-4">
                  <Button variant={'ghost'} className="w-full" onPress={() => setShowDetails(null)}>
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
};

export default HarvestedList;
