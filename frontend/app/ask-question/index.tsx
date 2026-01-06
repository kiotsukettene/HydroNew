import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { View, ScrollView, Pressable } from 'react-native'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Icon } from '@/components/ui/icon'
import { ArrowLeft, Mail } from 'lucide-react-native'
import { useRouter } from 'expo-router'
import { PageHeader } from '@/components/ui/page-header'


export default function Index() {
  const [email, setEmail] = useState('')
  const [question, setQuestion] = useState('')
  const router = useRouter()

  const handleSend = () => {
    // TODO: Implement send functionality
    console.log('Email:', email)
    console.log('Question:', question)
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
              {/* Email field - minimal and rounded */}
              <View className="gap-2">
                <Label className="text-sm font-medium text-primary pl-1">
                  Your email
                </Label>
                <Input
                  value={email}
                  onChangeText={setEmail}
                  placeholder="momo@gmail.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  returnKeyType="next"
                  className=" border-muted-foreground/50  bg-[#f3fef8b4]"
                 
                />
              </View>

              {/* Question field - paper-like writing space */}
              <View className="gap-2">
                <Label className="text-sm font-medium text-primary pl-1">
                  Your message
                </Label>
                <View
                  className=" "
                  
                >
                  <Input
                    value={question}
                    onChangeText={setQuestion}
                    placeholder="Dear HydroNew team...

Write your question or message here. We'd love to hear from you! "
                    multiline={true}
                    numberOfLines={8}
                    textAlignVertical="top"
                    placeholderTextColor="#B8A082"
                    className="border border-muted-foreground/50  bg-[#f3fef8b4] text-base flex-1"
                  />
                </View>
              </View>

              {/* Send button */}
              <View className="mt-2">
                <Button 
                  onPress={handleSend}
                  className="w-full rounded-full h-14"
                  disabled={!email.trim() || !question.trim()}
                
                >
                  <View className="flex-row items-center gap-2">
                    <Icon as={Mail} size={18} className="text-white" />
                    <Text className="text-base font-semibold ">
                      Send message
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
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
