import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/authStore';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import Badge from '../../components/ui/Badge';
import PrimaryButton from '../../components/ui/PrimaryButton';

interface MenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  sublabel?: string;
  onPress: () => void;
  rightElement?: React.ReactNode;
  color?: string;
  danger?: boolean;
}

function MenuItem({ icon, label, sublabel, onPress, rightElement, color, danger }: MenuItemProps) {
  const iconColor = danger ? Colors.danger[600] : color || Colors.primary[600];
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.75}>
      <View style={[styles.menuIcon, { backgroundColor: iconColor + '15' }]}>
        <Ionicons name={icon} size={20} color={iconColor} />
      </View>
      <View style={styles.menuContent}>
        <Text style={[styles.menuLabel, danger && { color: Colors.danger[600] }]}>{label}</Text>
        {sublabel && <Text style={styles.menuSublabel}>{sublabel}</Text>}
      </View>
      {rightElement || <Ionicons name="chevron-forward" size={16} color={Colors.gray[300]} />}
    </TouchableOpacity>
  );
}

function MenuSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.menuSection}>
      <Text style={styles.menuSectionTitle}>{title}</Text>
      <View style={styles.menuSectionCard}>{children}</View>
    </View>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert(
      'Çıkış Yap',
      'Hesabınızdan çıkmak istediğinize emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        { text: 'Çıkış Yap', style: 'destructive', onPress: logout },
      ]
    );
  };

  if (!isAuthenticated) {
    return (
      <View style={styles.root}>
        <StatusBar barStyle="light-content" />
        <View style={styles.unauthHero}>
          <View style={styles.heroCircle} />
          <Text style={styles.unauthTitle}>Bitlis Şehrim</Text>
          <Text style={styles.unauthSub}>Tüm özelliklere erişmek için{'\n'}giriş yapın</Text>
        </View>
        <View style={styles.unauthContent}>
          <View style={styles.unauthFeatures}>
            {['İlan oluştur', 'Haberler', 'Etkinlikler', 'Mesajlar', 'Puanlar'].map((f) => (
              <View key={f} style={styles.unauthFeatureItem}>
                <View style={styles.unauthFeatureDot} />
                <Text style={styles.unauthFeatureText}>{f}</Text>
              </View>
            ))}
          </View>
          <PrimaryButton
            label="Giriş Yap / Kayıt Ol"
            onPress={() => router.push('/(auth)/login' as any)}
            size="lg"
          />
          <Text style={styles.unauthNote}>Telefon numaranızla saniyeler içinde giriş yapın</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      {/* Profile Hero */}
      <View style={styles.hero}>
        <View style={styles.heroCircle} />
        <View style={styles.heroCircle2} />
        <View style={styles.heroContent}>
          <View style={styles.avatarWrap}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.fullName?.charAt(0)?.toUpperCase() || '?'}
              </Text>
            </View>
            <TouchableOpacity style={styles.avatarEditBtn}>
              <Ionicons name="camera" size={12} color={Colors.white} />
            </TouchableOpacity>
          </View>
          <View style={styles.heroInfo}>
            <Text style={styles.heroName}>{user?.fullName || 'Bitlis Sakini'}</Text>
            <Text style={styles.heroPhone}>{user?.phone}</Text>
            {user?.district && (
              <View style={styles.heroDistrict}>
                <Ionicons name="location" size={12} color="rgba(255,255,255,0.7)" />
                <Text style={styles.heroDistrictText}>{user.district}</Text>
              </View>
            )}
          </View>
        </View>
        {/* Points Row */}
        <View style={styles.pointsRow}>
          <View style={styles.pointsCard}>
            <Ionicons name="diamond" size={18} color={Colors.gold[400]} />
            <View>
              <Text style={styles.pointsValue}>{user?.cityPoints || 0}</Text>
              <Text style={styles.pointsLabel}>Bitlis Altını</Text>
            </View>
          </View>
          <View style={styles.pointsDivider} />
          <View style={styles.pointsCard}>
            <Ionicons name="ribbon" size={18} color={Colors.primary[300]} />
            <View>
              <Text style={styles.pointsValue}>{user?.userType === 'BUSINESS' ? 'Esnaf' : 'Sakin'}</Text>
              <Text style={styles.pointsLabel}>Üyelik Türü</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* My Content */}
        <MenuSection title="İçeriklerim">
          <MenuItem icon="pricetag-outline" label="İlanlarım" sublabel="Verdiğim ilanlar" onPress={() => {}} />
          <MenuItem icon="heart-outline" label="Favori İlanlar" onPress={() => {}} />
          <MenuItem icon="chatbubbles-outline" label="Mesajlarım" sublabel="Sohbetleriniz" onPress={() => router.push('/conversations' as any)} />
          <MenuItem icon="notifications-outline" label="Bildirimler" onPress={() => {}} />
        </MenuSection>

        {/* Business */}
        {user?.userType === 'BUSINESS' && (
          <MenuSection title="Esnaf Paneli">
            <MenuItem
              icon="storefront-outline"
              label="İşletmemi Yönet"
              sublabel="Kampanya, istatistik ve yorumlar"
              onPress={() => router.push('/business/panel' as any)}
              color={Colors.forest[500]}
            />
          </MenuSection>
        )}

        {/* City */}
        <MenuSection title="Şehir">
          <MenuItem icon="calendar-outline" label="Etkinlikler" onPress={() => router.push('/events' as any)} />
          <MenuItem icon="alert-circle-outline" label="Acil Yardım" onPress={() => router.push('/emergency' as any)} color={Colors.danger[600]} />
          <MenuItem icon="compass-outline" label="Turizm & Tarih" onPress={() => router.push('/tourism' as any)} color={Colors.stone[600]} />
          <MenuItem icon="megaphone-outline" label="Reklam Ver" sublabel="İşletmeni tanıt, müşteri kazan" onPress={() => router.push('/ads/create' as any)} color={Colors.sunset[500]} />
        </MenuSection>

        {/* Settings */}
        <MenuSection title="Hesap">
          <MenuItem icon="settings-outline" label="Ayarlar" sublabel="Profil, bildirim tercihleri" onPress={() => {}} />
          <MenuItem icon="help-circle-outline" label="Yardım & Destek" onPress={() => {}} />
          <MenuItem icon="log-out-outline" label="Çıkış Yap" onPress={handleLogout} danger />
        </MenuSection>

        <Text style={styles.versionText}>Bitlis Şehrim v1.0.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },

  // Hero
  hero: {
    backgroundColor: Colors.primary[800],
    paddingTop: (StatusBar.currentHeight || 44) + 12,
    paddingBottom: 0,
    overflow: 'hidden',
  },
  heroCircle: {
    position: 'absolute', width: 220, height: 220, borderRadius: 110,
    backgroundColor: Colors.primary[600], opacity: 0.25, top: -60, right: -50,
  },
  heroCircle2: {
    position: 'absolute', width: 100, height: 100, borderRadius: 50,
    backgroundColor: Colors.gold[400], opacity: 0.08, bottom: 50, left: -20,
  },
  heroContent: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: Spacing.lg, paddingBottom: Spacing.lg, gap: Spacing.md,
  },
  avatarWrap: { position: 'relative' },
  avatar: {
    width: 70, height: 70, borderRadius: 35,
    backgroundColor: Colors.primary[500],
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 3, borderColor: 'rgba(255,255,255,0.3)',
  },
  avatarText: { fontSize: 28, fontWeight: '700', color: Colors.white },
  avatarEditBtn: {
    position: 'absolute', bottom: 0, right: 0,
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: Colors.primary[600], borderWidth: 2, borderColor: Colors.white,
    alignItems: 'center', justifyContent: 'center',
  },
  heroInfo: { flex: 1 },
  heroName: { ...Typography.h3, color: Colors.white, marginBottom: 2 },
  heroPhone: { ...Typography.bodySm, color: 'rgba(255,255,255,0.6)', marginBottom: 4 },
  heroDistrict: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  heroDistrictText: { ...Typography.caption, color: 'rgba(255,255,255,0.65)' },

  pointsRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginHorizontal: Spacing.lg, marginBottom: Spacing.lg,
    borderRadius: BorderRadius.lg, padding: Spacing.md,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  pointsCard: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  pointsDivider: { width: 1, height: 36, backgroundColor: 'rgba(255,255,255,0.15)' },
  pointsValue: { ...Typography.h4, color: Colors.white },
  pointsLabel: { ...Typography.caption, color: 'rgba(255,255,255,0.55)' },

  scroll: { flex: 1 },

  menuSection: { marginTop: Spacing.lg, paddingHorizontal: Spacing.lg },
  menuSectionTitle: {
    ...Typography.label, color: Colors.textMuted,
    marginBottom: Spacing.sm, marginLeft: 4,
    textTransform: 'uppercase',
  },
  menuSectionCard: {
    backgroundColor: Colors.white, borderRadius: BorderRadius.xl, overflow: 'hidden', ...Shadows.sm,
  },
  menuItem: {
    flexDirection: 'row', alignItems: 'center',
    padding: Spacing.md, gap: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Colors.border,
  },
  menuIcon: {
    width: 40, height: 40, borderRadius: BorderRadius.md,
    alignItems: 'center', justifyContent: 'center',
  },
  menuContent: { flex: 1 },
  menuLabel: { ...Typography.body, color: Colors.textPrimary, fontWeight: '500' },
  menuSublabel: { ...Typography.caption, color: Colors.textMuted, marginTop: 1 },

  versionText: {
    ...Typography.caption, color: Colors.textMuted,
    textAlign: 'center', marginTop: Spacing.xl, marginBottom: Spacing.md,
  },

  // Unauthenticated
  unauthHero: {
    backgroundColor: Colors.primary[800],
    paddingTop: (StatusBar.currentHeight || 44) + 16,
    paddingBottom: Spacing.xxl,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    overflow: 'hidden',
  },
  unauthTitle: { ...Typography.h1, color: Colors.white, marginBottom: 8 },
  unauthSub: { ...Typography.body, color: 'rgba(255,255,255,0.65)', textAlign: 'center', lineHeight: 24 },
  unauthContent: { flex: 1, padding: Spacing.xl, justifyContent: 'center' },
  unauthFeatures: { marginBottom: Spacing.xl, gap: Spacing.sm },
  unauthFeatureItem: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  unauthFeatureDot: {
    width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary[400],
  },
  unauthFeatureText: { ...Typography.body, color: Colors.textPrimary },
  unauthNote: {
    ...Typography.caption, color: Colors.textMuted, textAlign: 'center', marginTop: Spacing.md,
  },
});
