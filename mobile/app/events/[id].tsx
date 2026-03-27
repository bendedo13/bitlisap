import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/theme';
import { api } from '../../services/api';

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data, isLoading } = useQuery({
    queryKey: ['event', id],
    queryFn: () => api.get(`/events/${id}`),
  });

  const attendMutation = useMutation({
    mutationFn: () =>
      api.post(`/events/${id}/attend`),
    onSuccess: () =>
      Alert.alert('Başarılı', 'Katılımınız kaydedildi!'),
    onError: () =>
      Alert.alert('Hata', 'Katılım kaydedilemedi'),
  });

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

  const event = data?.data;
  if (!event) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-gray-400">
          Etkinlik bulunamadı
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1 p-4">
        <Text className="text-2xl font-bold mb-2">
          {event.title}
        </Text>

        <View className="flex-row items-center mb-4">
          <Ionicons
            name="calendar"
            size={18}
            color={colors.primary}
          />
          <Text className="ml-2 text-gray-600">
            {new Date(
              event.startsAt
            ).toLocaleDateString('tr-TR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </Text>
        </View>

        {event.location && (
          <View className="flex-row items-center mb-4">
            <Ionicons
              name="location"
              size={18}
              color={colors.primary}
            />
            <Text className="ml-2 text-gray-600">
              {event.location}
            </Text>
          </View>
        )}

        <View className="flex-row items-center mb-4">
          <Ionicons
            name="people"
            size={18}
            color={colors.primary}
          />
          <Text className="ml-2 text-gray-600">
            {event.attendeeCount} katılımcı
            {event.maxAttendees &&
              ` / ${event.maxAttendees} kapasite`}
          </Text>
        </View>

        {event.description && (
          <Text className="text-gray-600 leading-6 mt-2">
            {event.description}
          </Text>
        )}
      </ScrollView>

      <View className="p-4 border-t border-gray-100">
        <TouchableOpacity
          style={{ backgroundColor: colors.primary }}
          className="rounded-xl py-4 items-center"
          onPress={() => attendMutation.mutate()}
          disabled={attendMutation.isPending}
          accessibilityLabel="Katıl"
        >
          <Text className="text-white text-lg font-semibold">
            {event.isFree
              ? 'Katıl (Ücretsiz)'
              : `Katıl (${event.ticketPrice} ₺)`}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
