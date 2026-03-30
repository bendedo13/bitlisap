import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';
import Badge from '../components/ui/Badge';

const TOURIST_SPOTS = [
  {
    id: '1', name: 'Bitlis Kalesi', category: 'Tarihi Yapı',
    description: 'M.Ö. 3000 yıllarına dayanan, Romalılar ve Selçuklular tarafından da kullanılan efsanevi kale.',
    distance: 'Şehir merkezi', icon: 'business' as const, color: Colors.stone[600],
  },
  {
    id: '2', name: 'Nemrut Krater Gölü', category: 'Doğal Alan',
    description: "Türkiye'nin en büyük krater gölü. 4 gölden oluşan eşsiz doğal güzellik.",
    distance: '70 km', icon: 'water' as const, color: Colors.primary[500],
  },
  {
    id: '3', name: 'Ahlat Selçuklu Mezarlığı', category: 'Tarihi Alan',
    description: "Dünya'nın en büyük Selçuklu mezarlığı. Binlerce tarihi mezar taşıyla UNESCO Dünya Mirası Listesi'nde.",
    distance: '90 km', icon: 'library' as const, color: Colors.stone[700],
  },
  {
    id: '4', name: 'Zeynel Bey Türbesi', category: 'Tarihi Yapı',
    description: "Karakoyunlu hükümdarı İshak Bey'in oğlu Zeynel Bey'e ait 15. yüzyıl türbesi.",
    distance: '92 km', icon: 'diamond' as const, color: Colors.gold[600],
  },
  {
    id: '5', name: 'Van Gölü Kıyısı', category: 'Doğal Alan',
    description: "Türkiye'nin en büyük gölü. Tatvan kıyısından eşsiz manzara.",
    distance: '25 km', icon: 'sunny' as const, color: Colors.primary[400],
  },
  {
    id: '6', name: 'Sahip Ata Camii', category: 'Dini Yapı',
    description: 'Selçuklu mimarisinin nadide örneklerinden biri. 13. yüzyıldan kalma özgün süslemeleri.',
    distance: 'Şehir merkezi', icon: 'moon' as const, color: Colors.forest[500],
  },
];

const LOCAL_FOODS = [
  { name: 'Bitlis Pekmezi', desc: 'Üzümden yapılan geleneksel pekmez', icon: '🍇' },
  { name: 'Kavut', desc: 'Kızartılmış un tatlısı', icon: '🍮' },
  { name: 'Şıllık', desc: 'Nişasta bazlı tatlı', icon: '🍯' },
  { name: 'Mıhlamalı Ekmek', desc: 'Geleneksel ekmek çeşidi', icon: '🍞' },
  { name: 'Kürt Köftesi', desc: 'Bulgur ve et ile hazırlanan köfte', icon: '🥩' },
  { name: 'Tandır Kebabı', desc: 'Geleneksel tandır pişirmesi', icon: '🔥' },
];

const CATEGORY_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  'Tarihi Yapı': 'business',
  'Doğal Alan': 'leaf',
  'Tarihi Alan': 'library',
  'Dini Yapı': 'moon',
};

