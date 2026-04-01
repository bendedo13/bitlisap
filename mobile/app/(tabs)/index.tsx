import React, { useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Linking,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { newsService } from '../../services/newsService';
import { useAuthStore } from '../../store/authStore';
import { useAppStore } from '../../store/appStore';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import SectionHeader from '../../components/ui/SectionHeader';
import api from '../../services/api';

const QUICK_ACTIONS = [
  { icon: 'call' as const, label: 'Acil', sublabel: '112', color: Colors.danger[600], bg: Colors.danger[100], number: '112' },
  { icon: 'medical' as const, label: 'Hastane', sublabel: '0434', color: Colors.forest[500], bg: Colors.forest[100], number: '04342260200' },
  { icon: 'shield-checkmark' as const, label: 'Polis', sublabel: '155', color: Colors.primary[600], bg: Colors.primary[100], number: '155' },
  { icon: 'flame' as const, label: 'İtfaiye', sublabel: '110', color: Colors.sunset[500], bg: Colors.stone[50], number: '110' },
];

const FEATURES = [
  { icon: 'newspaper-outline' as const, label: 'Haberler', route: '/(tabs)/news', color: Colors.primary[600], bg: Colors.primary[50] },
  { icon: 'pricetag-outline' as const, label: 'Pazar', route: '/(tabs)/market', color: Colors.forest[500], bg: Colors.forest[100] },
  { icon: 'calendar-outline' as const, label: 'Etkinlikler', route: '/events', color: Colors.purple[500], bg: Colors.purple[100] },
  { icon: 'compass-outline' as const, label: 'Turizm', route: '/tourism', color: Colors.stone[600], bg: Colors.stone[50] },
  { icon: 'map-outline' as const, label: 'Harita', route: '/(tabs)/map', color: Colors.primary[400], bg: Colors.primary[50] },
  { icon: 'alert-circle-outline' as const, label: 'Acil', route: '/emergency', color: Colors.danger[600], bg: Colors.danger[100] },
];

function timeAgo(dateStr: string) {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60) return 'az önce';
  if (diff < 3600) return `${Math.floor(diff / 60)}dk önce`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}sa önce`;
  return `${Math.floor(diff / 86400)}g önce`;
}

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { weatherData } = useAppStore();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = React.useState(false);

  const { data: newsData, refetch } = useQuery({
    queryKey: ['news', 'home'],
    queryFn: () => newsService.getAll({ limit: 5 }),
  });

  const { data: breakingData } = useQuery({
    queryKey: ['news', 'breaking'],
    queryFn: () => newsService.getBreaking(),
  });

  const { data: alertData } = useQuery({
    queryKey: ['alert', 'active'],
    queryFn: () => api.get('/alerts/active').then(r => r.data),
    retry: false,
  });

  const { data: campaignsData } = useQuery({
    queryKey: ['campaigns'],
    queryFn: () => api.get('/campaigns').then(r => r.data),
  });

  const { data: taxisData } = useQuery({
    queryKey: ['taxis'],
    queryFn: () => api.get('/taxis').then(r => r.data),
  });

  const { data: dutyPharmacyData } = useQuery({
    queryKey: ['pharmacies', 'duty'],
    queryFn: () => api.get('/pharmacies/duty').then(r => r.data),
    retry: false,
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Günaydın';
    if (h < 18) return 'İyi günler';
    return 'İyi akşamlar';
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary[800]} />

      {/* ── Hero Header ── */}
      <View style={[styles.hero, { paddingTop: insets.top + 8 }]}>
        <View style={styles.heroCircle1} />
        <View style={styles.heroCircle2} />
        <View style={styles.heroCircle3} />

        <View style={styles.heroTop}>
          <View style={{ flex: 1 }}>
            <Text style={styles.greetText}>
              {greeting()}{user?.fullName ? `, ${user.fullName.split(' ')[0]}` : ''} 👋
            </Text>
            <Text style={styles.heroTitle}>Bitlis Şehrim</Text>
            <Text style={styles.heroSub}>Şehrin nabzını tut</Text>
          </View>
          {weatherData && (
            <View style={styles.weatherCard}>
              <Text style={styles.weatherTemp}>{Math.round(weatherData.temperature)}°C</Text>
              <Text style={styles.weatherDesc}>{weatherData.description}</Text>
              <View style={styles.weatherRow}>
                <Ionicons name="water-outline" size={10} color="rgba(255,255,255,0.65)" />
                <Text style={styles.weatherExtra}> {weatherData.humidity}%</Text>
              </View>
            </View>
          )}
        </View>

        {/* Search */}
        <TouchableOpacity style={styles.searchBar} onPress={() => router.push('/(tabs)/map')} activeOpacity={0.88}>
          <Ionicons name="search" size={18} color={Colors.gray[400]} />
          <Text style={styles.searchPlaceholder}>Bitlis'te ara... işletme, yer, haber</Text>
          <View style={styles.searchFilter}>
            <Ionicons name="options-outline" size={16} color={Colors.primary[600]} />
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary[500]} />}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* ── Emergency Alert Banner ── */}
        {alertData?.alert && (
          <View style={[styles.alertBanner,
            alertData.alert.severity === 'CRITICAL' && { backgroundColor: Colors.danger[700] },
            alertData.alert.severity === 'HIGH' && { backgroundColor: Colors.danger[600] },
            alertData.alert.severity === 'MEDIUM' && { backgroundColor: Colors.gold[500] },
            alertData.alert.severity === 'LOW' && { backgroundColor: Colors.forest[500] },
          ]}>
            <Ionicons name="warning-outline" size={20} color={Colors.white} />
            <View style={{ flex: 1 }}>
              <Text style={styles.alertTitle}>{alertData.alert.title}</Text>
              <Text style={styles.alertMsg} numberOfLines={2}>{alertData.alert.message}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.7)" />
          </View>
        )}

        {/* ── Breaking News ── */}
        {(breakingData as any)?.news?.[0] && (
          <TouchableOpacity
            style={styles.breakingBanner}
            onPress={() => router.push(`/news/${(breakingData as any).news[0].id}` as any)}
            activeOpacity={0.9}
          >
            <View style={styles.breakingLeft}>
              <View style={styles.breakingBadge}>
                <View style={styles.breakingDot} />
                <Text style={styles.breakingBadgeText}>SON DAKİKA</Text>
              </View>
              <Text style={styles.breakingTitle} numberOfLines={2}>
                {(breakingData as any).news[0].title}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.white} />
          </TouchableOpacity>
        )}

        {/* ── Campaigns ── */}
        {(campaignsData?.campaigns?.length ?? 0) > 0 && (
          <View style={styles.section}>
            <SectionHeader title="Kampanyalar" subtitle="Şehrin fırsatları" accentColor={Colors.gold[500]} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: Spacing.lg, gap: Spacing.md }}>
              {(campaignsData.campaigns as any[]).slice(0, 8).map((c: any) => (
                <View key={c.id} style={styles.campaignCard}>
                  <View style={[styles.campaignBadge, { backgroundColor: Colors.gold[400] + '33' }]}>
                    <Ionicons name="pricetag-outline" size={14} color={Colors.gold[600]} />
                  </View>
                  <Text style={styles.campaignTitle} numberOfLines={2}>{c.title}</Text>
                  <Text style={styles.campaignDiscount}>{c.discountPercent}% İndirim</Text>
                  <Text style={styles.campaignBiz} numberOfLines={1}>{c.business?.name ?? c.businessId}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* ── Taxi & Pharmacy Row ── */}
        <View style={[styles.section, { paddingHorizontal: Spacing.lg }]}>
          <View style={styles.serviceRow}>
            {/* Taxis Widget */}
            <TouchableOpacity style={styles.serviceWidget} activeOpacity={0.85} onPress={() => router.push('/tourism' as any)}>
              <View style={[styles.serviceWidgetIcon, { backgroundColor: Colors.gold[400] + '22' }]}>
                <Ionicons name="car-outline" size={22} color={Colors.gold[600]} />
              </View>
              <Text style={styles.serviceWidgetTitle}>Taksi</Text>
              {(taxisData?.taxis?.length ?? 0) > 0 ? (
                <Text style={styles.serviceWidgetSub}>{(taxisData.taxis as any[])[0].phone}</Text>
              ) : (
                <Text style={styles.serviceWidgetSub}>Durağa git</Text>
              )}
              <View style={styles.serviceWidgetBtn}>
                <Text style={styles.serviceWidgetBtnText}>Ara</Text>
                <Ionicons name="call-outline" size={12} color={Colors.gold[600]} />
              </View>
            </TouchableOpacity>

            {/* Duty Pharmacy Widget */}
            <TouchableOpacity style={[styles.serviceWidget, { marginLeft: Spacing.sm }]} activeOpacity={0.85}>
              <View style={[styles.serviceWidgetIcon, { backgroundColor: Colors.forest[500] + '22' }]}>
                <Ionicons name="medkit-outline" size={22} color={Colors.forest[500]} />
              </View>
              <Text style={styles.serviceWidgetTitle}>Nöbetçi Eczane</Text>
              {dutyPharmacyData?.pharmacy ? (
                <>
                  <Text style={styles.serviceWidgetSub} numberOfLines={1}>{dutyPharmacyData.pharmacy.name}</Text>
                  <TouchableOpacity
                    style={[styles.serviceWidgetBtn, { backgroundColor: Colors.forest[500] + '18', borderColor: Colors.forest[500] }]}
                    onPress={() => Linking.openURL(`tel:${dutyPharmacyData.pharmacy.phone}`)}
                  >
                    <Text style={[styles.serviceWidgetBtnText, { color: Colors.forest[600] }]}>Ara</Text>
                    <Ionicons name="call-outline" size={12} color={Colors.forest[500]} />
                  </TouchableOpacity>
                </>
              ) : (
                <Text style={styles.serviceWidgetSub}>Bilgi yok</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Quick Actions ── */}
        <View style={styles.section}>
          <SectionHeader title="Acil Hizmetler" subtitle="Hızlı arama" accentColor={Colors.danger[600]} />
          <View style={styles.quickActionsRow}>
            {QUICK_ACTIONS.map((a) => (
              <TouchableOpacity
                key={a.label}
                style={styles.quickAction}
                onPress={() => Linking.openURL(`tel:${a.number}`)}
                activeOpacity={0.8}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: a.bg }]}>
                  <Ionicons name={a.icon} size={22} color={a.color} />
                </View>
                <Text style={styles.quickActionLabel}>{a.label}</Text>
                <Text style={[styles.quickActionSub, { color: a.color }]}>{a.sublabel}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── Feature Grid ── */}
        <View style={styles.section}>
          <SectionHeader title="Şehir Hizmetleri" accentColor={Colors.primary[600]} />
          <View style={styles.featureGrid}>
            {FEATURES.map((f) => (
              <TouchableOpacity
                key={f.label}
                style={[styles.featureItem, { backgroundColor: f.bg }]}
                onPress={() => router.push(f.route as any)}
                activeOpacity={0.8}
              >
                <Ionicons name={f.icon} size={24} color={f.color} />
                <Text style={[styles.featureLabel, { color: f.color }]}>{f.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── Latest News ── */}
        <View style={styles.section}>
          <SectionHeader
            title="Son Haberler"
            subtitle="Bitlis gündeminden"
            onSeeAll={() => router.push('/(tabs)/news')}
            accentColor={Colors.primary[500]}
          />
          {(newsData as any)?.news?.slice(0, 4).map((item: any) => (
            <Card
              key={item.id}
              onPress={() => router.push(`/news/${item.id}` as any)}
              style={[styles.newsCard, { marginHorizontal: Spacing.lg, marginBottom: Spacing.sm }]}
              padding={0}
            >
              <View style={styles.newsCardInner}>
                <View style={[styles.newsCardAccent, { backgroundColor: Colors.primary[600] }]} />
                <View style={styles.newsCardContent}>
                  <View style={styles.newsCardTop}>
                    <Badge
                      label={item.category || 'Genel'}
                      color={Colors.primary[50]}
                      textColor={Colors.primary[700]}
                    />
                    <Text style={styles.newsTime}>{timeAgo(item.createdAt)}</Text>
                  </View>
                  <Text style={styles.newsCardTitle} numberOfLines={2}>{item.title}</Text>
                  <View style={styles.newsCardMeta}>
                    <Ionicons name="eye-outline" size={12} color={Colors.textMuted} />
                    <Text style={styles.newsCardMetaText}> {item.viewCount || 0} görüntülenme</Text>
                  </View>
                </View>
              </View>
            </Card>
          ))}
        </View>

        {/* ── Promo/Tourism Card ── */}
        <View style={[styles.section, { paddingBottom: 0 }]}>
          <TouchableOpacity
            style={styles.promoCard}
            onPress={() => router.push('/tourism' as any)}
            activeOpacity={0.9}
          >
            <View style={styles.promoBg} />
            <View style={styles.promoOverlay} />
            <View style={styles.promoContent}>
              <Badge label="TURİZM" color="rgba(255,255,255,0.18)" textColor={Colors.white} size="md" />
              <Text style={styles.promoTitle}>Tarih ve Doğanın{'\n'}Buluşma Noktası</Text>
              <Text style={styles.promoSub}>Bitlis'in eşsiz güzelliklerini keşfet</Text>
              <View style={styles.promoBtn}>
                <Text style={styles.promoBtnText}>Keşfet</Text>
                <Ionicons name="arrow-forward" size={14} color={Colors.stone[700]} />
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },

  // Hero
  hero: {
    backgroundColor: Colors.primary[800],
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    overflow: 'hidden',
  },
  heroCircle1: {
    position: 'absolute', width: 240, height: 240, borderRadius: 120,
    backgroundColor: Colors.primary[600], opacity: 0.3, top: -80, right: -50,
  },
  heroCircle2: {
    position: 'absolute', width: 130, height: 130, borderRadius: 65,
    backgroundColor: Colors.primary[400], opacity: 0.15, bottom: 10, left: -35,
  },
  heroCircle3: {
    position: 'absolute', width: 70, height: 70, borderRadius: 35,
    backgroundColor: Colors.gold[400], opacity: 0.12, top: 30, left: '55%',
  },
  heroTop: {
    flexDirection: 'row', alignItems: 'flex-start', marginBottom: Spacing.lg,
  },
  greetText: { ...Typography.bodySm, color: 'rgba(255,255,255,0.6)', marginBottom: 4 },
  heroTitle: { ...Typography.h1, color: Colors.white, marginBottom: 2 },
  heroSub: { ...Typography.caption, color: 'rgba(255,255,255,0.5)' },
  weatherCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: BorderRadius.lg,
    padding: 12,
    alignItems: 'center',
    minWidth: 76,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    marginLeft: 12,
  },
  weatherTemp: { fontSize: 20, fontWeight: '700', color: Colors.white },
  weatherDesc: { ...Typography.caption, color: 'rgba(255,255,255,0.65)', marginTop: 2, textAlign: 'center', fontSize: 10 },
  weatherRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  weatherExtra: { ...Typography.caption, color: 'rgba(255,255,255,0.55)', fontSize: 10 },
  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.white, borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.md, height: 48, gap: 10,
  },
  searchPlaceholder: { ...Typography.body, color: Colors.gray[400], flex: 1 },
  searchFilter: {
    width: 34, height: 34, borderRadius: BorderRadius.md,
    backgroundColor: Colors.primary[50], alignItems: 'center', justifyContent: 'center',
  },

  scroll: { flex: 1 },
  section: { marginTop: Spacing.xl },

  // Emergency Alert
  alertBanner: {
    marginTop: Spacing.lg, marginHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg, padding: Spacing.md,
    flexDirection: 'row', alignItems: 'center', gap: 10,
    ...Shadows.md,
  },
  alertTitle: { ...Typography.label, color: Colors.white, fontWeight: '700', marginBottom: 2 },
  alertMsg: { ...Typography.caption, color: 'rgba(255,255,255,0.82)' },

  // Breaking
  breakingBanner: {
    marginTop: Spacing.lg, marginHorizontal: Spacing.lg,
    backgroundColor: Colors.danger[600], borderRadius: BorderRadius.lg,
    padding: Spacing.md, flexDirection: 'row', alignItems: 'center', gap: 8,
    ...Shadows.md,
  },
  breakingLeft: { flex: 1 },
  breakingBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 5 },
  breakingDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: Colors.white },
  breakingBadgeText: { ...Typography.label, color: Colors.white },
  breakingTitle: { ...Typography.body, color: Colors.white, fontWeight: '600' },

  // Campaigns
  campaignCard: {
    width: 150, backgroundColor: Colors.white, borderRadius: BorderRadius.xl,
    padding: Spacing.md, ...Shadows.sm,
    borderWidth: 1, borderColor: Colors.border,
  },
  campaignBadge: {
    width: 32, height: 32, borderRadius: BorderRadius.md,
    alignItems: 'center', justifyContent: 'center', marginBottom: 8,
  },
  campaignTitle: { ...Typography.label, color: Colors.textPrimary, fontWeight: '600', marginBottom: 4 },
  campaignDiscount: { fontSize: 15, fontWeight: '800', color: Colors.gold[600], marginBottom: 4 },
  campaignBiz: { ...Typography.caption, color: Colors.textMuted },

  // Taxi & Pharmacy
  serviceRow: { flexDirection: 'row' },
  serviceWidget: {
    flex: 1, backgroundColor: Colors.white, borderRadius: BorderRadius.xl,
    padding: Spacing.md, ...Shadows.sm,
    borderWidth: 1, borderColor: Colors.border,
  },
  serviceWidgetIcon: {
    width: 40, height: 40, borderRadius: BorderRadius.md,
    alignItems: 'center', justifyContent: 'center', marginBottom: 8,
  },
  serviceWidgetTitle: { ...Typography.label, color: Colors.textPrimary, fontWeight: '700', marginBottom: 4 },
  serviceWidgetSub: { ...Typography.caption, color: Colors.textMuted, marginBottom: 8 },
  serviceWidgetBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.gold[400] + '18',
    borderRadius: BorderRadius.md, paddingHorizontal: 10, paddingVertical: 5,
    borderWidth: 1, borderColor: Colors.gold[400],
    alignSelf: 'flex-start',
  },
  serviceWidgetBtnText: { ...Typography.caption, fontWeight: '700', color: Colors.gold[600] },

  // Quick Actions
  quickActionsRow: { flexDirection: 'row', paddingHorizontal: Spacing.lg, gap: Spacing.sm },
  quickAction: {
    flex: 1, alignItems: 'center', backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg, paddingVertical: Spacing.md, ...Shadows.sm,
  },
  quickActionIcon: {
    width: 46, height: 46, borderRadius: BorderRadius.md,
    alignItems: 'center', justifyContent: 'center', marginBottom: 6,
  },
  quickActionLabel: { ...Typography.label, color: Colors.textPrimary, marginBottom: 2 },
  quickActionSub: { ...Typography.caption, fontWeight: '700', fontSize: 10 },

  // Feature Grid
  featureGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    paddingHorizontal: Spacing.lg, gap: Spacing.sm,
  },
  featureItem: {
    width: '30.5%', aspectRatio: 1.2, borderRadius: BorderRadius.lg,
    alignItems: 'center', justifyContent: 'center', gap: 6,
  },
  featureLabel: { ...Typography.label, fontWeight: '700' },

  // News Cards
  newsCard: {},
  newsCardInner: { flexDirection: 'row', borderRadius: BorderRadius.lg, overflow: 'hidden' },
  newsCardAccent: { width: 4 },
  newsCardContent: { flex: 1, padding: Spacing.md },
  newsCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  newsTime: { ...Typography.caption, color: Colors.textMuted },
  newsCardTitle: { ...Typography.h4, color: Colors.textPrimary, marginBottom: 6 },
  newsCardMeta: { flexDirection: 'row', alignItems: 'center' },
  newsCardMetaText: { ...Typography.caption, color: Colors.textMuted },

  // Promo
  promoCard: {
    marginHorizontal: Spacing.lg, height: 180,
    borderRadius: BorderRadius.xl, overflow: 'hidden', ...Shadows.lg,
  },
  promoBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.stone[700],
  },
  promoOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.38)',
    zIndex: 1,
  },
  promoContent: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 2, padding: Spacing.lg, justifyContent: 'flex-end',
  },
  promoTitle: { ...Typography.h2, color: Colors.white, marginTop: 8, marginBottom: 4 },
  promoSub: { ...Typography.bodySm, color: 'rgba(255,255,255,0.7)', marginBottom: Spacing.md },
  promoBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.white, alignSelf: 'flex-start',
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: BorderRadius.full,
  },
  promoBtnText: { ...Typography.btnSm, color: Colors.stone[700] },
});
