import { Tabs } from 'expo-router';
import { Home, Settings, Monitor, User, LeafIcon } from 'lucide-react-native';
import { View, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#445104', 
        tabBarInactiveTintColor: '#6b7280', 
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
          headerTitle: 'Home',
        }}
      />
      <Tabs.Screen
        name="monitor"
        options={{
          title: 'Monitor',
          tabBarIcon: ({ color, size }) => <Monitor size={size} color={color} />,
          headerTitle: 'Water Monitor',
        }}
      />
       <Tabs.Screen
        name="hydroponics"
        options={{
          title: 'Plants',
          tabBarIcon: ({ focused, color, size }) => (
            <View className="items-center justify-center">
              <View 
                className={`w-12 h-12 rounded-full  items-center justify-center ${
                  focused ? 'bg-primary shadow-lg shadow-green-500/30' : 'bg-primary shadow-lg shadow-green-500/30'
                }`}
                style={{
                  marginTop: -20, 
                  shadowColor: '#10b981',
                  shadowOffset: {
                    width: 0,
                    height: 4,
                  },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 8, 
                }}
              >
                <LeafIcon size={24} color="white" />
              </View>
            </View>
          ),
          headerTitle: 'Plant Growth',
        }}
      />
      <Tabs.Screen
        name="filtration"
        options={{
          title: 'Filtration',
          tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
          headerTitle: 'System Controls',
        }}
      />
     
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
          headerTitle: 'Profile',
        }}
      />
    </Tabs>
  );
}