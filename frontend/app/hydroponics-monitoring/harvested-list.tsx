import { PageHeader } from '@/components/ui/page-header';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import React, { useCallback, useState, useRef } from 'react';
import {
  Image,
  Keyboard,
  Modal,
  Pressable,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Filter,
  Search,
  X,
} from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useHarvestedStore } from '@/store/hydroponics/harvestedStore';
import type { HarvestItem } from '@/types/harvested';

const monthName = (isoDate: string) => {
  const d = new Date(isoDate);
  return d.toLocaleString(undefined, { month: 'short' });
};

const formatDate = (isoDate: string) => {
  const d = new Date(isoDate);
  return d.toLocaleDateString(undefined, { month: 'short', day: '2-digit', year: 'numeric' });
};

const formatDateTime = (dateTime: string) => {
  const d = new Date(dateTime);
  return d.toLocaleDateString(undefined, { month: 'short', day: '2-digit', year: 'numeric' });
};

// Convert month abbreviation to YYYY-MM format
// Uses detected year or falls back to current year
const monthAbbrToYYYYMM = (abbr: string, year: number | null): string => {
  const months: Record<string, number> = {
    'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4,
    'May': 5, 'Jun': 6, 'Jul': 7, 'Aug': 8,
    'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12
  };
  const monthNum = months[abbr];
  if (!monthNum) return '';
  
  // Use detected year or current year as fallback
  const useYear = year || new Date().getFullYear();
  const month = monthNum.toString().padStart(2, '0');
  return `${useYear}-${month}`;
};

// Convert YYYY-MM format back to month abbreviation (e.g., "2025-01" -> "Jan")
const yyyyMMToMonthAbbr = (yyyyMM: string): string | null => {
  if (!yyyyMM || !yyyyMM.includes('-')) return null;
  
  const parts = yyyyMM.split('-');
  if (parts.length !== 2) return null;
  
  const monthNum = parseInt(parts[1], 10);
  if (monthNum < 1 || monthNum > 12) return null;
  
  const monthAbbrs = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return monthAbbrs[monthNum - 1] || null;
};

