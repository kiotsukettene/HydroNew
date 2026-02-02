import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { View, ScrollView, ActivityIndicator } from 'react-native'
import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import { Card, CardContent } from '@/components/ui/card'
import { Icon } from '@/components/ui/icon'
import { MessageSquare, Calendar, ChevronDown } from 'lucide-react-native'
import { PageHeader } from '@/components/ui/page-header'
import { useFeedbackStore } from '@/store/feedback/feedbackStore'
import { FeedbackCategory } from '@/types/feedback'

const FEEDBACK_CATEGORIES: Record<string, string> = {
  bug_report: 'Bug Report',
  feature_request: 'Feature Request',
  general_feedback: 'General Feedback',
  device_issue: 'Device Issue',
  other: 'Other',
};

export default function FeedbackList() {
  const { feedbacks, loading, hasMore, fetchFeedbacks, loadMore } = useFeedbackStore()

  useEffect(() => {
    fetchFeedbacks(0)
  }, [])

  const getCategoryLabel = (value: FeedbackCategory) => {
    return FEEDBACK_CATEGORIES[value] || value
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <PageHeader title="Feedback List" showBackButton={true} />
      
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        className="px-4 py-6"
      >
        <View className="flex-row items-center justify-between mb-6">
          <Text className="text-xl font-bold text-primary">
            Your Messages
          </Text>
          <View className="flex-row items-center gap-1">
            <Icon as={MessageSquare} size={18} className="text-primary/70" />
            <Text className="text-sm text-primary/70">
              {feedbacks.length} Total
            </Text>
          </View>
        </View>

        {loading && feedbacks.length === 0 ? (
          <View className="items-center justify-center flex-1 py-12">
            <ActivityIndicator size="large" color="#4CAF50" />
            <Text className="text-muted-foreground mt-4 font-medium">Loading history...</Text>
          </View>
        ) : feedbacks.length === 0 ? (
          <View className="items-center justify-center flex-1 py-12">
            <View className="bg-muted-foreground/10 p-6 rounded-full mb-4">
              <Icon as={MessageSquare} size={48} className="text-muted-foreground/40" />
            </View>
            <Text className="text-lg font-bold text-foreground text-center">
              No history found
            </Text>
            <Text className="text-base text-muted-foreground text-center mt-2 px-8">
              You haven't submitted any feedback yet. Your messages will appear here.
            </Text>
          </View>
        ) : (
          <View className="gap-4 pb-8">
            {feedbacks.map((feedback) => (
              <Card key={feedback.id} className="rounded-2xl border border-muted-foreground/20 shadow-sm">
                <CardContent className="p-5">
                  <View className="flex-row items-center justify-between mb-3">
                    <View className="bg-primary/10 px-3 py-1.5 rounded-full">
                      <Text className="text-xs font-bold text-primary uppercase tracking-wider">
                        {getCategoryLabel(feedback.category)}
                      </Text>
                    </View>
                    <View className="flex-row items-center gap-1.5">
                      <Icon as={Calendar} size={14} className="text-muted-foreground" />
                      <Text className="text-xs text-muted-foreground font-medium">
                        {formatDate(feedback.created_at)}
                      </Text>
                    </View>
                  </View>

                  {feedback.subject && (
                    <Text className="text-lg font-bold text-foreground mb-2">
                      {feedback.subject}
                    </Text>
                  )}

                  <Text className="text-base text-muted-foreground leading-relaxed">
                    {feedback.message}
                  </Text>

                  <View className="mt-4 pt-4 border-t border-muted-foreground/10 flex-row justify-between items-center">
                    <Text className="text-xs text-muted-foreground font-medium uppercase tracking-tighter">
                      ID: #{feedback.id}
                    </Text>
                    <View className="flex-row items-center gap-1">
                      <View className="w-2 h-2 rounded-full bg-green-500" />
                      <Text className="text-xs text-green-600 font-bold uppercase tracking-tighter">
                        Submitted
                      </Text>
                    </View>
                  </View>
                </CardContent>
              </Card>
            ))}

            {hasMore && (
              <Button
                variant="outline"
                onPress={loadMore}
                disabled={loading}
                className="mt-4 rounded-2xl h-14 border-primary/30"
              >
                <View className="flex-row items-center gap-2">
                  {loading ? (
                    <ActivityIndicator size="small" color="#4CAF50" />
                  ) : (
                    <Icon as={ChevronDown} size={20} className="text-primary" />
                  )}
                  <Text className="text-primary font-bold text-base">
                    {loading ? 'Loading more...' : 'Load More Messages'}
                  </Text>
                </View>
              </Button>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

