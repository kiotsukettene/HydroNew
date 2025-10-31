import { View, ScrollView, Pressable, ActivityIndicator, TextInput, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { PageHeader } from "@/components/ui/page-header";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Minus, Plus, Search, X } from "lucide-react-native"; // ✅ Added X icon
import { useHelpCenterStore } from "@/store/auth/helpCenterStore";

export default function FAQ() {
  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

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
    setSearchTerm("");
    await fetchHelpCenter(1); // ✅ Reset to page 1 and clear search filter
  };

  const toggleExpanded = (index: number) => {
    setExpandedItems((prev) =>
      prev.includes(index)
        ? prev.filter((item) => item !== index)
        : [...prev, index]
    );
  };

  // ✅ Helper to highlight matched text
  const highlightText = (text: string, keyword: string) => {
    if (!keyword) return <Text>{text}</Text>;

    // Escape regex special chars for safety
    const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${escapedKeyword})`, "gi");
    const parts = text.split(regex);

    return (
      <Text>
        {parts.map((part, index) =>
          regex.test(part) ? (
            <Text
              key={index}
              className="text-primary font-semibold bg-yellow-100 rounded"
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
    <ScrollView>
      <SafeAreaView className="p-4">
        <PageHeader title="Help Center" />

        <View className="items-center">
          <Text className="text-2xl text-primary mt-7">How can we help you?</Text>

          {/* ✅ Search Bar with Clear Button */}
          <View className="flex-row items-center border border-muted-foreground/30 rounded-xl mt-3 px-3 py-1">
            <Search size={18} color="#888" />
            <TextInput
              placeholder="Type your question here..."
              value={searchTerm}
              onChangeText={setSearchTerm}
              onSubmitEditing={handleSearch}
              className="flex-1 ml-2 text-base"
              returnKeyType="search"
            />

            {/* ✅ Show clear (X) only when text exists */}
            {searchTerm.length > 0 && (
              <TouchableOpacity onPress={handleClearSearch} className="px-1">
                <X size={18} color="#888" />
              </TouchableOpacity>
            )}

            <Button variant="ghost" onPress={handleSearch}>
              <Text>Search</Text>
            </Button>
          </View>
        </View>

        <View className="flex flex-row items-center justify-between mt-8">
          <Text className="font-semibold text-primary text-lg">
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
            <Text className="text-red-500 text-center">{error}</Text>
          </View>
        )}

        {!loading && !error && (
          <View className="mt-4 space-y-3 gap-5">
            {items.length === 0 ? (
              <Text className="text-center text-gray-500 mt-6">
                No results found.
              </Text>
            ) : (
              items.map((item, index) => {
                const isExpanded = expandedItems.includes(index);
                return (
                  <Card key={item.id} className="border border-gray-200 rounded-xl">
                    <Pressable onPress={() => toggleExpanded(index)}>
                      <CardContent className="p-4">
                        <View className="flex-row items-center justify-between">
                          <Text className="flex-1 font-semibold text-base pr-3">
                            {highlightText(item.question, searchTerm)}
                          </Text>
                          {isExpanded ? (
                            <Minus size={20} color="#445104" />
                          ) : (
                            <Plus size={20} color="#445104" />
                          )}
                        </View>

                        {isExpanded && (
                          <View className="mt-3 pt-3 border-t border-muted-foreground/20">
                            <Text className="text-gray-700 text-sm leading-5">
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
          <View className="flex flex-row items-center justify-between mt-6">
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
      </SafeAreaView>
    </ScrollView>
  );
}
