import { View, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native'
import React, { useState, useEffect, useCallback } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useFocusEffect } from '@react-navigation/native'
import { PageHeader } from '@/components/ui/page-header'
import { Text } from '@/components/ui/text'
import { BellOff } from 'lucide-react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import NotificationItem from './notification-item'
import { useNotificationStore } from '@/store/notification/notificationStore'
import { groupNotificationsByDate } from '@/lib/notificationHelpers'


const STORAGE_KEY = '@notifications_data'

export default function Notifications() {
  const { 
    notifications, 
    fetchNotifications, 
    fetchMoreNotifications,
    loading, 
    loadingMore,
    hasMore,
    markAsRead, 
    markAllAsRead, 
    unreadCount 
  } = useNotificationStore();
  const [refreshing, setRefreshing] = useState(false);
  

  // Fetch notifications when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchNotifications();
    }, [fetchNotifications])
  );

  // Save notifications to storage whenever they change
  useEffect(() => {
    saveNotifications()
  }, [notifications])

  const saveNotifications = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(notifications))
    } catch (error) {
      console.error('Error saving notifications:', error)
    }
  }

  const handleNotificationPress = async (id: number) => {
    await markAsRead(id);
  }

  const handleClearAll = async () => {
    await markAllAsRead();
  }

  // Pull to refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchNotifications(true); // true = refresh from start
    setRefreshing(false);
  }, [fetchNotifications]);

  // Load more on scroll
  const handleLoadMore = useCallback(() => {
    if (hasMore && !loadingMore && !loading) {
      fetchMoreNotifications();
    }
  }, [hasMore, loadingMore, loading, fetchMoreNotifications]);

  // Group notifications by date
  const groupedNotifications = groupNotificationsByDate(notifications);
  
  // Convert grouped notifications to flat list data
  const flatListData = Object.entries(groupedNotifications).flatMap(([dateLabel, notifs]) => [
    { type: 'header', dateLabel, key: `header-${dateLabel}` },
    ...notifs.map(n => ({ type: 'notification', notification: n, key: `notif-${n.id}` }))
  ]);

  const renderItem = ({ item }: any) => {
    if (item.type === 'header') {
      return (
        <Text className="text-base font-semibold text-gray-500 mb- mt-4 uppercase px-4">
          {item.dateLabel}
        </Text>
      );
    }
    
    return (
      <View className="p-4">
        <NotificationItem
          type={item.notification.type}
          title={item.notification.title}
          message={item.notification.message}
          time={item.notification.time}
          isRead={item.notification.is_read}
          onPress={() => handleNotificationPress(item.notification.id)}
        />
      </View>
    );
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    
    return (
      <View className="py-4 items-center">
        <ActivityIndicator size="small" color="hsl(70, 91%, 17%)" />
        <Text className="text-gray-500 text-sm mt-2">Loading more...</Text>
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading) {
      return (
        <View className="items-center justify-center pt-32">
          <ActivityIndicator size="large" color="hsl(70, 91%, 17%)" />
          <Text className="text-gray-500 mt-4">Loading notifications...</Text>
        </View>
      );
    }
    
    return (
      <View className="items-center justify-center pt-32 ">
        <View className="w-32 h-32 rounded-full bg-green-50 items-center justify-center mb-6">
          <BellOff size={48} color="hsl(70, 91%, 17%)" strokeWidth={1.5} />
        </View>
        <Text className="text-lg font-semibold text-gray-900 mb-2">
          No Notifications Here
        </Text>
        <Text className="text-gray-500 text-center px-8 mb-4">
          You're all caught up! New notifications will appear here.
        </Text>
      </View>
    );
  };

  const renderHeader = () => {
    if (notifications.length === 0) return null;
    
    return (
      <View className="p-4">
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center gap-2">
            <Text className='font-semibold text-lg'>All Notifications</Text>
            {unreadCount > 0 && (
              <View className="bg-red-500 rounded-full px-2 py-0.5 min-w-[20px] items-center justify-center">
                <Text className="text-white text-xs font-semibold">{unreadCount}</Text>
              </View>
            )}
          </View>
          {unreadCount > 0 && (
            <TouchableOpacity onPress={handleClearAll} disabled={loading}>
              <Text className="text-primary font-medium">Mark all as read</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-4">
      {/* ===== Page Header ===== */}
      <PageHeader 
        title="Notifications"
        showBackButton={true}
        showNotificationButton={false}
      />
      
      <FlatList
        data={flatListData}
        renderItem={renderItem}
        keyExtractor={(item) => item.key}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        contentContainerStyle={{ paddingBottom: 80 }}
      />
    </SafeAreaView>
  )
}