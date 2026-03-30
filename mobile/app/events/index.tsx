import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useInfiniteQuery } from '@tanstack/react-query';
import { FlashList } from '@shopify/flash-list';
import { eventService } from '../../services/eventService';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';

const CATEGORIES = [
  { key: '', label: 'Tümü' },
  { key: 'CULTURE', label: 'Kültür' },
  { key: 'SPORTS', label: 'Spor' },
  { key: 'MUSIC', label: 'Müzik' },
  { key: 'EDUCATION', label: 'Eğitim' },
  { key: 'FAIR', label: 'Fuar' },
  { key: 'OTHER', label: 'Diğer' },
];

const CAT_COLORS: Record<string, { bg: string; text: string }> = {
  CULTURE: { bg: Colors.stone[50], text: Colors.stone[600] },
  SPORTS: { bg: Colors.primary[50], text: Colors.primary[600] },
  MUSIC: { bg: Colors.purple[100], text: Colors.purple[600] },
  EDUCATION: { bg: Colors.forest[100], text: Colors.forest[600] },
  FAIR: { bg: Colors.gold[200], text: Colors.gold[600] },
  OTHER: { bg: Colors.gray[100], text: Colors.gray[600] },
  default: { bg: Colors.primary[50], text: Colors.primary[600] },
};

function formatEventDate(dateStr: string) {
  const d = new Date(dateStr);
  return {
    day: d.getDate().toString(),
    month: d.toLocaleDateString('tr-TR', { month: 'short' }),
    time: d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
  };
}

function EventCard({ item, onPress }: { item: any; onPress: () => void }) {
  const dt = formatEventDate(item.startDate);
  const catColor = CAT_COLORS[item.category] || CAT_COLORS.default;
  return (
    <TouchableOpacity style={styles.eventCard} onPress={onPress} activeOpacity={0.88}>
      {/* Date Badge */}
      <View style={styles.dateBadge}>
        <Text style={styles.dateDay}>{dt.day}</Text>
        <Text style={styles.dateMonth}>{dt.month}</Text>
      </View>
      {/* Content */}
      <View style={styles.cardContent}>
        <View style={styles.cardTop}>
          <Badge label={item.category || 'Etkinlik'} color={catColor.bg} textColor={catColor.text} size="sm" />
          {item.isFree ? (
            <Badge label="ÜCRETSİZ" color={Colors.forest[100]} textColor={Colors.forest[600]} size="sm" />
          ) : (
            <Badge label={`${item.price} ₺`} color={Colors.gold[200]} textColor={Colors.gold[600]} size="sm" />
          )}
        </View>
        <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
        <View style={styles.cardMeta}>
          <Ionicons name="time-outline" size={12} color={Colors.textMuted} />
          <Text style={styles.cardMetaText}>{dt.time}</Text>
          <View style={styles.dot} />
          <Ionicons name="location-outline" size={12} color={Colors.textMuted} />
          <Text style={styles.cardMetaText} numberOfLines={1}>{item.location || 'Bitlis'}</Text>
        </View>
        {item.attendeeCount > 0 && (
          <View style={styles.attendees}>
            <Ionicons name="people-outline" size={12} color={Colors.primary[400]} />
            <Text style={styles.attendeesText}>{item.attendeeCount} katılımcı</Text>
          </View>
        )}
      </View>
      <Ionicons name="chevron-forward" size={16} color={Colors.gray[300]} />
    </TouchableOpacity>
  );
}

export default function EventsScreen() {
  const router = useRouter();
  const [category, setCategory] = useState('');

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
    queryKey: ['events', category],
    queryFn: ({ pageParam = 1 }) =>
      eventService.getAll({ page: pageParam as number, limit: 15, category: category || undefined }),
    getNextPageParam: (last: any) =>
      last.pagination?.page < last.pagination?.totalPages ? last.pagination.page + 1 : undefined,
    initialPageParam: 1,
  });

  const allEvents = data?.pages.flatMap((p: any) => p.events ?? []) ?? [];

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.hero}>
        <View style={styles.heroCircle} />
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={Colors.white} />
        </TouchableOpacity>
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>Etkinlikler</Text>
          <Text style={styles.heroSub}>Bitlis'teki tüm etkinlikleri takip edin</Text>
        </View>
      </View>

      {/* Category Filter */}
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
                style={[styles.chip, active && { backgroundColor: Colors.purple[500] }]}
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

      {isLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator color={Colors.purple[500]} size="large" />
        </View>
      ) : allEvents.length === 0 ? (
        <EmptyState icon="calendar-outline" title="Etkinlik bulunamadı" iconColor={Colors.purple[400]} />
      ) : (
        <FlashList
          data={allEvents}
          estimatedItemSize={110}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100, paddingTop: 4 }}
          renderItem={({ item }) => (
            <EventCard item={item} onPress={() => router.push(`/events/${item.id}` as any)} />
          )}
          keyExtractor={(item: any) => item.id}
          onEndReached={() => hasNextPage && !isFetchingNextPage && fetchNextPage()}
          onEndReachedThreshold={0.4}
          ListFooterComponent={isFetchingNextPage ? <ActivityIndicator style={{ margin: 20 }} color={Colors.purple[400]} /> : null}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },

  hero: {
    backgroundColor: Colors.purple[600],
    paddingTop: (StatusBar.currentHeight || 44) + 8,
    paddingBottom: Spacing.xl,
    overflow: 'hidden',
  },
  heroCircle: {
    position: 'absolute', width: 180, height: 180, borderRadius: 90,
    backgroundColor: Colors.purple[500], opacity: 0.3, top: -50, right: -40,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
    marginHorizontal: Spacing.lg, marginBottom: Spacing.md,
  },
  heroContent: { paddingHorizontal: Spacing.lg },
  heroTitle: { ...Typography.h2, color: Colors.white, marginBottom: 4 },
  heroSub: { ...Typography.body, color: 'rgba(255,255,255,0.65)' },

  categoryWrap: { backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.border },
  chip: {
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: BorderRadius.full,
    marginRight: Spacing.sm, backgroundColor: Colors.gray[100],
  },
  chipText: { ...Typography.btnSm },

  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  eventCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.lg, marginTop: Spacing.sm,
    borderRadius: BorderRadius.lg, padding: Spacing.md, gap: Spacing.md, ...Shadows.sm,
  },
  dateBadge: {
    width: 52, alignItems: 'center',
    backgroundColor: Colors.purple[50], borderRadius: BorderRadius.md,
    padding: 8,
  },
  dateDay: { fontSize: 22, fontWeight: '800', color: Colors.purple[600] },
  dateMonth: { ...Typography.label, color: Colors.purple[500], textTransform: 'uppercase' },
  cardContent: { flex: 1, gap: 5 },
  cardTop: { flexDirection: 'row', gap: 6 },
  cardTitle: { ...Typography.h4, color: Colors.textPrimary, lineHeight: 20 },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  cardMetaText: { ...Typography.caption, color: Colors.textMuted, flex: 1 },
  dot: { width: 3, height: 3, borderRadius: 2, backgroundColor: Colors.gray[300] },
  attendees: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  attendeesText: { ...Typography.caption, color: Colors.primary[500] },
});
