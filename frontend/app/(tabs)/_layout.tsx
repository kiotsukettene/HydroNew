import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, Platform } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 100 : 80,
          borderTopWidth: 0,
          backgroundColor: '#FFFFFF',
          paddingBottom: Platform.OS === 'ios' ? 30 : 15,
          paddingTop: 15,
          paddingHorizontal: 20,
          borderRadius: 25,
          marginHorizontal: 20,
          marginBottom: Platform.OS === 'ios' ? 10 : 5,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.15,
          shadowRadius: 10,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
          marginTop: 2,
        },
        tabBarActiveTintColor: '#4C5D06',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarIcon: ({ focused, color }) => {
          const map: Record<string, { label: string; icon: keyof typeof Ionicons.glyphMap }> = {
            index: { label: "Home", icon: "home" },
            "water-monitor": { label: "Water Monitor", icon: "pulse" },
            control: { label: "Control", icon: "add-circle" },
            profile: { label: "Profile", icon: "person" },
          };
          const data = map[route.name] ?? { label: route.name, icon: "ellipse-outline" };
          
          return (
            <View style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: focused ? '#E8F5E8' : 'transparent',
            }}>
              <Ionicons 
                name={data.icon} 
                size={22} 
                color={focused ? '#4C5D06' : '#9CA3AF'} 
              />
            </View>
          );
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="water-monitor" options={{ title: "Water Monitor" }} />
      <Tabs.Screen name="control" options={{ title: "Control" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}


