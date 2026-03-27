import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/theme';
import { newsService } from '../../services/news.service';

export default function NewsDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data, isLoading } = useQuery({
    queryKey: ['news', id],
    queryFn: () => newsService.getById(id),
  });

  const likeMutation = useMutation({
    mutationFn: () => newsService.like(id),
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

  const news = data?.data;
  if (!news) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-gray-400">
          Haber bulunamadı
        </Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-4">
        {news.category && (
          <View
            style={{
              backgroundColor:
                colors.categories.news + '15',
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 8,
              alignSelf: 'flex-start',
              marginBottom: 8,
            }}
          >
            <Text
              style={{
                color: colors.categories.news,
                fontWeight: '600',
                fontSize: 12,
              }}
            >
              {news.category}
            </Text>
          </View>
        )}

        <Text className="text-2xl font-bold mb-2">
          {news.title}
        </Text>

        <View className="flex-row items-center mb-4">
          <Text className="text-gray-400 text-sm">
            {new Date(
              news.publishedAt
            ).toLocaleDateString('tr-TR')}
          </Text>
          <Text className="text-gray-300 mx-2">·</Text>
          <Text className="text-gray-400 text-sm">
            {news.viewCount} görüntülenme
          </Text>
          {news.isOfficial && (
            <View className="flex-row items-center ml-2">
              <Ionicons
                name="checkmark-circle"
                size={14}
                color={colors.accent}
              />
              <Text
                style={{ color: colors.accent }}
                className="text-xs ml-1"
              >
                Resmi
              </Text>
            </View>
          )}
        </View>

        {news.summary && (
          <Text className="text-gray-600 text-base mb-4 italic">
            {news.summary}
          </Text>
        )}

        <Text className="text-base leading-7">
          {news.content}
        </Text>

        {/* Like button */}
        <TouchableOpacity
          className="flex-row items-center mt-6 py-3"
          onPress={() => likeMutation.mutate()}
          accessibilityLabel="Beğen"
        >
          <Ionicons
            name="heart-outline"
            size={24}
            color={colors.danger}
          />
          <Text className="text-gray-600 ml-2">
            {news.likeCount +
              (likeMutation.isSuccess ? 1 : 0)}{' '}
            beğeni
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
