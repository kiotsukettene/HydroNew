import { PageHeader } from '@/components/ui/page-header'
import React, { useState } from 'react'
import { ScrollView, View, Text, Pressable, TextInput, Keyboard, TouchableOpacity} from 'react-native'
import { THEME } from '@/lib/theme'
import { Card, CardContent } from '@/components/ui/card'
import { Search, UserRoundCheck } from 'lucide-react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
export default function LoginHistory() {

  const profileImage = null;
  const loginHistory = [
    {
      id: 9,
      user_id: 1,
      ip_address: '172.19.0.1',
      created_at: '2026-01-21T10:15:00',
    },
    {
      id: 8,
      user_id: 1,
      ip_address: '172.19.0.1',
      created_at: '2026-01-20T18:45:00',
    },
    {
      id: 7,
      user_id: 2,
      ip_address: '192.168.1.10',
      created_at: '2026-01-19T14:30:00',
    }
  ];

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [query, setQuery] = useState("");

  const filteredHistory = loginHistory.filter(entry => {
    const q = query.trim().toLowerCase();
    // Format date and time for searching
    const dateStr = new Date(entry.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }).toLowerCase();
    const timeStr = new Date(entry.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).toLowerCase();
    return (
      entry.ip_address.toLowerCase().includes(q) ||
      String(entry.user_id).includes(q) ||
      dateStr.includes(q) ||
      timeStr.includes(q)
    );
  });

  const triggerSearch = () => {
    Keyboard.dismiss();
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1">
        <PageHeader title="Login History" showNotificationButton={true} />
        {/* ===== Search Bar ===== */}
        <View className="w-full px-5 mt-4">
              {/* Search + Filter */}
            <View className="mt-1 mb-3 flex-row items-center gap-2">
              <View className="flex-1 flex-row items-center rounded-xl border border-muted-foreground/30 px-3 py-2">
                <Search size={30} color="#888" />
                <TextInput
                  placeholder="Search here…"
                  placeholderTextColor="#9CA3AF"
                  className="ml-2 flex-1 text-base "
                  returnKeyType="search"
                />
              </View>
             
            </View>
         
        </View>
        <ScrollView className="mt-4 px-2" showsVerticalScrollIndicator={true} contentContainerStyle={{ flexGrow: 1 }}>
          {filteredHistory.map((entry) => {
            const isSelected = selectedId === entry.id;
            return (
              <Pressable
                key={entry.id}
                onPress={() => setSelectedId(selectedId === entry.id ? null : entry.id)}
                style={({ pressed }) => [
                  { opacity: pressed ? 0.85 : 1 },
                ]}
              >
                <Card
                  className="mb-4 rounded-2xl border shadow-sm self-center bg-white"
                  style={{
                    width: '98%',
                    borderColor: isSelected ? THEME.light.successs : THEME.light.border,
                    borderWidth: 1.5,
                  }}
                >
                  <CardContent className="py-2 px-2">
                    <View className="flex-row items-center gap-3">
                      {/* Profile Image beside time */}
                      <View className='rounded-full items-center  p-3 bg-muted border border-green-100 justify-center overflow-hidden'>
                        <UserRoundCheck color="#71717a" />
                      </View>
                      <View className="flex-1">
                        <Text className="text-base  text-gray-900">
                          You've logged in at {new Date(entry.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })} | {new Date(entry.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                      </View>
                    </View>
                  </CardContent>
                </Card>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
