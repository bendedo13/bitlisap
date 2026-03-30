import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { newsService } from '../../services/newsService';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import Badge from '../../components/ui/Badge';

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  GUNDEM: { bg: Colors.danger[100], text: Colors.danger[700] },
  EKONOMI: { bg: Colors.forest[100], text: Colors.forest[700] },
  SPOR: { bg: Colors.stone[50], text: Colors.stone[600] },
  KULTUR: { bg: Colors.stone[50], text: Colors.stone[700] },
  EGITIM: { bg: Colors.purple[100], text: Colors.purple[600] },
  SAGLIK: { bg: Colors.forest[100], text: Colors.forest[700] },
  default: { bg: Colors.primary[50], text: Colors.primary[700] },
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('tr-TR', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

export default function NewsDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['news', id],
    queryFn: () => newsService.getById(id),
  });

  const likeMutation = useMutation({
    mutationFn: () => newsService.like(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['news', id] }),
  });

  const news = (data as any)?.news;
  const catColor = CATEGORY_COLORS[news?.category] || CATEGORY_COLORS.default;

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={Colors.primary[500]} size="large" />
      </View>
    );
  }

  if (!news) {
    return (
      <View style={styles.loading}>
        <Ionicons name="alert-circle-outline" size={48} color={Colors.gray[300]} />
        <Text style={styles.errorText}>Haber bulunamadı</Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      {/* Hero Header */}
      <View style={styles.hero}>
        <View style={styles.heroCircle} />
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={Colors.white} />
        </TouchableOpacity>
        <View style={styles.heroContent}>
          <View style={styles.heroTop}>
            <Badge label={news.category || 'Genel'} color={catColor.bg} textColor={catColor.text} />
            {news.isOfficial && (
              <Badge label="RESMİ" color={Colors.primary[600]} textColor={Colors.white} />
            )}
            {news.isBreaking && (
              <Badge label="SON DAKİKA" color={Colors.danger[600]} textColor={Colors.white} />
            )}
          </View>
          <Text style={styles.heroTitle}>{news.title}</Text>
          <View style={styles.heroMeta}>
            <Ionicons name="time-outline" size={13} color="rgba(255,255,255,0.7)" />
            <Text style={styles.heroMetaText}>{formatDate(news.createdAt)}</Text>
            <View style={styles.heroDot} />
            <Ionicons name="eye-outline" size={13} color="rgba(255,255,255,0.7)" />
            <Text style={styles.heroMetaText}>{news.viewCount || 0} görüntülenme</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Summary */}
        {news.summary && (
          <View style={styles.summaryCard}>
            <View style={styles.summaryAccent} />
            <Text style={styles.summaryText}>{news.summary}</Text>
          </View>
        )}

        {/* Content */}
        <View style={styles.contentArea}>
          <Text style={styles.content}>{news.content}</Text>
        </View>

        {/* Tags */}
        {news.tags && news.tags.length > 0 && (
          <View style={styles.tagsSection}>
            <Text style={styles.tagsLabel}>Etiketler</Text>
            <View style={styles.tagsRow}>
              {news.tags.map((tag: string) => (
                <View key={tag} style={styles.tag}>
                  <Text style={styles.tagText}>#{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.actionBar}>
        <TouchableOpacity style={styles.shareBtn} activeOpacity={0.8}>
          <Ionicons name="share-social-outline" size={20} color={Colors.primary[600]} />
          <Text style={styles.shareBtnText}>Paylaş</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.likeBtn, { backgroundColor: Colors.danger[600] }]}
          onPress={() => likeMutation.mutate()}
          activeOpacity={0.8}
        >
          <Ionicons name="heart" size={18} color={Colors.white} />
          <Text style={styles.likeBtnText}>{news.likeCount || 0} Beğeni</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  errorText: { ...Typography.body, color: Colors.textMuted },

  hero: {
    backgroundColor: Colors.primary[800],
    paddingTop: (StatusBar.currentHeight || 44) + 8,
    paddingBottom: Spacing.xl,
    overflow: 'hidden',
  },
  heroCircle: {
    position: 'absolute', width: 200, height: 200, borderRadius: 100,
    backgroundColor: Colors.primary[600], opacity: 0.2, top: -60, right: -40,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
    marginHorizontal: Spacing.lg, marginBottom: Spacing.md,
  },
  heroContent: { paddingHorizontal: Spacing.lg },
  heroTop: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  heroTitle: { ...Typography.h2, color: Colors.white, marginBottom: 12 },
  heroMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  heroMetaText: { ...Typography.caption, color: 'rgba(255,255,255,0.65)', marginRight: 4 },
  heroDot: { width: 3, height: 3, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.4)', marginHorizontal: 3 },

  scroll: { flex: 1 },

  summaryCard: {
    flexDirection: 'row', margin: Spacing.lg,
    backgroundColor: Colors.primary[50], borderRadius: BorderRadius.lg,
    overflow: 'hidden', ...Shadows.sm,
  },
  summaryAccent: { width: 4, backgroundColor: Colors.primary[600] },
  summaryText: { flex: 1, ...Typography.bodyLg, color: Colors.primary[800], fontStyle: 'italic', padding: Spacing.md, lineHeight: 26 },

  contentArea: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.lg },
  content: { ...Typography.bodyLg, color: Colors.textPrimary, lineHeight: 28 },

  tagsSection: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.lg },
  tagsLabel: { ...Typography.label, color: Colors.textMuted, marginBottom: 8 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: {
    backgroundColor: Colors.primary[50], paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: BorderRadius.full, borderWidth: 1, borderColor: Colors.primary[200],
  },
  tagText: { ...Typography.caption, color: Colors.primary[600] },

  actionBar: {
    flexDirection: 'row', gap: Spacing.sm,
    padding: Spacing.lg, backgroundColor: Colors.white,
    borderTopWidth: 1, borderTopColor: Colors.border, ...Shadows.lg,
  },
  shareBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, backgroundColor: Colors.primary[50], borderRadius: BorderRadius.lg,
    paddingVertical: 13, borderWidth: 1, borderColor: Colors.primary[200],
  },
  shareBtnText: { ...Typography.btn, color: Colors.primary[600] },
  likeBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, borderRadius: BorderRadius.lg, paddingVertical: 13,
  },
  likeBtnText: { ...Typography.btn, color: Colors.white },
});
