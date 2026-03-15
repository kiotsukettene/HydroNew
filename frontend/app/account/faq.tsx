import {
  View,
  ScrollView,
  Pressable,
  ActivityIndicator,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PageHeader } from '@/components/ui/page-header';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Minus, Plus, Search, X, MessageCircle } from 'lucide-react-native';
import { useHelpCenterStore } from '@/store/auth/helpCenterStore';
import { router } from 'expo-router';

export default function FAQ() {
  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const {
    items,
    loading,
    error,
    currentPage,
    lastPage,
    fetchHelpCenter,
    nextPage,
    prevPage,
    searchHelpCenter,
  } = useHelpCenterStore();

  useEffect(() => {
    fetchHelpCenter();
  }, []);

  const handleSearch = async () => {
    await searchHelpCenter(searchTerm.trim());
  };

  const handleClearSearch = async () => {
    setSearchTerm('');
    await fetchHelpCenter(1);
  };

  const toggleExpanded = (index: number) => {
    setExpandedItems((prev) =>
      prev.includes(index)
        ? prev.filter((item) => item !== index)
        : [...prev, index]
    );
  };

  const highlightText = (text: string, keyword: string) => {
    if (!keyword) return <Text>{text}</Text>;

    const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedKeyword})`, 'gi');
    const parts = text.split(regex);

    return (
      <Text>
        {parts.map((part, index) =>
          regex.test(part) ? (
            <Text
              key={index}
              className="rounded bg-yellow-100 font-semibold text-primary"
            >
              {part}
            </Text>
          ) : (
            <Text key={index}>{part}</Text>
          )
        )}
      </Text>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white/50">
          <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                style={{ flex: 1 }}
              >
      
                <PageHeader title="Help Center" />

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="flex-1">

          <View className="items-center p-4">
            <Text className="mt-7 text-3xl  font-semibold text-primary mb-5">
              How can we help you?
            </Text>

            <View className="mt-3 flex-row items-center gap-2">
              <Input
                placeholder="Type your question here..."
                value={searchTerm}
                onChangeText={setSearchTerm}
                onSubmitEditing={handleSearch}
                className="flex-1 bg-white rounded-xl border border-muted-foreground/30 px-3 py-1"
                returnKeyType="search"
              />

              {searchTerm.length > 0 && (
                <TouchableOpacity
                  onPress={handleClearSearch}
                  className="px-1"
                >
                  <X size={18} color="#888" />
                </TouchableOpacity>
              )}

              <Button variant="ghost" onPress={handleSearch} className='bg-white text-primary '>
                <Search size={20} />
              </Button>
            </View>
          </View>

          <View className="mt-8 flex-row items-center justify-between px-4">
            <Text className="text-lg font-semibold text-primary">
              Frequently Asked Questions
            </Text>
          </View>

          {loading && (
            <View className="mt-6 items-center">
              <ActivityIndicator size="large" color="#445104" />
            </View>
          )}

          {error && (
            <View className="mt-4">
              <Text className="text-center text-red-500">{error}</Text>
            </View>
          )}

          {!loading && !error && (
            <View className="mt-4 gap-5 p-4">
              {items.length === 0 ? (
                <Text className="mt-6 text-center text-gray-500">
                  No results found.
                </Text>
              ) : (
                items.map((item, index) => {
                  const isExpanded = expandedItems.includes(index);
                  return (
                    <Card
                      key={item.id}
                      className="rounded-xl border border-gray-200"
                    >
                      <Pressable onPress={() => toggleExpanded(index)}>
                        <CardContent className="p-4">
                          <View className="flex-row items-center justify-between">
                            <Text className="flex-1 pr-3 text-base font-semibold">
                              {highlightText(item.question, searchTerm)}
                            </Text>
                            {isExpanded ? (
                              <Minus size={20} color="#445104" />
                            ) : (
                              <Plus size={20} color="#445104" />
                            )}
                          </View>
                          {isExpanded && (
                            <View className="mt-3 pt-3 border-t border-gray-200">
                              <Text className="text-gray-700 leading-6 text-justify">
                                {highlightText(item.answer, searchTerm)}
                              </Text>
                            </View>
                          )}
                        </CardContent>
                      </Pressable>
                    </Card>
                  );
                })
              )}
            </View>
          )}

          {!loading && !error && items.length > 0 && (
            <View className="mt-6 flex-row items-center justify-between px-4">
              <Button
                variant="outline"
                onPress={prevPage}
                disabled={currentPage === 1}
              >
                <Text>Prev</Text>
              </Button>

              <Text>
                Page {currentPage} of {lastPage}
              </Text>

              <Button
                variant="outline"
                onPress={nextPage}
                disabled={currentPage === lastPage}
              >
                <Text>Next</Text>
              </Button>
            </View>
          )}
        </View>
      </ScrollView>

      <View className="absolute bottom-0 right-0 left-0 items-end p-6 pb-8">
        <Button
          size="sm"
          className="rounded-full bg-primary shadow-lg"
          onPress={() => router.replace('/ask-question')}
        >
          <Text className="text-muted">Ask a question</Text>
          <MessageCircle size={18} color="#fff" />
        </Button>
      </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
