import { Tabs, usePathname } from 'expo-router';
import { Home, Settings, Monitor, User, LeafIcon } from 'lucide-react-native';
import { View } from 'react-native';
import { FiltrationProgressBar } from '@/components/ui/filtration-progress-bar';

export default function TabLayout() {
  const pathname = usePathname();
  const isOnHomePage =
    pathname === '/home' ||
    pathname === '/(tabs)/home' ||
    pathname?.endsWith('/home');

  return (
    <>
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#445104', 
        tabBarInactiveTintColor: '#6b7280', 
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
          zIndex: 100,
          elevation: 100,
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
            <View className="items-center justify-center" style={{ zIndex: 101, elevation: 101 }}>
              <View
                className={`w-12 h-12 rounded-full items-center justify-center ${
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
                  elevation: 102,
                  zIndex: 102,
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
    {isOnHomePage && <FiltrationProgressBar floating />}
    </>
  );
}