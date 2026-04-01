import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  TextInput,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { FlashList } from '@shopify/flash-list';
import { businessService } from '../../services/businessService';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';

const CATEGORIES = [
  { key: '', label: 'Tümü', icon: 'apps-outline' as const },
  { key: 'RESTAURANT', label: 'Restoran', icon: 'restaurant-outline' as const },
  { key: 'CAFE', label: 'Kafe', icon: 'cafe-outline' as const },
  { key: 'MARKET', label: 'Market', icon: 'cart-outline' as const },
  { key: 'HEALTH', label: 'Sağlık', icon: 'medical-outline' as const },
  { key: 'HOTEL', label: 'Otel', icon: 'bed-outline' as const },
  { key: 'TOURISM', label: 'Turizm', icon: 'compass-outline' as const },
];

const CAT_COLORS: Record<string, { bg: string; text: string }> = {
  RESTAURANT: { bg: Colors.danger[100], text: Colors.danger[600] },
  CAFE: { bg: Colors.stone[50], text: Colors.stone[600] },
  MARKET: { bg: Colors.forest[100], text: Colors.forest[600] },
  HEALTH: { bg: Colors.primary[50], text: Colors.primary[600] },
  HOTEL: { bg: Colors.purple[100], text: Colors.purple[600] },
  TOURISM: { bg: Colors.stone[50], text: Colors.stone[700] },
  default: { bg: Colors.gray[100], text: Colors.gray[600] },
};

function StarRating({ rating }: { rating: number }) {
  return (
    <View style={{ flexDirection: 'row', gap: 1 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Ionicons key={s} name={s <= Math.round(rating) ? 'star' : 'star-outline'} size={12} color={Colors.gold[400]} />
      ))}
    </View>
  );
}

