import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useEffect, useRef } from 'react';
import { Colors, BorderRadius, Shadows } from '../../constants/theme';
import { useAppStore } from '../../store/appStore';

function TabIcon({
  name,
  focused,
  color,
  label,
}: {
  name: keyof typeof Ionicons.glyphMap;
  focused: boolean;
  color: string;
  label: string;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: focused ? 1.12 : 1,
      useNativeDriver: true,
      speed: 30,
      bounciness: 8,
    }).start();
  }, [focused]);

  return (
    <Animated.View style={[styles.iconWrap, focused && styles.iconWrapActive, { transform: [{ scale }] }]}>
      <Ionicons name={name} size={22} color={color} />
      {focused && <Text style={[styles.iconLabel, { color }]}>{label}</Text>}
    </Animated.View>
  );
}

export default function TabLayout() {
  const { unreadNotifications } = useAppStore();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: Colors.primary[500],
        tabBarInactiveTintColor: Colors.gray[400],
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name={focused ? 'home' : 'home-outline'} focused={focused} color={color} label="Ana Sayfa" />
          ),
        }}
      />
      <Tabs.Screen
        name="news"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name={focused ? 'newspaper' : 'newspaper-outline'} focused={focused} color={color} label="Haberler" />
          ),
        }}
      />
      <Tabs.Screen
        name="market"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name={focused ? 'pricetag' : 'pricetag-outline'} focused={focused} color={color} label="Pazar" />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name={focused ? 'map' : 'map-outline'} focused={focused} color={color} label="Harita" />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarBadge: unreadNotifications > 0 ? unreadNotifications : undefined,
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name={focused ? 'person' : 'person-outline'} focused={focused} color={color} label="Profil" />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.white,
    borderTopWidth: 0,
    height: 72,
    paddingBottom: 12,
    paddingTop: 8,
    ...Shadows.xl,
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    minWidth: 44,
  },
  iconWrapActive: {
    backgroundColor: Colors.primary[50],
    flexDirection: 'row',
    gap: 4,
  },
  iconLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
