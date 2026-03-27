import { Tabs } from "expo-router";
import { Mic, Settings2 } from "lucide-react-native";
import React from "react";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#60A5FA',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: 'rgba(0, 0, 0, 0.1)',
        },
        tabBarInactiveTintColor: '#6B7280',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Voice",
          tabBarIcon: ({ color }) => <Mic color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="profiles"
        options={{
          title: "Profiles",
          tabBarIcon: ({ color }) => <Settings2 color={color} size={24} />,
        }}
      />
    </Tabs>
  );
}