export default function TourismScreen() {
  const router = useRouter();
  const [tab, setTab] = useState<'spots' | 'food'>('spots');

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.hero}>
        <View style={styles.heroCircle1} />
        <View style={styles.heroCircle2} />
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={Colors.white} />
        </TouchableOpacity>
        <View style={styles.heroContent}>
          <Badge label="TURİZM" color="rgba(255,255,255,0.18)" textColor={Colors.white} />
          <Text style={styles.heroTitle}>Tarih & Doğa</Text>
          <Text style={styles.heroSub}>Bitlis'in eşsiz değerlerini keşfedin</Text>
          <View style={styles.heroStats}>
            <View style={styles.heroStat}>
              <Text style={styles.heroStatValue}>6+</Text>
              <Text style={styles.heroStatLabel}>Tarihi Alan</Text>
            </View>
            <View style={styles.heroStatDivider} />
            <View style={styles.heroStat}>
              <Text style={styles.heroStatValue}>3000+</Text>
              <Text style={styles.heroStatLabel}>Yıllık Tarih</Text>
            </View>
            <View style={styles.heroStatDivider} />
            <View style={styles.heroStat}>
              <Text style={styles.heroStatValue}>1</Text>
              <Text style={styles.heroStatLabel}>UNESCO Adayı</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Tab Switcher */}
      <View style={styles.tabWrap}>
        <TouchableOpacity
          style={[styles.tabBtn, tab === 'spots' && styles.tabBtnActive]}
          onPress={() => setTab('spots')}
        >
          <Ionicons name="compass" size={16} color={tab === 'spots' ? Colors.stone[700] : Colors.textMuted} />
          <Text style={[styles.tabText, tab === 'spots' && styles.tabTextActive]}>Gezilecek Yerler</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, tab === 'food' && styles.tabBtnActive]}
          onPress={() => setTab('food')}
        >
          <Ionicons name="restaurant" size={16} color={tab === 'food' ? Colors.stone[700] : Colors.textMuted} />
          <Text style={[styles.tabText, tab === 'food' && styles.tabTextActive]}>Yöresel Lezzetler</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
        {tab === 'spots' ? (
          <View style={styles.spotsContainer}>
            {TOURIST_SPOTS.map((spot) => (
              <View key={spot.id} style={styles.spotCard}>
                <View style={[styles.spotIconWrap, { backgroundColor: spot.color + '18' }]}>
                  <Ionicons name={spot.icon} size={28} color={spot.color} />
                </View>
                <View style={styles.spotContent}>
                  <View style={styles.spotTop}>
                    <Badge
                      label={spot.category}
                      color={Colors.stone[50]}
                      textColor={Colors.stone[600]}
                    />
                    <View style={styles.spotDist}>
                      <Ionicons name="location-outline" size={11} color={Colors.textMuted} />
                      <Text style={styles.spotDistText}>{spot.distance}</Text>
                    </View>
                  </View>
                  <Text style={styles.spotName}>{spot.name}</Text>
                  <Text style={styles.spotDesc} numberOfLines={2}>{spot.description}</Text>
                  <TouchableOpacity
                    style={styles.spotMapBtn}
                    onPress={() => Linking.openURL(`https://maps.google.com/?q=${encodeURIComponent(spot.name + ' Bitlis')}`)}
                  >
                    <Ionicons name="map-outline" size={13} color={Colors.stone[600]} />
                    <Text style={styles.spotMapText}>Haritada Aç</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.foodContainer}>
            <View style={styles.foodHeader}>
              <Text style={styles.foodHeaderText}>Bitlis'in Geleneksel Lezzetleri</Text>
              <Text style={styles.foodHeaderSub}>Yüzyıllarca süregelen tatlar</Text>
            </View>
            {LOCAL_FOODS.map((food) => (
              <View key={food.name} style={styles.foodCard}>
                <View style={styles.foodEmoji}>
                  <Text style={{ fontSize: 28 }}>{food.icon}</Text>
                </View>
                <View style={styles.foodInfo}>
                  <Text style={styles.foodName}>{food.name}</Text>
                  <Text style={styles.foodDesc}>{food.desc}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={Colors.gray[300]} />
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },

  hero: {
    backgroundColor: Colors.stone[700],
    paddingTop: (StatusBar.currentHeight || 44) + 8,
    paddingBottom: Spacing.xl,
    overflow: 'hidden',
  },
  heroCircle1: {
    position: 'absolute', width: 200, height: 200, borderRadius: 100,
    backgroundColor: Colors.stone[600], opacity: 0.4, top: -60, right: -40,
  },
  heroCircle2: {
    position: 'absolute', width: 120, height: 120, borderRadius: 60,
    backgroundColor: Colors.gold[500], opacity: 0.12, bottom: 20, left: -30,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
    marginHorizontal: Spacing.lg, marginBottom: Spacing.md,
  },
  heroContent: { paddingHorizontal: Spacing.lg },
  heroTitle: { ...Typography.h1, color: Colors.white, marginTop: 8, marginBottom: 4 },
  heroSub: { ...Typography.body, color: 'rgba(255,255,255,0.65)', marginBottom: Spacing.lg },
  heroStats: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: BorderRadius.lg, padding: Spacing.md,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)',
  },
  heroStat: { flex: 1, alignItems: 'center' },
  heroStatValue: { ...Typography.h3, color: Colors.white },
  heroStatLabel: { ...Typography.caption, color: 'rgba(255,255,255,0.6)', textAlign: 'center' },
  heroStatDivider: { width: 1, height: 36, backgroundColor: 'rgba(255,255,255,0.15)' },

  tabWrap: {
    flexDirection: 'row', backgroundColor: Colors.white,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
    paddingHorizontal: Spacing.lg, paddingTop: Spacing.sm,
  },
  tabBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingBottom: 12, paddingHorizontal: 4, marginRight: Spacing.xl,
    borderBottomWidth: 2, borderBottomColor: 'transparent',
  },
  tabBtnActive: { borderBottomColor: Colors.stone[600] },
  tabText: { ...Typography.btn, color: Colors.textMuted },
  tabTextActive: { color: Colors.stone[700] },

  scroll: { flex: 1 },

  spotsContainer: { padding: Spacing.lg, gap: Spacing.md },
  spotCard: {
    backgroundColor: Colors.white, borderRadius: BorderRadius.xl,
    padding: Spacing.lg, flexDirection: 'row', gap: Spacing.md, ...Shadows.md,
  },
  spotIconWrap: {
    width: 60, height: 60, borderRadius: BorderRadius.lg,
    alignItems: 'center', justifyContent: 'center',
  },
  spotContent: { flex: 1 },
  spotTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  spotDist: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  spotDistText: { ...Typography.caption, color: Colors.textMuted },
  spotName: { ...Typography.h4, color: Colors.textPrimary, marginBottom: 4 },
  spotDesc: { ...Typography.bodySm, color: Colors.textSecondary, lineHeight: 19, marginBottom: 8 },
  spotMapBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    alignSelf: 'flex-start',
    backgroundColor: Colors.stone[50], paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: BorderRadius.full, borderWidth: 1, borderColor: Colors.stone[200],
  },
  spotMapText: { ...Typography.caption, color: Colors.stone[600], fontWeight: '600' },

  foodContainer: { padding: Spacing.lg, gap: Spacing.sm },
  foodHeader: {
    backgroundColor: Colors.stone[700], borderRadius: BorderRadius.xl,
    padding: Spacing.lg, marginBottom: Spacing.md,
  },
  foodHeaderText: { ...Typography.h3, color: Colors.white, marginBottom: 4 },
  foodHeaderSub: { ...Typography.body, color: 'rgba(255,255,255,0.65)' },
  foodCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.white, borderRadius: BorderRadius.lg,
    padding: Spacing.md, gap: Spacing.md, ...Shadows.sm,
  },
  foodEmoji: {
    width: 52, height: 52, borderRadius: BorderRadius.md,
    backgroundColor: Colors.stone[50], alignItems: 'center', justifyContent: 'center',
  },
  foodInfo: { flex: 1 },
  foodName: { ...Typography.h4, color: Colors.textPrimary, marginBottom: 2 },
  foodDesc: { ...Typography.caption, color: Colors.textMuted },
});
