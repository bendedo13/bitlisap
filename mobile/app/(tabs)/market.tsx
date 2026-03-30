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
import { listingService } from '../../services/listingService';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';

const CATEGORIES = [
  { key: '', label: 'Tümü', icon: 'apps-outline' as const, color: Colors.primary[600] },
  { key: 'ELECTRONICS', label: 'Elektronik', icon: 'phone-portrait-outline' as const, color: Colors.primary[500] },
  { key: 'VEHICLES', label: 'Araçlar', icon: 'car-outline' as const, color: Colors.sunset[500] },
  { key: 'REAL_ESTATE', label: 'Emlak', icon: 'home-outline' as const, color: Colors.forest[500] },
  { key: 'CLOTHES', label: 'Giyim', icon: 'shirt-outline' as const, color: Colors.purple[500] },
  { key: 'FOOD', label: 'Yiyecek', icon: 'fast-food-outline' as const, color: Colors.gold[600] },
  { key: 'SERVICES', label: 'Hizmetler', icon: 'construct-outline' as const, color: Colors.stone[600] },
  { key: 'OTHER', label: 'Diğer', icon: 'ellipsis-horizontal-outline' as const, color: Colors.gray[500] },
];

function timeAgo(dateStr: string) {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 3600) return `${Math.floor(diff / 60)}dk önce`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}sa önce`;
  return `${Math.floor(diff / 86400)}g önce`;
}

function ListingCard({ item, onPress }: { item: any; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.88}>
      <View style={styles.cardThumb}>
        <Ionicons name="pricetag" size={28} color={Colors.primary[300]} />
        {item.isPremium && (
          <View style={styles.premiumBadge}>
            <Ionicons name="star" size={10} color={Colors.gold[400]} />
          </View>
        )}
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
        <View style={styles.cardRow}>
          <Ionicons name="location-outline" size={12} color={Colors.textMuted} />
          <Text style={styles.cardMeta}>{item.district || 'Bitlis'}</Text>
          <View style={styles.dot} />
          <Text style={styles.cardMeta}>{timeAgo(item.createdAt)}</Text>
        </View>
        {item.price != null && (
          <Text style={styles.cardPrice}>
            {item.isNegotiable ? '~' : ''}{item.price.toLocaleString('tr-TR')} ₺
          </Text>
        )}
      </View>
      <Ionicons name="chevron-forward" size={16} color={Colors.gray[300]} />
    </TouchableOpacity>
  );
}

export default function MarketScreen() {
  const router = useRouter();
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
    queryKey: ['listings', category],
    queryFn: ({ pageParam = 1 }) =>
      listingService.getAll({ page: pageParam as number, limit: 15, category: category || undefined }),
    getNextPageParam: (last: any) =>
      last.pagination?.page < last.pagination?.totalPages ? last.pagination.page + 1 : undefined,
    initialPageParam: 1,
  });

  const allListings = data?.pages.flatMap((p: any) => p.listings ?? []) ?? [];
  const filtered = search
    ? allListings.filter((l: any) => l.title.toLowerCase().includes(search.toLowerCase()))
    : allListings;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.forest[500]} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerCircle} />
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>Bitlis Pazarı</Text>
            <Text style={styles.headerSub}>Alın, satın, takas edin</Text>
          </View>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => router.push('/listing/create' as any)}
            activeOpacity={0.85}
          >
            <Ionicons name="add" size={22} color={Colors.white} />
          </TouchableOpacity>
        </View>
        {/* Search */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={16} color={Colors.gray[400]} />
          <TextInput
            style={styles.searchInput}
            placeholder="İlan ara..."
            placeholderTextColor={Colors.gray[400]}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      {/* Category Scroll */}
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
                style={[styles.chip, active && { backgroundColor: cat.color }]}
                onPress={() => setCategory(cat.key)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={cat.icon}
                  size={14}
                  color={active ? Colors.white : Colors.textMuted}
                />
                <Text style={[styles.chipText, { color: active ? Colors.white : Colors.textSecondary }]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          }}
          keyExtractor={(c) => c.key}
        />
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <Text style={styles.statsText}>
          <Text style={{ color: Colors.forest[500], fontWeight: '700' }}>{filtered.length}</Text> ilan listelendi
        </Text>
        <TouchableOpacity style={styles.sortBtn} activeOpacity={0.8}>
          <Ionicons name="funnel-outline" size={14} color={Colors.textSecondary} />
          <Text style={styles.sortText}>Sırala</Text>
        </TouchableOpacity>
      </View>

      {/* Listing List */}
      {isLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator color={Colors.forest[500]} size="large" />
        </View>
      ) : filtered.length === 0 ? (
        <EmptyState icon="pricetag-outline" title="İlan bulunamadı" description="Farklı bir kategori seçin veya ilk ilanı siz ekleyin." iconColor={Colors.forest[400]}>
          <TouchableOpacity style={styles.emptyAddBtn} onPress={() => router.push('/listing/create' as any)}>
            <Ionicons name="add" size={18} color={Colors.white} />
            <Text style={styles.emptyAddText}>İlan Ekle</Text>
          </TouchableOpacity>
        </EmptyState>
      ) : (
        <FlashList
          data={filtered}
          estimatedItemSize={100}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100, paddingTop: 4 }}
          renderItem={({ item }) => (
            <ListingCard item={item} onPress={() => router.push(`/listing/${item.id}` as any)} />
          )}
          keyExtractor={(item: any) => item.id}
          onEndReached={() => hasNextPage && !isFetchingNextPage && fetchNextPage()}
          onEndReachedThreshold={0.4}
          ListFooterComponent={isFetchingNextPage ? <ActivityIndicator style={{ margin: 20 }} color={Colors.forest[400]} /> : null}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },

  header: {
    backgroundColor: Colors.forest[500],
    paddingTop: (StatusBar.currentHeight || 44) + 8,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    overflow: 'hidden',
  },
  headerCircle: {
    position: 'absolute', width: 180, height: 180, borderRadius: 90,
    backgroundColor: Colors.forest[400], opacity: 0.3, top: -50, right: -40,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.md },
  headerTitle: { ...Typography.h2, color: Colors.white, marginBottom: 2 },
  headerSub: { ...Typography.caption, color: 'rgba(255,255,255,0.6)' },
  addBtn: {
    width: 44, height: 44, borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.3)',
  },
  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.white, borderRadius: BorderRadius.xl,
    paddingHorizontal: 14, height: 44, gap: 8,
  },
  searchInput: { flex: 1, ...Typography.body, color: Colors.textPrimary },

  categoryWrap: { backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.border },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 12, paddingVertical: 7, borderRadius: BorderRadius.full,
    marginRight: Spacing.sm, backgroundColor: Colors.gray[100],
  },
  chipText: { ...Typography.btnSm },

  statsRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm,
  },
  statsText: { ...Typography.bodySm, color: Colors.textMuted },
  sortBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 10, paddingVertical: 5,
    backgroundColor: Colors.white, borderRadius: BorderRadius.md,
    borderWidth: 1, borderColor: Colors.border,
  },
  sortText: { ...Typography.label, color: Colors.textSecondary },

  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  card: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.lg, marginTop: Spacing.sm,
    borderRadius: BorderRadius.lg, padding: Spacing.md, gap: Spacing.md, ...Shadows.sm,
  },
  cardThumb: {
    width: 64, height: 64, borderRadius: BorderRadius.md,
    backgroundColor: Colors.primary[50], alignItems: 'center', justifyContent: 'center',
  },
  premiumBadge: {
    position: 'absolute', top: 4, right: 4,
    width: 18, height: 18, borderRadius: 9,
    backgroundColor: Colors.gold[400], alignItems: 'center', justifyContent: 'center',
  },
  cardBody: { flex: 1, gap: 4 },
  cardTitle: { ...Typography.h4, color: Colors.textPrimary, lineHeight: 20 },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  cardMeta: { ...Typography.caption, color: Colors.textMuted },
  cardPrice: { ...Typography.h4, color: Colors.forest[500] },
  dot: { width: 3, height: 3, borderRadius: 2, backgroundColor: Colors.gray[300] },

  emptyAddBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.forest[500], borderRadius: BorderRadius.lg,
    paddingVertical: 12, justifyContent: 'center',
  },
  emptyAddText: { ...Typography.btn, color: Colors.white },
});
