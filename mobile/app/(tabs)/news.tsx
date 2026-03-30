import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useInfiniteQuery } from '@tanstack/react-query';
import { FlashList } from '@shopify/flash-list';
import { newsService } from '../../services/newsService';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';

const CATEGORIES = [
  { key: '', label: 'Tümü', color: Colors.primary[600], bg: Colors.primary[50] },
  { key: 'GUNDEM', label: 'Gündem', color: Colors.danger[600], bg: Colors.danger[100] },
  { key: 'EKONOMI', label: 'Ekonomi', color: Colors.forest[500], bg: Colors.forest[100] },
  { key: 'SPOR', label: 'Spor', color: Colors.sunset[500], bg: Colors.stone[50] },
  { key: 'KULTUR', label: 'Kültür', color: Colors.stone[600], bg: Colors.stone[50] },
  { key: 'EGITIM', label: 'Eğitim', color: Colors.purple[500], bg: Colors.purple[100] },
  { key: 'SAGLIK', label: 'Sağlık', color: Colors.forest[600], bg: Colors.forest[100] },
];

function timeAgo(dateStr: string) {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60) return 'az önce';
  if (diff < 3600) return `${Math.floor(diff / 60)}dk önce`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}sa önce`;
  return `${Math.floor(diff / 86400)}g önce`;
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  GUNDEM: { bg: Colors.danger[100], text: Colors.danger[700] },
  EKONOMI: { bg: Colors.forest[100], text: Colors.forest[700] },
  SPOR: { bg: Colors.stone[50], text: Colors.stone[600] },
  KULTUR: { bg: Colors.stone[50], text: Colors.stone[700] },
  EGITIM: { bg: Colors.purple[100], text: Colors.purple[600] },
  SAGLIK: { bg: Colors.forest[100], text: Colors.forest[700] },
  default: { bg: Colors.primary[50], text: Colors.primary[700] },
};

function NewsCard({ item, onPress, featured = false }: { item: any; onPress: () => void; featured?: boolean }) {
  const catColor = CATEGORY_COLORS[item.category] || CATEGORY_COLORS.default;
  if (featured) {
    return (
      <TouchableOpacity style={styles.featuredCard} onPress={onPress} activeOpacity={0.9}>
        <View style={styles.featuredBg} />
        <View style={styles.featuredOverlay} />
        <View style={styles.featuredContent}>
          <View style={styles.featuredTop}>
            <Badge label={item.category || 'Genel'} color="rgba(255,255,255,0.2)" textColor={Colors.white} />
            {item.isBreaking && <Badge label="SON DAKİKA" color={Colors.danger[600]} textColor={Colors.white} />}
          </View>
          <Text style={styles.featuredTitle} numberOfLines={3}>{item.title}</Text>
          <View style={styles.featuredMeta}>
            <Ionicons name="time-outline" size={12} color="rgba(255,255,255,0.7)" />
            <Text style={styles.featuredMetaText}>{timeAgo(item.createdAt)}</Text>
            <View style={styles.dot} />
            <Ionicons name="eye-outline" size={12} color="rgba(255,255,255,0.7)" />
            <Text style={styles.featuredMetaText}>{item.viewCount || 0}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
  return (
    <TouchableOpacity style={styles.newsCard} onPress={onPress} activeOpacity={0.88}>
      <View style={[styles.newsCardThumb, { backgroundColor: catColor.bg }]}>
        <Ionicons name="newspaper" size={24} color={catColor.text} />
      </View>
      <View style={styles.newsCardBody}>
        <Badge label={item.category || 'Genel'} color={catColor.bg} textColor={catColor.text} size="sm" />
        <Text style={styles.newsCardTitle} numberOfLines={2}>{item.title}</Text>
        <View style={styles.newsCardMeta}>
          <Ionicons name="time-outline" size={11} color={Colors.textMuted} />
          <Text style={styles.newsCardMetaText}>{timeAgo(item.createdAt)}</Text>
          <View style={styles.dot} />
          <Ionicons name="eye-outline" size={11} color={Colors.textMuted} />
          <Text style={styles.newsCardMetaText}>{item.viewCount || 0}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={16} color={Colors.gray[300]} />
    </TouchableOpacity>
  );
}

export default function NewsScreen() {
  const router = useRouter();
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
    queryKey: ['news', category],
    queryFn: ({ pageParam = 1 }) =>
      newsService.getAll({ page: pageParam as number, limit: 15, category: category || undefined }),
    getNextPageParam: (last: any) =>
      last.pagination?.page < last.pagination?.totalPages ? last.pagination.page + 1 : undefined,
    initialPageParam: 1,
  });

  const allNews = data?.pages.flatMap((p: any) => p.news ?? []) ?? [];
  const filtered = search
    ? allNews.filter((n: any) => n.title.toLowerCase().includes(search.toLowerCase()))
    : allNews;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary[800]} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerCircle} />
        <Text style={styles.headerTitle}>Haberler</Text>
        <Text style={styles.headerSub}>Bitlis'ten son dakika haberleri</Text>
        {/* Search */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={16} color={Colors.gray[400]} />
          <TextInput
            style={styles.searchInput}
            placeholder="Haber ara..."
            placeholderTextColor={Colors.gray[400]}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={16} color={Colors.gray[400]} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Category Chips */}
      <View style={styles.categoryWrap}>
        <FlashList
          data={CATEGORIES}
          horizontal
          showsHorizontalScrollIndicator={false}
          estimatedItemSize={80}
          contentContainerStyle={{ paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm }}
          renderItem={({ item: cat }) => {
            const active = category === cat.key;
            return (
              <TouchableOpacity
                style={[
                  styles.chip,
                  active
                    ? { backgroundColor: cat.color }
                    : { backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border },
                ]}
                onPress={() => setCategory(cat.key)}
                activeOpacity={0.8}
              >
                <Text style={[styles.chipText, { color: active ? Colors.white : Colors.textSecondary }]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          }}
          keyExtractor={(c) => c.key}
        />
      </View>

      {/* News List */}
      {isLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator color={Colors.primary[500]} size="large" />
          <Text style={styles.loadingText}>Haberler yükleniyor...</Text>
        </View>
      ) : filtered.length === 0 ? (
        <EmptyState icon="newspaper-outline" title="Haber bulunamadı" description="Başka bir kategori deneyin." />
      ) : (
        <FlashList
          data={filtered}
          estimatedItemSize={90}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100, paddingTop: 8 }}
          renderItem={({ item, index }) => (
            <NewsCard
              item={item}
              featured={index === 0 && !search}
              onPress={() => router.push(`/news/${item.id}` as any)}
            />
          )}
          keyExtractor={(item: any) => item.id}
          onEndReached={() => hasNextPage && !isFetchingNextPage && fetchNextPage()}
          onEndReachedThreshold={0.4}
          ListFooterComponent={isFetchingNextPage ? <ActivityIndicator style={{ margin: 20 }} color={Colors.primary[400]} /> : null}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },

  header: {
    backgroundColor: Colors.primary[800],
    paddingTop: (StatusBar.currentHeight || 44) + 8,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    overflow: 'hidden',
  },
  headerCircle: {
    position: 'absolute', width: 180, height: 180, borderRadius: 90,
    backgroundColor: Colors.primary[600], opacity: 0.25, top: -50, right: -40,
  },
  headerTitle: { ...Typography.h2, color: Colors.white, marginBottom: 4 },
  headerSub: { ...Typography.caption, color: 'rgba(255,255,255,0.55)', marginBottom: Spacing.md },
  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.white, borderRadius: BorderRadius.xl,
    paddingHorizontal: 14, height: 44, gap: 8,
  },
  searchInput: { flex: 1, ...Typography.body, color: Colors.textPrimary },

  categoryWrap: { backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.border },
  chip: {
    paddingHorizontal: 14, paddingVertical: 7,
    borderRadius: BorderRadius.full, marginRight: Spacing.sm,
  },
  chipText: { ...Typography.btnSm },

  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: { ...Typography.body, color: Colors.textMuted },

  // Featured Card
  featuredCard: {
    marginHorizontal: Spacing.lg, marginTop: Spacing.md,
    height: 220, borderRadius: BorderRadius.xl, overflow: 'hidden', ...Shadows.lg,
  },
  featuredBg: { ...StyleSheet.absoluteFillObject, backgroundColor: Colors.primary[700] },
  featuredOverlay: {
    ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.45)', zIndex: 1,
  },
  featuredContent: {
    ...StyleSheet.absoluteFillObject, zIndex: 2,
    padding: Spacing.lg, justifyContent: 'flex-end',
  },
  featuredTop: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  featuredTitle: { ...Typography.h3, color: Colors.white, marginBottom: 10 },
  featuredMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  featuredMetaText: { ...Typography.caption, color: 'rgba(255,255,255,0.7)', marginRight: 4 },

  // Regular News Card
  newsCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.white, marginHorizontal: Spacing.lg,
    marginTop: Spacing.sm, borderRadius: BorderRadius.lg,
    padding: Spacing.md, gap: Spacing.md, ...Shadows.sm,
  },
  newsCardThumb: {
    width: 60, height: 60, borderRadius: BorderRadius.md,
    alignItems: 'center', justifyContent: 'center',
  },
  newsCardBody: { flex: 1, gap: 5 },
  newsCardTitle: { ...Typography.h4, color: Colors.textPrimary, lineHeight: 20 },
  newsCardMeta: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  newsCardMetaText: { ...Typography.caption, color: Colors.textMuted, marginRight: 4 },
  dot: { width: 3, height: 3, borderRadius: 2, backgroundColor: Colors.gray[300], marginHorizontal: 2 },
});
