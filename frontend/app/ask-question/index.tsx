import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { View, ScrollView, Pressable, TouchableOpacity, ActivityIndicator } from 'react-native'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Icon } from '@/components/ui/icon'
import { ArrowLeft, Mail, ChevronDown, MessageSquare, Calendar, Tag } from 'lucide-react-native'
import { useRouter } from 'expo-router'
import { PageHeader } from '@/components/ui/page-header'
import { useFeedbackStore } from '@/store/feedback/feedbackStore'
import { FeedbackCategory } from '@/types/feedback'


const FEEDBACK_CATEGORIES: { value: FeedbackCategory; label: string }[] = [
  { value: 'bug_report', label: 'Bug Report' },
  { value: 'feature_request', label: 'Feature Request' },
  { value: 'general_feedback', label: 'General Feedback' },
  { value: 'device_issue', label: 'Device Issue' },
  { value: 'other', label: 'Other' },
];

export default function Index() {
  const router = useRouter()
  const { feedbacks, loading, submitting, hasMore, fetchFeedbacks, submitFeedback, loadMore } = useFeedbackStore()
  
  const [category, setCategory] = useState<FeedbackCategory>('general_feedback')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)

  useEffect(() => {
    fetchFeedbacks()
  }, [])

  const handleSend = async () => {
    if (!category || !message.trim()) {
      return
    }

    try {
      await submitFeedback({
        category,
        subject: subject.trim() || undefined,
        message: message.trim(),
      })
      
      // Reset form after successful submission
      setCategory('general_feedback')
      setSubject('')
      setMessage('')
    } catch (error) {
      // Error is already handled in the store
    }
  }

  const getCategoryLabel = (value: FeedbackCategory) => {
    return FEEDBACK_CATEGORIES.find(c => c.value === value)?.label || value
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <SafeAreaView className="flex-1 bg-white" >
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >

<PageHeader title='' showBackButton={true} />

    
        <View className="px-3 pb-8">
          {/* Friendly title with handwritten font */}
          <View className="items-center mb-2">
            <Text 
              className="text-4xl mb-2 mt-5 text-primary"
              style={{ fontFamily: 'FingerPaint-Regular',  }}
            >
              Got a question?
            </Text>
            <View className="flex-row items-center gap-2 mt-1">
              <Icon as={Mail} size={20} className="text-primary" />
              <Text className="text-base text-primary/70 font-normal">
                Write us a message
              </Text>
            </View>
          </View>

          {/* Soft card container */}
          <Card 
            className="mt-6 rounded-3xl border border-muted-foreground/30"
          >
            <CardContent className="p-6 gap-6">
              {/* Category field - dropdown */}
              <View className="gap-2">
                <Label className="text-sm font-medium text-primary pl-1">
                  Category *
                </Label>
                <TouchableOpacity
                  onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
                  className="border border-muted-foreground/50 bg-[#f3fef8b4] rounded-xl px-4 py-4 flex-row items-center justify-between"
                >
                  <Text className="text-base">{getCategoryLabel(category)}</Text>
                  <Icon as={ChevronDown} size={20} className="text-muted-foreground" />
                </TouchableOpacity>
                
                {showCategoryDropdown && (
                  <View className="border border-muted-foreground/30 rounded-xl bg-white overflow-hidden">
                    {FEEDBACK_CATEGORIES.map((cat) => (
                      <TouchableOpacity
                        key={cat.value}
                        onPress={() => {
                          setCategory(cat.value)
                          setShowCategoryDropdown(false)
                        }}
                        className={`px-4 py-3 border-b border-muted-foreground/10 ${
                          category === cat.value ? 'bg-primary/10' : ''
                        }`}
                      >
                        <Text className={category === cat.value ? 'text-primary font-semibold' : ''}>
                          {cat.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {/* Subject field - optional */}
              <View className="gap-2">
                <Label className="text-sm font-medium text-primary pl-1">
                  Subject <Text className="text-muted-foreground">(Optional)</Text>
                </Label>
                <Input
                  value={subject}
                  onChangeText={setSubject}
                  placeholder="Brief summary of your feedback"
                  autoCapitalize="sentences"
                  returnKeyType="next"
                  className="border-muted-foreground/50 bg-[#f3fef8b4]"
                  maxLength={255}
                />
              </View>

              {/* Message field - paper-like writing space */}
              <View className="gap-2">
                <Label className="text-sm font-medium text-primary pl-1">
                  Your message *
                </Label>
                <View>
                  <Input
                    value={message}
                    onChangeText={setMessage}
                    placeholder="Dear HydroNew team...

Write your question or message here. We'd love to hear from you!"
                    multiline={true}
                    numberOfLines={8}
                    textAlignVertical="top"
                    placeholderTextColor="#B8A082"
                    className="border border-muted-foreground/50 bg-[#f3fef8b4] text-base h-40"
                    maxLength={2000}
                  />
                  <Text className="text-xs text-muted-foreground text-right mt-1">
                    {message.length}/2000
                  </Text>
                </View>
              </View>

              {/* Send button */}
              <View className="mt-2">
                <Button 
                  onPress={handleSend}
                  className="w-full rounded-full h-14"
                  disabled={!category || !message.trim() || message.trim().length < 10 || submitting}
                >
                  <View className="flex-row items-center gap-2">
                    {submitting ? (
                      <ActivityIndicator size="small" color="white" />
                    ) : (
                      <Icon as={Mail} size={18} className="text-white" />
                    )}
                    <Text className="text-base font-semibold">
                      {submitting ? 'Sending...' : 'Send message'}
                    </Text>
                  </View>
                </Button>
              </View>
            </CardContent>
          </Card>

         
          <View className="items-center mt-6">
            <Text className="text-sm text-primary/50 italic">
              We'll get back to you soon! 
            </Text>
          </View>

          {/* Feedback History Section */}
          <View className="mt-8">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-xl font-bold text-primary">
                Your Feedback History
              </Text>
              <View className="flex-row items-center gap-1">
                <Icon as={MessageSquare} size={18} className="text-primary/70" />
                <Text className="text-sm text-primary/70">
                  {feedbacks.length} of {hasMore ? `${feedbacks.length}+` : feedbacks.length}
                </Text>
              </View>
            </View>

            {loading && feedbacks.length === 0 ? (
              <View className="items-center py-8">
                <ActivityIndicator size="large" color="#4CAF50" />
                <Text className="text-muted-foreground mt-2">Loading feedback...</Text>
              </View>
            ) : feedbacks.length === 0 ? (
              <Card className="p-6 rounded-2xl border border-muted-foreground/20">
                <View className="items-center">
                  <Icon as={MessageSquare} size={48} className="text-muted-foreground/30 mb-3" />
                  <Text className="text-base text-muted-foreground text-center">
                    No feedback submitted yet
                  </Text>
                  <Text className="text-sm text-muted-foreground/70 text-center mt-1">
                    Your submitted feedback will appear here
                  </Text>
                </View>
              </Card>
            ) : (
              <View className="gap-3">
                {feedbacks.map((feedback) => (
                  <Card key={feedback.id} className="rounded-2xl border border-muted-foreground/20">
                    <CardContent className="p-4">
                      {/* Header with category and date */}
                      <View className="flex-row items-center justify-between mb-2">
                        <View className="flex-row items-center gap-2">
                          <View className="bg-primary/10 px-3 py-1 rounded-full">
                            <Text className="text-xs font-semibold text-primary">
                              {getCategoryLabel(feedback.category)}
                            </Text>
                          </View>
                        </View>
                        <View className="flex-row items-center gap-1">
                          <Icon as={Calendar} size={14} className="text-muted-foreground" />
                          <Text className="text-xs text-muted-foreground">
                            {formatDate(feedback.created_at)}
                          </Text>
                        </View>
                      </View>

                      {/* Subject if available */}
                      {feedback.subject && (
                        <Text className="text-base font-semibold text-foreground mb-2">
                          {feedback.subject}
                        </Text>
                      )}

                      {/* Message */}
                      <Text className="text-sm text-muted-foreground" numberOfLines={3}>
                        {feedback.message}
                      </Text>

                      {/* Footer */}
                      <View className="mt-3 pt-3 border-t border-muted-foreground/10">
                        <Text className="text-xs text-muted-foreground italic">
                          Feedback ID: #{feedback.id}
                        </Text>
                      </View>
                    </CardContent>
                  </Card>
                ))}

                {/* Load More Button */}
                {hasMore && (
                  <Button
                    variant="outline"
                    onPress={loadMore}
                    disabled={loading}
                    className="mt-2 rounded-xl"
                  >
                    <View className="flex-row items-center gap-2">
                      {loading ? (
                        <ActivityIndicator size="small" color="#4CAF50" />
                      ) : (
                        <Icon as={ChevronDown} size={18} className="text-primary" />
                      )}
                      <Text className="text-primary">
                        {loading ? 'Loading...' : 'Load More'}
                      </Text>
                    </View>
                  </Button>
                )}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
