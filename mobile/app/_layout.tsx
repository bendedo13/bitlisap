import '../global.css';
import { useMemo, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { colors } from '../constants/theme';
import { usePushNotifications } from '../hooks/usePushNotifications';

function PushRegistration() {
  usePushNotifications();
  return null;
}

export default function RootLayout() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            gcTime: 1000 * 60 * 60 * 24,
            retry: 1,
            networkMode: 'offlineFirst',
          },
        },
      })
  );

  const persister = useMemo(
    () =>
      createAsyncStoragePersister({
        storage: AsyncStorage,
      }),
    []
  );

  return (
    <SafeAreaProvider>
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        maxAge: 1000 * 60 * 60 * 24,
      }}
    >
      <PushRegistration />
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
          name="search"
          options={{ title: 'Arama' }}
        />
        <Stack.Screen
          name="legal/privacy"
          options={{ title: 'Gizlilik' }}
        />
        <Stack.Screen
          name="legal/terms"
          options={{ title: 'Kullanım Şartları' }}
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
        <Stack.Screen
          name="conversations"
          options={{ title: 'Mesajlar' }}
        />
        <Stack.Screen
          name="ads/create"
          options={{ title: 'Reklam Ver' }}
        />
      </Stack>
    </PersistQueryClientProvider>
    </SafeAreaProvider>
  );
}
