import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Linking,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { businessService } from '../../services/businessService';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import Badge from '../../components/ui/Badge';

function StarRating({ rating, size = 16, onRate }: { rating: number; size?: number; onRate?: (r: number) => void }) {
  return (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <TouchableOpacity key={s} onPress={() => onRate?.(s)} disabled={!onRate}>
          <Ionicons name={s <= Math.round(rating) ? 'star' : 'star-outline'} size={size} color={Colors.gold[400]} />
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default function BusinessDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['business', id],
    queryFn: () => businessService.getById(id),
  });

  const reviewMutation = useMutation({
    mutationFn: () => businessService.addReview(id, { rating: reviewRating, comment: reviewText }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business', id] });
      setReviewText('');
      setShowReviewForm(false);
    },
  });

  const business = (data as any)?.business;

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={Colors.stone[600]} size="large" />
      </View>
    );
  }

  if (!business) {
    return (
      <View style={styles.loading}>
        <Ionicons name="alert-circle-outline" size={48} color={Colors.gray[300]} />
        <Text style={styles.errorText}>İşletme bulunamadı</Text>
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
          <View style={styles.bizLogoWrap}>
            <Ionicons name="storefront" size={30} color={Colors.white} />
          </View>
          <Text style={styles.bizName}>{business.name}</Text>
          <Badge label={business.category || 'İşletme'} color="rgba(255,255,255,0.18)" textColor={Colors.white} />
          <View style={styles.ratingRow}>
            <StarRating rating={business.averageRating || 0} size={16} />
            <Text style={styles.ratingText}>
              {(business.averageRating || 0).toFixed(1)} ({business.reviewCount || 0} yorum)
            </Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Info Cards */}
        <View style={styles.infoGrid}>
          {[
            { icon: 'location-outline' as const, label: 'İlçe', value: business.district || 'Bitlis', color: Colors.stone[600] },
            { icon: 'eye-outline' as const, label: 'Görüntülenme', value: String(business.viewCount || 0), color: Colors.primary[500] },
          ].map((info) => (
            <View key={info.label} style={styles.infoCard}>
              <Ionicons name={info.icon} size={18} color={info.color} />
              <Text style={styles.infoLabel}>{info.label}</Text>
              <Text style={styles.infoValue}>{info.value}</Text>
            </View>
          ))}
        </View>

        {/* Description */}
        {business.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Hakkında</Text>
            <View style={styles.descCard}>
              <Text style={styles.desc}>{business.description}</Text>
            </View>
          </View>
        )}

        {/* Contact */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>İletişim</Text>
          <View style={styles.contactCard}>
            {business.address && (
              <View style={styles.contactRow}>
                <View style={styles.contactIcon}>
                  <Ionicons name="location" size={16} color={Colors.stone[600]} />
                </View>
                <Text style={styles.contactText}>{business.address}</Text>
              </View>
            )}
            {business.phone && (
              <TouchableOpacity style={styles.contactRow} onPress={() => Linking.openURL(`tel:${business.phone}`)}>
                <View style={[styles.contactIcon, { backgroundColor: Colors.forest[100] }]}>
                  <Ionicons name="call" size={16} color={Colors.forest[600]} />
                </View>
                <Text style={[styles.contactText, { color: Colors.forest[600], fontWeight: '600' }]}>{business.phone}</Text>
                <Ionicons name="chevron-forward" size={14} color={Colors.forest[400]} />
              </TouchableOpacity>
            )}
            {business.website && (
              <TouchableOpacity style={styles.contactRow} onPress={() => Linking.openURL(business.website)}>
                <View style={[styles.contactIcon, { backgroundColor: Colors.primary[50] }]}>
                  <Ionicons name="globe" size={16} color={Colors.primary[600]} />
                </View>
                <Text style={[styles.contactText, { color: Colors.primary[600] }]} numberOfLines={1}>{business.website}</Text>
                <Ionicons name="open-outline" size={14} color={Colors.primary[400]} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Reviews */}
        <View style={styles.section}>
          <View style={styles.reviewsHeader}>
            <Text style={styles.sectionTitle}>Yorumlar</Text>
            <TouchableOpacity
              style={styles.addReviewBtn}
              onPress={() => setShowReviewForm(!showReviewForm)}
            >
              <Ionicons name="add" size={14} color={Colors.primary[600]} />
              <Text style={styles.addReviewText}>Yorum Yaz</Text>
            </TouchableOpacity>
          </View>

          {showReviewForm && (
            <View style={styles.reviewForm}>
              <Text style={styles.reviewFormLabel}>Puanınız</Text>
              <StarRating rating={reviewRating} size={28} onRate={setReviewRating} />
              <TextInput
                style={styles.reviewInput}
                placeholder="Yorumunuzu yazın..."
                placeholderTextColor={Colors.gray[300]}
                value={reviewText}
                onChangeText={setReviewText}
                multiline
                numberOfLines={3}
              />
              <TouchableOpacity
                style={styles.submitReviewBtn}
                onPress={() => reviewMutation.mutate()}
                disabled={reviewMutation.isPending}
              >
                <Text style={styles.submitReviewText}>
                  {reviewMutation.isPending ? 'Gönderiliyor...' : 'Yorumu Gönder'}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {business.reviews?.length > 0 ? (
            business.reviews.map((review: any) => (
              <View key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <View style={styles.reviewAvatar}>
                    <Text style={styles.reviewAvatarText}>
                      {review.user?.fullName?.charAt(0)?.toUpperCase() || '?'}
                    </Text>
                  </View>
                  <View style={styles.reviewMeta}>
                    <Text style={styles.reviewName}>{review.user?.fullName || 'Kullanıcı'}</Text>
                    <StarRating rating={review.rating} size={12} />
                  </View>
                  <Text style={styles.reviewDate}>
                    {new Date(review.createdAt).toLocaleDateString('tr-TR')}
                  </Text>
                </View>
                {review.comment && <Text style={styles.reviewComment}>{review.comment}</Text>}
              </View>
            ))
          ) : (
            <View style={styles.noReviews}>
              <Ionicons name="chatbubble-outline" size={32} color={Colors.gray[300]} />
              <Text style={styles.noReviewsText}>Henüz yorum yok. İlk yorum yapan siz olun!</Text>
            </View>
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Action */}
      {business.phone && (
        <View style={styles.actionBar}>
          <TouchableOpacity
            style={styles.callBtn}
            onPress={() => Linking.openURL(`tel:${business.phone}`)}
            activeOpacity={0.85}
          >
            <Ionicons name="call" size={18} color={Colors.white} />
            <Text style={styles.callBtnText}>Hemen Ara</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  errorText: { ...Typography.body, color: Colors.textMuted },

  hero: {
    backgroundColor: Colors.stone[700],
    paddingTop: (StatusBar.currentHeight || 44) + 8,
    paddingBottom: Spacing.xl,
    overflow: 'hidden',
  },
  heroCircle: {
    position: 'absolute', width: 200, height: 200, borderRadius: 100,
    backgroundColor: Colors.stone[600], opacity: 0.3, top: -60, right: -40,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
    marginHorizontal: Spacing.lg, marginBottom: Spacing.sm,
  },
  heroContent: { paddingHorizontal: Spacing.lg, alignItems: 'flex-start', gap: 8 },
  bizLogoWrap: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.2)',
    marginBottom: 4,
  },
  bizName: { ...Typography.h2, color: Colors.white },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  ratingText: { ...Typography.bodySm, color: 'rgba(255,255,255,0.75)' },

  scroll: { flex: 1 },

  infoGrid: {
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
  sectionTitle: { ...Typography.h4, color: Colors.textPrimary, marginBottom: Spacing.sm },

  descCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.md, ...Shadows.sm },
  desc: { ...Typography.body, color: Colors.textPrimary, lineHeight: 24 },

  contactCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.xl, overflow: 'hidden', ...Shadows.sm },
  contactRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    padding: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Colors.border,
  },
  contactIcon: {
    width: 36, height: 36, borderRadius: BorderRadius.sm,
    backgroundColor: Colors.stone[50], alignItems: 'center', justifyContent: 'center',
  },
  contactText: { flex: 1, ...Typography.body, color: Colors.textPrimary },

  reviewsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  addReviewBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.primary[50], paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: BorderRadius.full, borderWidth: 1, borderColor: Colors.primary[200],
  },
  addReviewText: { ...Typography.label, color: Colors.primary[600] },
  reviewForm: {
    backgroundColor: Colors.white, borderRadius: BorderRadius.lg,
    padding: Spacing.md, gap: Spacing.md, marginBottom: Spacing.md, ...Shadows.sm,
  },
  reviewFormLabel: { ...Typography.label, color: Colors.textSecondary, textTransform: 'uppercase' },
  reviewInput: {
    borderWidth: 1.5, borderColor: Colors.border, borderRadius: BorderRadius.md,
    padding: Spacing.md, ...Typography.body, color: Colors.textPrimary, minHeight: 80, textAlignVertical: 'top',
  },
  submitReviewBtn: {
    backgroundColor: Colors.primary[600], borderRadius: BorderRadius.lg,
    paddingVertical: 12, alignItems: 'center',
  },
  submitReviewText: { ...Typography.btn, color: Colors.white },

  reviewCard: {
    backgroundColor: Colors.white, borderRadius: BorderRadius.lg,
    padding: Spacing.md, marginBottom: Spacing.sm, ...Shadows.sm,
  },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: 8 },
  reviewAvatar: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.primary[100], alignItems: 'center', justifyContent: 'center',
  },
  reviewAvatarText: { ...Typography.h4, color: Colors.primary[700] },
  reviewMeta: { flex: 1, gap: 2 },
  reviewName: { ...Typography.label, color: Colors.textPrimary },
  reviewDate: { ...Typography.caption, color: Colors.textMuted },
  reviewComment: { ...Typography.body, color: Colors.textSecondary, lineHeight: 22 },

  noReviews: { alignItems: 'center', gap: 8, paddingVertical: Spacing.lg },
  noReviewsText: { ...Typography.body, color: Colors.textMuted, textAlign: 'center' },

  actionBar: {
    padding: Spacing.lg, backgroundColor: Colors.white,
    borderTopWidth: 1, borderTopColor: Colors.border, ...Shadows.lg,
  },
  callBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, backgroundColor: Colors.forest[500],
    borderRadius: BorderRadius.lg, paddingVertical: 15,
  },
  callBtnText: { ...Typography.btnLg, color: Colors.white },
});
