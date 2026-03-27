import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/theme';
import { api } from '../../services/api';

interface Event {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  startsAt: string;
  category: string | null;
  isFree: boolean;
  ticketPrice: number | null;
  attendeeCount: number;
}

export default function EventsScreen() {
  const { data, isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: () => api.get('/events'),
  });

  const events: Event[] = data?.data?.data ?? [];

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator
          size="large"
          color={colors.primary}
        />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {events.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Ionicons
            name="calendar-outline"
            size={48}
            color="#ccc"
          />
          <Text className="text-gray-400 mt-2">
            Yaklaşan etkinlik yok
          </Text>
        </View>
      ) : (
        <FlashList
          data={events}
          estimatedItemSize={120}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="bg-white rounded-xl p-4 mb-3"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 3,
                elevation: 1,
              }}
              onPress={() =>
                router.push(`/events/${item.id}`)
              }
            >
              <View className="flex-row items-center mb-2">
                {item.category && (
                  <View
                    style={{
                      backgroundColor:
                        colors.categories.events +
                        '15',
                      paddingHorizontal: 8,
                      paddingVertical: 2,
                      borderRadius: 8,
                    }}
                  >
                    <Text
                      style={{
                        color:
                          colors.categories.events,
                        fontSize: 11,
                        fontWeight: '600',
                      }}
                    >
                      {item.category}
                    </Text>
                  </View>
                )}
                {item.isFree ? (
                  <Text
                    style={{ color: colors.accent }}
                    className="text-xs font-semibold ml-2"
                  >
                    Ücretsiz
                  </Text>
                ) : (
                  <Text className="text-gray-500 text-xs ml-2">
                    {item.ticketPrice} ₺
                  </Text>
                )}
              </View>
              <Text className="text-base font-semibold">
                {item.title}
              </Text>
              <View className="flex-row items-center mt-2">
                <Ionicons
                  name="calendar-outline"
                  size={14}
                  color="#999"
                />
                <Text className="text-gray-400 text-xs ml-1">
                  {new Date(
                    item.startsAt
                  ).toLocaleDateString('tr-TR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </Text>
                {item.location && (
                  <>
                    <Ionicons
                      name="location-outline"
                      size={14}
                      color="#999"
                      style={{ marginLeft: 8 }}
                    />
                    <Text className="text-gray-400 text-xs ml-1">
                      {item.location}
                    </Text>
                  </>
                )}
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}
