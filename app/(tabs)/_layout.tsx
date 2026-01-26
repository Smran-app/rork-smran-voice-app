import { Tabs } from "expo-router";
import { Mic } from "lucide-react-native";
import React from "react";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#60A5FA',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0A0A0F',
          borderTopColor: 'rgba(255, 255, 255, 0.1)',
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
    </Tabs>
  );
}
