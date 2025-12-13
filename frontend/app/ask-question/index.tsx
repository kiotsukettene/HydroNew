import { PageHeader } from '@/components/ui/page-header'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { View, ScrollView } from 'react-native'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import { Input } from '@/components/ui/input'

export default function Index() {
  const [email, setEmail] = useState('')
  const [question, setQuestion] = useState('')

  const handleSend = () => {
    // TODO: Implement send functionality
    console.log('Email:', email)
    console.log('Question:', question)
  }

  return (
    <SafeAreaView className="flex-1">
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
                  <PageHeader title='Ask your question'/>

        <View className="p-4">

          <View className="mt-6 gap-6">
            {/* Email field */}
            <View className="gap-1">
              <Label className="font-normal text-muted-foreground">
                Email
              </Label>
              <Input
                value={email}
                onChangeText={setEmail}
                placeholder="hydronew@gmail.com"
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="next"
               
              />
            </View>

            {/* Question field (text-area) */}
            <View className="gap-1">
              <Label className="font-normal text-muted-foreground">
                Question
              </Label>
              <Input
                value={question}
                onChangeText={setQuestion}
                placeholder="Type your question here..."
                multiline={true}
                numberOfLines={6}
                textAlignVertical="top"
                className="border text-base min-h-32"
              />

            </View>

            {/* Send button */}
            <View className="mt-4">
              <Button 
                onPress={handleSend}
                className="w-full"
                disabled={!email.trim() || !question.trim()}
              >
                <Text>Send</Text>
              </Button>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
