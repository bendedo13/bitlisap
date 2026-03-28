import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { EmptyState } from '../../components/EmptyState';
import { NewsListSkeleton } from '../../components/SkeletonList';
import { router } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { useInfiniteQuery } from '@tanstack/react-query';
import { colors } from '../../constants/theme';
import { newsService } from '../../services/news.service';
import { NEWS_CATEGORIES } from '../../constants/districts';

interface NewsItem {
  id: string;
  title: string;
  summary: string | null;
  category: string | null;
  thumbnailUrl: string | null;
  viewCount: number;
  publishedAt: string;
}

function CategoryChips({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (cat: string) => void;
}) {
  return (
    <View className="flex-row px-4 py-3">
      {NEWS_CATEGORIES.map((cat) => (
        <TouchableOpacity
          key={cat}
          onPress={() => onSelect(cat)}
          style={{
            backgroundColor:
              selected === cat
                ? colors.primary
                : '#F2F2F7',
            borderRadius: 20,
            paddingHorizontal: 14,
            paddingVertical: 6,
            marginRight: 8,
          }}
          accessibilityLabel={`Kategori: ${cat}`}
        >
          <Text
            style={{
              color:
                selected === cat ? '#fff' : '#666',
              fontSize: 13,
              fontWeight: '500',
            }}
          >
            {cat}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function NewsCard({ item }: { item: NewsItem }) {
  const timeAgo = getTimeAgo(item.publishedAt);

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
      onPress={() => router.push(`/news/${item.id}`)}
    >
      {item.category && (
        <View
          style={{
            backgroundColor:
              colors.categories.news + '15',
            paddingHorizontal: 8,
            paddingVertical: 2,
            borderRadius: 8,
            alignSelf: 'flex-start',
            marginBottom: 6,
          }}
        >
          <Text
            style={{
              color: colors.categories.news,
              fontSize: 11,
              fontWeight: '600',
            }}
          >
            {item.category}
          </Text>
        </View>
      )}
      <Text
        className="text-base font-semibold"
        numberOfLines={2}
      >
        {item.title}
      </Text>
      {item.summary && (
        <Text
          className="text-gray-500 text-sm mt-1"
          numberOfLines={2}
        >
          {item.summary}
        </Text>
      )}
      <View className="flex-row items-center mt-2">
        <Text className="text-gray-400 text-xs">
          {timeAgo}
        </Text>
        <Text className="text-gray-300 mx-2">·</Text>
        <Text className="text-gray-400 text-xs">
          {item.viewCount} görüntülenme
        </Text>
      </View>
    </TouchableOpacity>
  );
}

function getTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} dk önce`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} saat önce`;
  const days = Math.floor(hours / 24);
  return `${days} gün önce`;
}

export default function NewsScreen() {
  const [category, setCategory] = useState('Tümü');

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['news', category],
    queryFn: ({ pageParam = 1 }) =>
      newsService.getAll({
        page: pageParam,
        category:
          category === 'Tümü' ? undefined : category,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } =
        lastPage.data.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
  });

  const allNews =
    data?.pages.flatMap((p) => p.data.data) ?? [];

  return (
    <View className="flex-1 bg-gray-50">
      <CategoryChips
        selected={category}
        onSelect={setCategory}
      />

      {isLoading ? (
        <NewsListSkeleton />
      ) : allNews.length === 0 ? (
        <EmptyState
          icon="newspaper-outline"
          title="Henüz haber yok"
          subtitle="Yakında şehrinizden haberler burada görünecek. Aşağı çekerek yenileyebilirsiniz."
        />
      ) : (
        <FlashList
          data={allNews}
          renderItem={({ item }) => (
            <NewsCard item={item} />
          )}
          estimatedItemSize={120}
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
    </View>
  );
}
