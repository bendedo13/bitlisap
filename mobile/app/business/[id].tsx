import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/theme';
import { businessService } from '../../services/business.service';

export default function BusinessDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data, isLoading } = useQuery({
    queryKey: ['business', id],
    queryFn: () => businessService.getById(id),
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

  const biz = data?.data;
  if (!biz) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-gray-400">
          İşletme bulunamadı
        </Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white">
      {/* Header */}
      <View
        style={{ backgroundColor: colors.primary }}
        className="px-4 py-6"
      >
        <Text className="text-white text-2xl font-bold">
          {biz.name}
        </Text>
        <View className="flex-row items-center mt-2">
          {biz.category && (
            <Text className="text-white/80 mr-3">
              {biz.category}
            </Text>
          )}
          {biz.rating > 0 && (
            <View className="flex-row items-center">
              <Ionicons
                name="star"
                size={16}
                color="#FFD700"
              />
              <Text className="text-white ml-1">
                {Number(biz.rating).toFixed(1)}
              </Text>
              <Text className="text-white/60 ml-1">
                ({biz.reviewCount} yorum)
              </Text>
            </View>
          )}
        </View>
      </View>

      <View className="p-4">
        {biz.description && (
          <Text className="text-gray-600 leading-6 mb-4">
            {biz.description}
          </Text>
        )}

        {/* Info */}
        <View className="bg-gray-50 rounded-xl p-4 mb-4">
          {biz.address && (
            <View className="flex-row items-center mb-3">
              <Ionicons
                name="location"
                size={18}
                color={colors.primary}
              />
              <Text className="text-gray-600 ml-2 flex-1">
                {biz.address}
              </Text>
            </View>
          )}
          {biz.district && (
            <View className="flex-row items-center mb-3">
              <Ionicons
                name="flag"
                size={18}
                color={colors.primary}
              />
              <Text className="text-gray-600 ml-2">
                {biz.district}
              </Text>
            </View>
          )}
          {biz.phone && (
            <TouchableOpacity
              className="flex-row items-center mb-3"
              onPress={() =>
                Linking.openURL(`tel:${biz.phone}`)
              }
              accessibilityLabel="Ara"
            >
              <Ionicons
                name="call"
                size={18}
                color={colors.accent}
              />
              <Text
                style={{ color: colors.accent }}
                className="ml-2"
              >
                {biz.phone}
              </Text>
            </TouchableOpacity>
          )}
          {biz.website && (
            <TouchableOpacity
              className="flex-row items-center"
              onPress={() =>
                Linking.openURL(biz.website)
              }
              accessibilityLabel="Web sitesi"
            >
              <Ionicons
                name="globe"
                size={18}
                color={colors.primaryLight}
              />
              <Text
                style={{
                  color: colors.primaryLight,
                }}
                className="ml-2"
              >
                {biz.website}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Reviews */}
        <Text className="text-lg font-bold mb-3">
          Yorumlar
        </Text>
        {biz.reviews?.length > 0 ? (
          biz.reviews.map(
            (review: {
              id: string;
              rating: number;
              comment: string;
              user: {
                fullName: string;
              };
              createdAt: string;
            }) => (
              <View
                key={review.id}
                className="bg-gray-50 rounded-xl p-3 mb-2"
              >
                <View className="flex-row items-center mb-1">
                  <Text className="font-semibold">
                    {review.user?.fullName || 'Anonim'}
                  </Text>
                  <View className="flex-row ml-2">
                    {Array.from({
                      length: review.rating,
                    }).map((_, i) => (
                      <Ionicons
                        key={i}
                        name="star"
                        size={12}
                        color={colors.warning}
                      />
                    ))}
                  </View>
                </View>
                {review.comment && (
                  <Text className="text-gray-600 text-sm">
                    {review.comment}
                  </Text>
                )}
              </View>
            )
          )
        ) : (
          <Text className="text-gray-400">
            Henüz yorum yok
          </Text>
        )}
      </View>
    </ScrollView>
  );
}