const HarvestedList = () => {
  const [query, setQuery] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [showDetails, setShowDetails] = useState<HarvestItem | null>(null);
  const [localFilterMonth, setLocalFilterMonth] = useState<string | null>(null);
  const [detectedYear, setDetectedYear] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    items,
    statistics,
    total,
    hasMore,
    loading,
    loadingMore,
    error,
    searchQuery,
    filterMonth,
    fetchHarvested,
    loadMore,
    searchHarvested,
    filterByMonth,
  } = useHarvestedStore();

  // Extract year from items when they're loaded (re-detect when items change)
  useFocusEffect(
    useCallback(() => {
      if (items.length > 0) {
        try {
          const firstItemDate = new Date(items[0].harvest_date);
          if (!isNaN(firstItemDate.getTime())) {
            const year = firstItemDate.getFullYear();
            if (detectedYear !== year) {
              setDetectedYear(year);
            }
          }
        } catch (e) {
          if (!detectedYear) {
            setDetectedYear(new Date().getFullYear());
          }
        }
      }
    }, [items, detectedYear])
  );

  // Fetch data on focus
  useFocusEffect(
    useCallback(() => {
      fetchHarvested(true);
    }, [fetchHarvested])
  );

  // Sync local filter month with store when modal opens
  useFocusEffect(
    useCallback(() => {
      if (showFilter) {
        if (filterMonth) {
          setLocalFilterMonth(yyyyMMToMonthAbbr(filterMonth));
        } else {
          setLocalFilterMonth(null);
        }
      }
    }, [showFilter, filterMonth])
  );

  // Handle search with debounce
  useFocusEffect(
    useCallback(() => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      searchTimeoutRef.current = setTimeout(() => {
        if (query.trim() !== searchQuery) {
          searchHarvested(query.trim());
        }
      }, 500);

      return () => {
        if (searchTimeoutRef.current) {
          clearTimeout(searchTimeoutRef.current);
        }
      };
    }, [query, searchQuery, searchHarvested])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchHarvested(true, false);
    setRefreshing(false);
  }, [fetchHarvested]);

  const handleLoadMore = useCallback(() => {
    if (hasMore && !loadingMore && !loading) {
      loadMore();
    }
  }, [hasMore, loadingMore, loading, loadMore]);

  const triggerSearch = () => {
    Keyboard.dismiss();
    searchHarvested(query.trim());
  };

  const clearFilters = () => {
    setLocalFilterMonth(null);
    filterByMonth(null);
  };

  const handleApplyFilter = () => {
    const monthFormat = localFilterMonth ? monthAbbrToYYYYMM(localFilterMonth, detectedYear) : null;
    filterByMonth(monthFormat);
    setShowFilter(false);
  };

  const handleMonthSelect = (month: string) => {
    setLocalFilterMonth(localFilterMonth === month ? null : month);
  };

  const isEmpty = items.length === 0 && !loading;

  return (
    <SafeAreaView className="relative flex-1 bg-background">
      <View className="relative z-10">
        <PageHeader title="Harvested Crops" />
      </View>
      
      <ScrollView
        className="flex-1"
        keyboardShouldPersistTaps="handled"
        stickyHeaderIndices={[1]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2D7D7D']}
            tintColor="#2D7D7D"
          />
        }
      >
        
        {/* Summary */}
        {statistics && (
          <View className="px-5 mt-5">
            {/* ===== Statistics Card ===== */}
            <Card className="bg-lime-50 relative min-h-28 overflow-hidden border border-muted py-4 px-6">
              <View className="relative z-10">
                {/* Badge and Title */}
                <View>
                  <View className="mb-2 self-start rounded-full bg-lime-400/20 px-3 py-1">
                    <Text className="text-xs font-semibold uppercase tracking-wide">
                      Total Harvested
                    </Text>
                  </View>
                  
                  {/* Total Count */}
                  <View className="flex-row items-baseline mt-2">
                    <Text className="text-5xl font-bold">
                      {statistics.total_harvested_setups}
                    </Text>
                  </View>
                </View>

                {/* Additional Statistics */}
                <View className="mt-4 pt-4 border-t border-lime-200/50">
                  <View className="flex-row justify-between">
                    <View className="flex-1">
                      <Text className="text-xs text-muted-foreground mb-1">Sold</Text>
                      <Text className="text-xl font-semibold text-foreground">
                        {statistics.total_sold}
                      </Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-xs text-muted-foreground mb-1">Consumed</Text>
                      <Text className="text-xl font-semibold text-foreground">
                        {statistics.total_consumed}
                      </Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-xs text-muted-foreground mb-1">Disposed</Text>
                      <Text className="text-xl font-semibold text-foreground">
                        {statistics.total_disposed}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </Card>
          </View>
        )}

        <View className="px-4 bg-background">
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
                  editable={!loading}
                />
              </View>
              <TouchableOpacity
                onPress={() => setShowFilter(true)}
                accessibilityRole="button"
                disabled={loading}
                className={`h-12 w-12 items-center justify-center rounded-xl border border-muted-foreground/30 bg-white ${
                  loading ? 'opacity-50' : ''
                }`}>
                <Filter size={20} />
              </TouchableOpacity>
            </View>

            {/* Error Message */}
            {error && (
              <View className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4">
                <Text className="text-center text-red-600">{error}</Text>
              </View>
            )}

            {/* List and Empty State */}
            <View className="mt-2">
              {loading ? (
                <View className="mt-10 items-center py-10">
                  <ActivityIndicator size="large" color="#6BBF59" />
                  <Text className="mt-4 text-center text-muted-foreground">
                    Loading...
                  </Text>
                </View>
              ) : !isEmpty ? (
                <View className="gap-3 pb-10 pt-2">
                  {items.map((item) => (
                    <Pressable onPress={() => setShowDetails(item)} key={item.id}>
                      <Card className='border border-muted-foreground/20 p-2 '>
                        <View className="flex-row items-center gap-2 rounded-2xl bg-white p-4 shadow-sm">
                          <View className="flex-1">
                            <Text className="text-base font-medium text-foreground" numberOfLines={1}>
                              {item.crop_name.charAt(0).toUpperCase() + item.crop_name.slice(1)} 
                            </Text>
                            <View className="mt-1 flex-row items-center gap-2 flex-wrap">
                              <Text className="text-xs text-muted-foreground">
                                Duration: {item.duration_days} days
                              </Text>
                              {item.yield && (
                                <>
                                  <Text className="text-xs text-muted-foreground">•</Text>
                                  <Text className="text-xs text-muted-foreground">
                                    Yield: {item.yield.total_count} crops
                                  </Text>
                                </>
                              )}
                            </View>
                            <View className="mt-1">
                              <Text className="text-xs text-muted-foreground">
                                Harvested: {formatDate(item.harvest_date)}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </Card>
                    </Pressable>
                  ))}

                  {/* Loading More Indicator */}
                  {loadingMore && (
                    <View className="py-4 items-center">
                      <ActivityIndicator size="small" color="#6BBF59" />
                      <Text className="mt-2 text-xs text-muted-foreground">Loading more...</Text>
                    </View>
                  )}
                  
                  {/* Load More Button */}
                  {hasMore && !loadingMore && (
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onPress={handleLoadMore}
                    >
                      <Text>Load More</Text>
                    </Button>
                  )}
                </View>
              ) : (
                <View className="mt-10 items-center">
                  <Text className="mt-4 text-center text-lg">
                    No harvested crops found!
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
                      onPress={() => handleMonthSelect(m)}
                      className={`rounded-full border px-3 py-2 ${localFilterMonth === m ? 'border-[#6BBF59] bg-[#6BBF59]/10' : 'border-muted-foreground/30'}`}>
                      <Text className={localFilterMonth === m ? 'text-[#197A2E]' : 'text-foreground'}>
                        {m}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              <View className="mt-2 flex-col gap-2 justify-between">
                <Button 
                  variant="outline" 
                  className=" w-full" 
                  onPress={clearFilters}
                  disabled={loading}>
                  <Text className="">Reset</Text>
                </Button>
                <Button 
                  className="  w-full" 
                  onPress={handleApplyFilter}
                  disabled={loading}>
                  {loading ? (
                    <View className="flex-row items-center gap-2">
                      <ActivityIndicator size="small" color="#fff" />
                      <Text>Applying...</Text>
                    </View>
                  ) : (
                    <Text>Apply</Text>
                  )}
                </Button>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Details Modal */}
      <Modal
        visible={!!showDetails}
        animationType="slide"
        transparent
        onRequestClose={() => setShowDetails(null)}>
        <View className="flex-1 justify-end bg-foreground/50">
          <View className="rounded-t-3xl bg-white max-h-[90%]">
            <ScrollView showsVerticalScrollIndicator={false} className="px-6 pt-6">
                {/* Header */}
                <View className="mb-6 flex-row items-center justify-between">
                  <Text className="text-xl font-bold text-foreground">Batch Details</Text>
                  <TouchableOpacity
                    onPress={() => setShowDetails(null)}
                    className="h-8 w-8 items-center justify-center rounded-full bg-muted/30">
                    <X size={18} color="#6B7280" />
                  </TouchableOpacity>
                </View>

                {showDetails && (
                  <View className="gap-6 pb-6">
                    {/* Crop Information Card */}
                    <Card className="border border-muted-foreground/20 p-4">
                      <Text className="mb-4 text-base font-semibold text-foreground">Crop Information</Text>
                      
                      <View className="gap-4">
                        <View className="flex-row gap-4">
                        <View className="flex-1">
                          <Text className="mb-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            Crop Name
                          </Text>
                          <Text className="text-lg font-semibold text-foreground">
                            {showDetails.crop_name.charAt(0).toUpperCase() + showDetails.crop_name.slice(1)}
                          </Text>
                        </View>
                        
                        <View className="flex-1">
                            <Text className="mb-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                              Status
                            </Text>
                            <Text className="text-base font-semibold capitalize text-foreground">
                              {showDetails.status}
                            </Text>
                        </View>
                        </View>
                          

                        <View className="flex-row gap-4">
                          <View className="flex-1">
                            <Text className="mb-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                              Number of Crops
                            </Text>
                            <Text className="text-base font-semibold text-foreground">
                              {showDetails.number_of_crops}
                            </Text>
                          </View>
                          
                          <View className="flex-1">
                            <Text className="mb-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                              Bed Size
                            </Text>
                            <Text className="text-base font-semibold capitalize text-foreground">
                              {showDetails.bed_size}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </Card>

                    {/* Timeline Information Card */}
                    <Card className="border border-muted-foreground/20 p-4">
                      <Text className="mb-4 text-base font-semibold text-foreground">Timeline</Text>
                      
                      <View className="gap-4">
                        <View className="flex-row gap-4">
                          <View className="flex-1">
                            <Text className="mb-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                              Setup Date
                            </Text>
                            <Text className="text-base font-semibold text-foreground">
                              {formatDateTime(showDetails.setup_date)}
                            </Text>
                          </View>
                          
                          <View className="flex-1">
                            <Text className="mb-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                              Harvest Date
                            </Text>
                            <Text className="text-base font-semibold text-foreground">
                              {formatDate(showDetails.harvest_date)}
                            </Text>
                          </View>
                        </View>

                        <View>
                          <Text className="mb-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            Growth Duration
                          </Text>
                          <Text className="text-base font-semibold text-foreground">
                            {showDetails.duration_days} days
                          </Text>
                        </View>
                      </View>
                    </Card>

                    {/* Yield Information */}
                    {showDetails.yield && (
                      <Card className="border border-muted-foreground/20 p-4">
                        <Text className="mb-4 text-base font-semibold text-foreground">Yield Summary</Text>
                        
                        <View className="gap-4">
                          <View className="flex-row gap-4">
                            <View className="flex-1">
                              <Text className="mb-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                Total Count
                              </Text>
                              <Text className="text-lg font-bold text-foreground">
                                {showDetails.yield.total_count}
                              </Text>
                            </View>
                            
                            <View className="flex-1">
                              <Text className="mb-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                Total Weight
                              </Text>
                              <Text className="text-lg font-bold text-foreground">
                                {showDetails?.yield?.total_weight != null ? showDetails.yield.total_weight.toFixed(2) : '0.00'} g
                              </Text>
                            </View>
                          </View>

                          {showDetails.yield.notes && (
                            <View className="mt-2 rounded-lg bg-muted/20 p-3">
                              <Text className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                Notes
                              </Text>
                              <Text className="text-sm leading-5 text-foreground">
                                {showDetails.yield.notes}
                              </Text>
                            </View>
                          )}

                          {showDetails.yield.grades && showDetails.yield.grades.length > 0 && (
                            <View className="mt-2">
                              <Text className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                Grade Breakdown
                              </Text>
                              <View className="gap-2.5">
                                {showDetails.yield.grades.map((grade) => (
                                  <View
                                    key={grade.id}
                                    className="flex-row items-center justify-between rounded-lg border border-muted-foreground/20 bg-muted/10 p-3">
                                    <View className="flex-1">
                                      <Text className="mb-1 text-sm font-semibold capitalize text-foreground">
                                        {grade.grade}
                                      </Text>
                                      <View className="flex-row gap-3">
                                        <Text className="text-xs text-muted-foreground">
                                          Count: <Text className="font-semibold text-foreground">{grade.count}</Text>
                                        </Text>
                                        {grade.weight !== null && (
                                          <Text className="text-xs text-muted-foreground">
                                            Weight: <Text className="font-semibold text-foreground">
                                              {grade.weight != null ? grade.weight.toFixed(2) : '0.00'} g
                                            </Text>
                                          </Text>
                                        )}
                                      </View>
                                    </View>
                                  </View>
                                ))}
                              </View>
                            </View>
                          )}
                        </View>
                      </Card>
                    )}
                    
                    {/* Action Button */}
                    <View className="pb-4">
                      <Button className="w-full" onPress={() => setShowDetails(null)}>
                        <Text className="font-semibold">Close</Text>
                      </Button>
                    </View>
                  </View>
                )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default HarvestedList;