function BusinessCard({ item, onPress }: { item: any; onPress: () => void }) {
  const catColor = CAT_COLORS[item.category] || CAT_COLORS.default;
  return (
    <TouchableOpacity style={styles.businessCard} onPress={onPress} activeOpacity={0.88}>
      <View style={[styles.bizThumb, { backgroundColor: catColor.bg }]}>
        <Ionicons name="storefront-outline" size={24} color={catColor.text} />
      </View>
      <View style={styles.bizBody}>
        <Text style={styles.bizName} numberOfLines={1}>{item.name}</Text>
        <Badge label={item.category || 'İşletme'} color={catColor.bg} textColor={catColor.text} size="sm" />
        <View style={styles.bizMeta}>
          <Ionicons name="location-outline" size={11} color={Colors.textMuted} />
          <Text style={styles.bizMetaText}>{item.district || 'Bitlis'}</Text>
          {item.averageRating > 0 && (
            <>
              <View style={styles.dot} />
              <StarRating rating={item.averageRating} />
              <Text style={styles.bizRatingText}>({item.reviewCount || 0})</Text>
            </>
          )}
        </View>
      </View>
      {item.phone && (
        <TouchableOpacity
          style={styles.callBadge}
          onPress={(e) => { e.stopPropagation(); Linking.openURL(`tel:${item.phone}`); }}
          activeOpacity={0.8}
        >
          <Ionicons name="call-outline" size={16} color={Colors.forest[500]} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

function LeafletMap({ businesses }: { businesses: any[] }) {
  const markers = businesses
    .filter((b) => b.latitude && b.longitude)
    .map(
      (b) =>
        `L.marker([${b.latitude}, ${b.longitude}])
          .addTo(map)
          .bindPopup('<b>${b.name.replace(/'/g, "\\'")}</b><br>${(b.district || 'Bitlis').replace(/'/g, "\\'")}');`
    )
    .join('\n');

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body, #map { width: 100%; height: 100%; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    var map = L.map('map').setView([38.4003, 42.1097], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19
    }).addTo(map);
    L.marker([38.4003, 42.1097])
      .addTo(map)
      .bindPopup('<b>Bitlis Merkezi</b><br>38.4003°K, 42.1097°D')
      .openPopup();
    ${markers}
  </script>
</body>
</html>`;

  return (
    <WebView
      source={{ html }}
      style={{ flex: 1 }}
      originWhitelist={['*']}
      javaScriptEnabled
      domStorageEnabled
      startInLoadingState
      renderLoading={() => (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={Colors.stone[600]} size="large" />
        </View>
      )}
    />
  );
}

export default function MapScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [view, setView] = useState<'list' | 'map'>('list');
  const webViewRef = useRef<WebView>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['businesses', category],
    queryFn: () => businessService.getAll({ category: category || undefined }),
  });

  const allBusinesses: any[] = (data as any)?.businesses ?? [];
  const filtered = search
    ? allBusinesses.filter((b) =>
        b.name.toLowerCase().includes(search.toLowerCase()) ||
        b.district?.toLowerCase().includes(search.toLowerCase())
      )
    : allBusinesses;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.stone[700]} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerCircle} />
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>Bitlis Haritası</Text>
            <Text style={styles.headerSub}>{allBusinesses.length} işletme kayıtlı</Text>
          </View>
          <View style={styles.viewToggle}>
            <TouchableOpacity
              style={[styles.toggleBtn, view === 'list' && styles.toggleBtnActive]}
              onPress={() => setView('list')}
            >
              <Ionicons name="list" size={16} color={view === 'list' ? Colors.white : 'rgba(255,255,255,0.6)'} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleBtn, view === 'map' && styles.toggleBtnActive]}
              onPress={() => setView('map')}
            >
              <Ionicons name="map" size={16} color={view === 'map' ? Colors.white : 'rgba(255,255,255,0.6)'} />
            </TouchableOpacity>
          </View>
        </View>
        {/* Search */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={16} color={Colors.gray[400]} />
          <TextInput
            style={styles.searchInput}
            placeholder="İşletme veya yer ara..."
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
                style={[styles.chip, active && { backgroundColor: Colors.stone[600] }]}
                onPress={() => setCategory(cat.key)}
                activeOpacity={0.8}
              >
                <Ionicons name={cat.icon} size={13} color={active ? Colors.white : Colors.textMuted} />
                <Text style={[styles.chipText, { color: active ? Colors.white : Colors.textSecondary }]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          }}
          keyExtractor={(c) => c.key}
        />
      </View>

      {view === 'map' ? (
        <LeafletMap businesses={filtered} />
      ) : isLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator color={Colors.stone[600]} size="large" />
        </View>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="storefront-outline"
          title="İşletme bulunamadı"
          description="Arama kriterlerinizi değiştirin."
          iconColor={Colors.stone[400]}
        />
      ) : (
        <FlashList
          data={filtered}
          estimatedItemSize={90}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100, paddingTop: 4 }}
          renderItem={({ item }) => (
            <BusinessCard item={item} onPress={() => router.push(`/business/${item.id}` as any)} />
          )}
          keyExtractor={(item: any) => item.id}
          ListHeaderComponent={
            <View style={styles.resultHeader}>
              <Text style={styles.resultText}>
                <Text style={{ color: Colors.stone[600], fontWeight: '700' }}>{filtered.length}</Text> işletme bulundu
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },

  header: {
    backgroundColor: Colors.stone[700],
    paddingTop: (StatusBar.currentHeight || 44) + 8,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    overflow: 'hidden',
  },
  headerCircle: {
    position: 'absolute', width: 180, height: 180, borderRadius: 90,
    backgroundColor: Colors.stone[600], opacity: 0.4, top: -50, right: -40,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.md },
  headerTitle: { ...Typography.h2, color: Colors.white, marginBottom: 2 },
  headerSub: { ...Typography.caption, color: 'rgba(255,255,255,0.6)' },
  viewToggle: {
    flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: BorderRadius.md, padding: 3,
  },
  toggleBtn: {
    width: 36, height: 30, alignItems: 'center', justifyContent: 'center', borderRadius: BorderRadius.sm,
  },
  toggleBtnActive: { backgroundColor: 'rgba(255,255,255,0.2)' },

  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.white, borderRadius: BorderRadius.xl,
    paddingHorizontal: 14, height: 44, gap: 8,
  },
  searchInput: { flex: 1, ...Typography.body, color: Colors.textPrimary },

  categoryWrap: { backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.border },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 12, paddingVertical: 7, borderRadius: BorderRadius.full,
    marginRight: Spacing.sm, backgroundColor: Colors.gray[100],
  },
  chipText: { ...Typography.btnSm },

  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  businessCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.lg, marginTop: Spacing.sm,
    borderRadius: BorderRadius.lg, padding: Spacing.md, gap: Spacing.md, ...Shadows.sm,
  },
  bizThumb: {
    width: 60, height: 60, borderRadius: BorderRadius.md,
    alignItems: 'center', justifyContent: 'center',
  },
  bizBody: { flex: 1, gap: 4 },
  bizName: { ...Typography.h4, color: Colors.textPrimary },
  bizMeta: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 2 },
  bizMetaText: { ...Typography.caption, color: Colors.textMuted, marginRight: 4 },
  bizRatingText: { ...Typography.caption, color: Colors.textMuted },
  callBadge: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.forest[100], alignItems: 'center', justifyContent: 'center',
  },
  dot: { width: 3, height: 3, borderRadius: 2, backgroundColor: Colors.gray[300] },

  resultHeader: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, paddingBottom: 4 },
  resultText: { ...Typography.bodySm, color: Colors.textMuted },
});
