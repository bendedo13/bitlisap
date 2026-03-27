import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Linking,
} from 'react-native';
import { useState, useCallback } from 'react';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/theme';
import { useAuthStore } from '../../store/authStore';
import { newsService } from '../../services/news.service';
import { EMERGENCY_NUMBERS } from '../../constants/districts';

function WeatherWidget() {
  return (
    <View
      style={{ backgroundColor: colors.primaryLight }}
      className="rounded-2xl p-4 mb-4"
    >
      <View className="flex-row justify-between items-center">
        <View>
          <Text className="text-white text-sm opacity-80">
            Bitlis, Merkez
          </Text>
          <Text className="text-white text-3xl font-bold">
            12°C
          </Text>
          <Text className="text-white text-sm">
            Parçalı Bulutlu
          </Text>
        </View>
        <Ionicons
          name="partly-sunny"
          size={56}
          color="white"
        />
      </View>
    </View>
  );
}

function QuickActions() {
  const numbers = EMERGENCY_NUMBERS.slice(0, 4);
  return (
    <View className="flex-row justify-between mb-4">
      {numbers.map((item) => (
        <TouchableOpacity
          key={item.number}
          onPress={() => Linking.openURL(`tel:${item.number}`)}
          className="items-center flex-1"
          accessibilityLabel={`${item.name} ara`}
        >
          <View
            style={{
              backgroundColor: colors.danger + '15',
            }}
            className="w-12 h-12 rounded-full items-center justify-center mb-1"
          >
            <Ionicons
              name={item.icon as keyof typeof Ionicons.glyphMap}
              size={22}
              color={colors.danger}
            />
          </View>
          <Text className="text-xs text-gray-600">
            {item.number}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default function HomeScreen() {
  const user = useAuthStore((s) => s.user);
  const [refreshing, setRefreshing] = useState(false);

  const { data: breakingNews, refetch } = useQuery({
    queryKey: ['breaking-news'],
    queryFn: () => newsService.getBreaking(),
  });

  const { data: recentNews } = useQuery({
    queryKey: ['recent-news'],
    queryFn: () => newsService.getAll({ page: 1 }),
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const greeting = user?.fullName
    ? `Merhaba ${user.fullName}`
    : 'Merhaba';

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      contentContainerStyle={{ padding: 16 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.primary}
        />
      }
    >
      {/* Greeting */}
      <Text className="text-xl font-bold mb-1">
        {greeting}
      </Text>
      <Text className="text-gray-500 mb-4">
        Bitlis'te bugün neler oluyor?
      </Text>

      {/* Weather */}
      <WeatherWidget />

      {/* Breaking News */}
      {breakingNews?.data?.data?.length > 0 && (
        <TouchableOpacity
          style={{
            backgroundColor: colors.danger,
          }}
          className="rounded-xl p-3 mb-4"
          onPress={() =>
            router.push(
              `/news/${breakingNews.data.data[0].id}`
            )
          }
          accessibilityLabel="Son dakika haberi"
        >
          <View className="flex-row items-center">
            <Ionicons
              name="alert-circle"
              size={20}
              color="white"
            />
            <Text className="text-white font-bold ml-2">
              SON DAKİKA
            </Text>
          </View>
          <Text
            className="text-white mt-1"
            numberOfLines={2}
          >
            {breakingNews.data.data[0].title}
          </Text>
        </TouchableOpacity>
      )}

      {/* Quick Actions */}
      <Text className="text-lg font-bold mb-3">
        Acil Numaralar
      </Text>
      <QuickActions />

      {/* Recent News */}
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-lg font-bold">
          Son Haberler
        </Text>
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/news')}
          accessibilityLabel="Tüm haberleri gör"
        >
          <Text
            style={{ color: colors.primaryLight }}
            className="text-sm"
          >
            Tümünü Gör
          </Text>
        </TouchableOpacity>
      </View>

      {recentNews?.data?.data?.slice(0, 3).map(
        (item: {
          id: string;
          title: string;
          summary: string;
          category: string;
        }) => (
          <TouchableOpacity
            key={item.id}
            className="bg-white rounded-xl p-4 mb-3"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 4,
              elevation: 2,
            }}
            onPress={() =>
              router.push(`/news/${item.id}`)
            }
          >
            <View className="flex-row items-center mb-1">
              <View
                style={{
                  backgroundColor:
                    colors.categories.news + '20',
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderRadius: 8,
                }}
              >
                <Text
                  style={{
                    color: colors.categories.news,
                    fontSize: 11,
                    fontWeight: '600',
                  }}
                >
                  {item.category || 'Gündem'}
                </Text>
              </View>
            </View>
            <Text
              className="text-base font-semibold"
              numberOfLines={2}
            >
              {item.title}
            </Text>
            {item.summary && (
              <Text
                className="text-gray-500 text-sm mt-1"
                numberOfLines={1}
              >
                {item.summary}
              </Text>
            )}
          </TouchableOpacity>
        )
      )}

      {/* Tourism shortcut */}
      <TouchableOpacity
        style={{ backgroundColor: colors.secondary }}
        className="rounded-2xl p-4 mt-2 mb-4"
        onPress={() => router.push('/tourism')}
        accessibilityLabel="Tarih ve turizm"
      >
        <Text className="text-white text-lg font-bold">
          Bitlis'i Keşfet
        </Text>
        <Text className="text-white opacity-80 mt-1">
          Nemrut Gölü, Ahlat Mezarlığı, Bitlis Kalesi...
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
