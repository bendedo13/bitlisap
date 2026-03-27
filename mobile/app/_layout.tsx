import '../global.css';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { colors } from '../constants/theme';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 2,
    },
  },
});

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: colors.text.inverse,
          headerTitleStyle: { fontWeight: '600' },
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}
      >
        <Stack.Screen
          name="(auth)"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="news/[id]"
          options={{ title: 'Haber Detay' }}
        />
        <Stack.Screen
          name="listing/[id]"
          options={{ title: 'İlan Detay' }}
        />
        <Stack.Screen
          name="listing/create"
          options={{ title: 'İlan Ver' }}
        />
        <Stack.Screen
          name="listing/chat/[id]"
          options={{ title: 'Mesaj' }}
        />
        <Stack.Screen
          name="business/[id]"
          options={{ title: 'İşletme' }}
        />
        <Stack.Screen
          name="business/panel"
          options={{ title: 'Esnaf Paneli' }}
        />
        <Stack.Screen
          name="events/index"
          options={{ title: 'Etkinlikler' }}
        />
        <Stack.Screen
          name="events/[id]"
          options={{ title: 'Etkinlik Detay' }}
        />
        <Stack.Screen
          name="emergency"
          options={{ title: 'Acil Yardım' }}
        />
        <Stack.Screen
          name="tourism"
          options={{ title: 'Tarih & Turizm' }}
        />
      </Stack>
    </QueryClientProvider>
  );
}
