import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { listingService } from '../../services/listingService';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import Badge from '../../components/ui/Badge';

export default function ListingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ['listing', id],
    queryFn: () => listingService.getById(id),
  });

  const listing = (data as any)?.listing;

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={Colors.forest[500]} size="large" />
      </View>
    );
  }

  if (!listing) {
    return (
      <View style={styles.loading}>
        <Ionicons name="alert-circle-outline" size={48} color={Colors.gray[300]} />
        <Text style={styles.errorText}>İlan bulunamadı</Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      {/* Hero */}
      <View style={styles.hero}>
        <View style={styles.heroCircle} />
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={Colors.white} />
        </TouchableOpacity>
        <View style={styles.heroContent}>
          <View style={styles.heroTop}>
            <Badge label={listing.category || 'İlan'} color="rgba(255,255,255,0.18)" textColor={Colors.white} />
            {listing.isPremium && (
              <Badge label="⭐ ÖZEL İLAN" color={Colors.gold[500]} textColor={Colors.white} />
            )}
          </View>
          <Text style={styles.heroTitle}>{listing.title}</Text>
          {listing.price != null && (
            <Text style={styles.heroPrice}>
              {listing.isNegotiable ? '~' : ''}{listing.price.toLocaleString('tr-TR')} ₺
              {listing.isNegotiable && <Text style={styles.negotiable}> (Pazarlıklı)</Text>}
            </Text>
          )}
        </View>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Info Cards */}
        <View style={styles.infoRow}>
          <View style={styles.infoCard}>
            <Ionicons name="location-outline" size={18} color={Colors.forest[500]} />
            <Text style={styles.infoLabel}>İlçe</Text>
            <Text style={styles.infoValue}>{listing.district || 'Bitlis'}</Text>
          </View>
          <View style={styles.infoCard}>
            <Ionicons name="eye-outline" size={18} color={Colors.primary[500]} />
            <Text style={styles.infoLabel}>Görüntülenme</Text>
            <Text style={styles.infoValue}>{listing.viewCount || 0}</Text>
          </View>
          <View style={styles.infoCard}>
            <Ionicons name="calendar-outline" size={18} color={Colors.stone[500]} />
            <Text style={styles.infoLabel}>Tarih</Text>
            <Text style={styles.infoValue}>{new Date(listing.createdAt).toLocaleDateString('tr-TR')}</Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Açıklama</Text>
          <View style={styles.descCard}>
            <Text style={styles.desc}>{listing.description}</Text>
          </View>
        </View>

        {/* Seller */}
        {listing.seller && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Satıcı</Text>
            <View style={styles.sellerCard}>
              <View style={styles.sellerAvatar}>
                <Ionicons name="person" size={22} color={Colors.primary[400]} />
              </View>
              <View style={styles.sellerInfo}>
                <Text style={styles.sellerName}>{listing.seller.fullName || 'Kullanıcı'}</Text>
                <Text style={styles.sellerDistrict}>{listing.seller.district || 'Bitlis'}</Text>
              </View>
              <View style={styles.sellerRating}>
                <Ionicons name="star" size={14} color={Colors.gold[400]} />
                <Text style={styles.sellerRatingText}>4.8</Text>
              </View>
            </View>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Action Bar */}
      <View style={styles.actionBar}>
        <TouchableOpacity
          style={styles.msgBtn}
          onPress={() => router.push(`/listing/chat/${id}` as any)}
          activeOpacity={0.8}
        >
          <Ionicons name="chatbubble-outline" size={18} color={Colors.primary[600]} />
          <Text style={styles.msgBtnText}>Mesaj Gönder</Text>
        </TouchableOpacity>
        {listing.seller?.phone && (
          <TouchableOpacity
            style={styles.callBtn}
            onPress={() => Linking.openURL(`tel:${listing.seller.phone}`)}
            activeOpacity={0.8}
          >
            <Ionicons name="call" size={18} color={Colors.white} />
            <Text style={styles.callBtnText}>Ara</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  errorText: { ...Typography.body, color: Colors.textMuted },

  hero: {
    backgroundColor: Colors.forest[500],
    paddingTop: (StatusBar.currentHeight || 44) + 8,
    paddingBottom: Spacing.xl,
    overflow: 'hidden',
  },
  heroCircle: {
    position: 'absolute', width: 200, height: 200, borderRadius: 100,
    backgroundColor: Colors.forest[400], opacity: 0.3, top: -60, right: -40,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
    marginHorizontal: Spacing.lg, marginBottom: Spacing.md,
  },
  heroContent: { paddingHorizontal: Spacing.lg },
  heroTop: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  heroTitle: { ...Typography.h2, color: Colors.white, marginBottom: 8 },
  heroPrice: { fontSize: 26, fontWeight: '800', color: Colors.white },
  negotiable: { fontSize: 14, fontWeight: '400', color: 'rgba(255,255,255,0.7)' },

  scroll: { flex: 1 },

  infoRow: {
    flexDirection: 'row', gap: Spacing.sm,
    paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg,
  },
  infoCard: {
    flex: 1, backgroundColor: Colors.white, borderRadius: BorderRadius.lg,
    padding: Spacing.md, alignItems: 'center', gap: 4, ...Shadows.sm,
  },
  infoLabel: { ...Typography.caption, color: Colors.textMuted },
  infoValue: { ...Typography.label, color: Colors.textPrimary, textAlign: 'center' },

  section: { padding: Spacing.lg, paddingTop: 0, marginTop: Spacing.lg },
  sectionTitle: { ...Typography.h4, color: Colors.textPrimary, marginBottom: 10 },
  descCard: {
    backgroundColor: Colors.white, borderRadius: BorderRadius.lg,
    padding: Spacing.md, ...Shadows.sm,
  },
  desc: { ...Typography.body, color: Colors.textPrimary, lineHeight: 24 },

  sellerCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.white, borderRadius: BorderRadius.lg,
    padding: Spacing.md, gap: Spacing.md, ...Shadows.sm,
  },
  sellerAvatar: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: Colors.primary[50], alignItems: 'center', justifyContent: 'center',
  },
  sellerInfo: { flex: 1 },
  sellerName: { ...Typography.h4, color: Colors.textPrimary },
  sellerDistrict: { ...Typography.caption, color: Colors.textMuted, marginTop: 2 },
  sellerRating: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  sellerRatingText: { ...Typography.label, color: Colors.textPrimary },

  actionBar: {
    flexDirection: 'row', gap: Spacing.sm,
    padding: Spacing.lg, backgroundColor: Colors.white,
    borderTopWidth: 1, borderTopColor: Colors.border, ...Shadows.lg,
  },
  msgBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, backgroundColor: Colors.primary[50], borderRadius: BorderRadius.lg,
    paddingVertical: 13, borderWidth: 1.5, borderColor: Colors.primary[300],
  },
  msgBtnText: { ...Typography.btn, color: Colors.primary[600] },
  callBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, backgroundColor: Colors.forest[500], borderRadius: BorderRadius.lg, paddingVertical: 13,
  },
  callBtnText: { ...Typography.btn, color: Colors.white },
});
