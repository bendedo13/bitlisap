import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/theme';
import { listingService } from '../../services/listing.service';
import { LISTING_CATEGORIES } from '../../constants/districts';

interface Listing {
  id: string;
  title: string;
  price: number | null;
  district: string | null;
  category: string | null;
  photos: string[];
  isPremium: boolean;
  createdAt: string;
}

function CategoryGrid({
  onSelect,
}: {
  onSelect: (cat: string) => void;
}) {
  return (
    <View className="flex-row flex-wrap px-4 py-3 gap-2">
      {LISTING_CATEGORIES.map((cat) => (
        <TouchableOpacity
          key={cat.key}
          onPress={() => onSelect(cat.key)}
          className="items-center bg-white rounded-xl p-3"
          style={{ width: '22%' }}
          accessibilityLabel={cat.label}
        >
          <Ionicons
            name={cat.icon as keyof typeof Ionicons.glyphMap}
            size={24}
            color={colors.accent}
          />
          <Text className="text-xs mt-1 text-gray-600">
            {cat.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function ListingCard({ item }: { item: Listing }) {
  return (
    <TouchableOpacity
      className="bg-white mx-4 mb-3 rounded-xl p-4"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
      }}
      onPress={() =>
        router.push(`/listing/${item.id}`)
      }
    >
      <View className="flex-row justify-between items-start">
        <View className="flex-1 mr-3">
          {item.isPremium && (
            <View className="flex-row items-center mb-1">
              <Ionicons
                name="star"
                size={12}
                color={colors.warning}
              />
              <Text
                style={{ color: colors.warning }}
                className="text-xs ml-1 font-semibold"
              >
                Öne Çıkan
              </Text>
            </View>
          )}
          <Text
            className="text-base font-semibold"
            numberOfLines={2}
          >
            {item.title}
          </Text>
          {item.district && (
            <View className="flex-row items-center mt-1">
              <Ionicons
                name="location-outline"
                size={12}
                color="#999"
              />
              <Text className="text-gray-400 text-xs ml-1">
                {item.district}
              </Text>
            </View>
          )}
        </View>
        {item.price != null && (
          <Text
            style={{ color: colors.accent }}
            className="text-lg font-bold"
          >
            {item.price.toLocaleString('tr-TR')} ₺
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

export default function MarketScreen() {
  const [category, setCategory] = useState<
    string | undefined
  >();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['listings', category],
    queryFn: ({ pageParam = 1 }) =>
      listingService.getAll({
        page: pageParam,
        category,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } =
        lastPage.data.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
  });

  const allListings =
    data?.pages.flatMap((p) => p.data.data) ?? [];

  return (
    <View className="flex-1 bg-gray-50">
      {!category && (
        <CategoryGrid onSelect={setCategory} />
      )}

      {category && (
        <TouchableOpacity
          className="flex-row items-center px-4 py-2"
          onPress={() => setCategory(undefined)}
          accessibilityLabel="Kategorilere dön"
        >
          <Ionicons
            name="arrow-back"
            size={18}
            color={colors.primary}
          />
          <Text
            style={{ color: colors.primary }}
            className="ml-1"
          >
            Tüm Kategoriler
          </Text>
        </TouchableOpacity>
      )}

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator
            size="large"
            color={colors.primary}
          />
        </View>
      ) : allListings.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Ionicons
            name="pricetag-outline"
            size={48}
            color="#ccc"
          />
          <Text className="text-gray-400 text-base mt-2">
            Henüz ilan yok
          </Text>
        </View>
      ) : (
        <FlashList
          data={allListings}
          renderItem={({ item }) => (
            <ListingCard item={item} />
          )}
          estimatedItemSize={100}
          onEndReached={() => {
            if (hasNextPage) fetchNextPage();
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetchingNextPage ? (
              <ActivityIndicator
                className="py-4"
                color={colors.primary}
              />
            ) : null
          }
        />
      )}

      {/* FAB - İlan Ver */}
      <TouchableOpacity
        style={{ backgroundColor: colors.accent }}
        className="absolute bottom-6 right-6 w-14 h-14 rounded-full items-center justify-center"
        onPress={() => router.push('/listing/create')}
        accessibilityLabel="İlan ver"
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
}
