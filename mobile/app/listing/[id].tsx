import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/theme';
import { listingService } from '../../services/listing.service';

export default function ListingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data, isLoading } = useQuery({
    queryKey: ['listing', id],
    queryFn: () => listingService.getById(id),
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

  const listing = data?.data;
  if (!listing) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-gray-400">
          İlan bulunamadı
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1">
        {/* Photo placeholder */}
        <View className="h-56 bg-gray-100 items-center justify-center">
          <Ionicons
            name="image-outline"
            size={48}
            color="#ccc"
          />
        </View>

        <View className="p-4">
          {listing.isPremium && (
            <View className="flex-row items-center mb-2">
              <Ionicons
                name="star"
                size={14}
                color={colors.warning}
              />
              <Text
                style={{ color: colors.warning }}
                className="text-xs ml-1 font-semibold"
              >
                Öne Çıkan İlan
              </Text>
            </View>
          )}

          <Text className="text-2xl font-bold">
            {listing.title}
          </Text>

          {listing.price != null && (
            <Text
              style={{ color: colors.accent }}
              className="text-2xl font-bold mt-2"
            >
              {Number(listing.price).toLocaleString(
                'tr-TR'
              )}{' '}
              ₺
              {listing.isNegotiable && (
                <Text className="text-sm text-gray-400">
                  {' '}
                  (Pazarlık payı var)
                </Text>
              )}
            </Text>
          )}

          <View className="flex-row items-center mt-3">
            {listing.district && (
              <View className="flex-row items-center mr-4">
                <Ionicons
                  name="location-outline"
                  size={16}
                  color="#999"
                />
                <Text className="text-gray-500 ml-1">
                  {listing.district}
                </Text>
              </View>
            )}
            <View className="flex-row items-center">
              <Ionicons
                name="eye-outline"
                size={16}
                color="#999"
              />
              <Text className="text-gray-500 ml-1">
                {listing.viewCount} görüntülenme
              </Text>
            </View>
          </View>

          <View className="border-t border-gray-100 mt-4 pt-4">
            <Text className="text-base font-semibold mb-2">
              Açıklama
            </Text>
            <Text className="text-gray-600 leading-6">
              {listing.description || 'Açıklama yok'}
            </Text>
          </View>

          {/* Seller info */}
          {listing.seller && (
            <View className="border-t border-gray-100 mt-4 pt-4">
              <Text className="text-base font-semibold mb-2">
                İlan Sahibi
              </Text>
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center">
                  <Ionicons
                    name="person"
                    size={20}
                    color="#999"
                  />
                </View>
                <View className="ml-3">
                  <Text className="font-semibold">
                    {listing.seller.fullName ||
                      'İsimsiz'}
                  </Text>
                  <Text className="text-gray-400 text-xs">
                    {listing.seller.district}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom bar */}
      <View className="flex-row p-4 border-t border-gray-100">
        {listing.seller?.phone && (
          <TouchableOpacity
            style={{
              backgroundColor: colors.accent,
            }}
            className="flex-1 rounded-xl py-3 items-center mr-2"
            onPress={() =>
              Linking.openURL(
                `tel:${listing.seller.phone}`
              )
            }
            accessibilityLabel="Ara"
          >
            <View className="flex-row items-center">
              <Ionicons
                name="call"
                size={18}
                color="white"
              />
              <Text className="text-white font-semibold ml-2">
                Ara
              </Text>
            </View>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={{ backgroundColor: colors.primary }}
          className="flex-1 rounded-xl py-3 items-center"
          onPress={() =>
            router.push(`/listing/chat/${id}`)
          }
          accessibilityLabel="Mesaj gönder"
        >
          <View className="flex-row items-center">
            <Ionicons
              name="chatbubble"
              size={18}
              color="white"
            />
            <Text className="text-white font-semibold ml-2">
              Mesaj
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
