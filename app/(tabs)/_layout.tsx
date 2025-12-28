import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs initialRouteName="train" screenOptions={{ headerShown: true }}>
      <Tabs.Screen
        name="train"
        options={{
          title: 'Train',
        }}
      />
      <Tabs.Screen
        name="plans"
        options={{
          title: 'Plans',
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
        }}
      />
    </Tabs>
  );
}
