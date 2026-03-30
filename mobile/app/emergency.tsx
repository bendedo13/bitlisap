import React from 'react';
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

const EMERGENCY_NUMBERS = [
  { name: 'Acil Çağrı', number: '112', icon: 'call' as const, color: Colors.danger[600], bg: Colors.danger[100], isPrimary: true },
  { name: 'Polis', number: '155', icon: 'shield-checkmark' as const, color: Colors.primary[600], bg: Colors.primary[50] },
  { name: 'Jandarma', number: '156', icon: 'shield-half' as const, color: Colors.primary[700], bg: Colors.primary[50] },
  { name: 'İtfaiye', number: '110', icon: 'flame' as const, color: Colors.sunset[500], bg: Colors.stone[50] },
  { name: 'Orman İtfaiyesi', number: '177', icon: 'leaf' as const, color: Colors.forest[500], bg: Colors.forest[100] },
  { name: 'AFAD', number: '122', icon: 'warning' as const, color: Colors.sunset[600], bg: Colors.stone[50] },
  { name: 'Sahil Güvenlik', number: '158', icon: 'boat' as const, color: Colors.primary[500], bg: Colors.primary[50] },
  { name: 'ALO Şiddet', number: '183', icon: 'hand-left' as const, color: Colors.purple[500], bg: Colors.purple[100] },
];

const HOSPITAL_NUMBERS = [
  { name: 'Bitlis Devlet Hastanesi', number: '04342260200', address: 'Merkez' },
  { name: 'Tatvan Devlet Hastanesi', number: '04342270200', address: 'Tatvan' },
  { name: 'Ahlat Devlet Hastanesi', number: '04342120300', address: 'Ahlat' },
  { name: 'Alo Doktor', number: '182', address: 'Eczane/Doktor' },
];

const OTHER_NUMBERS = [
  { name: 'Belediye', number: '04342120200', icon: 'business-outline' as const },
  { name: 'Su & Elektrik', number: '186', icon: 'flash-outline' as const },
  { name: 'Doğalgaz', number: '187', icon: 'flame-outline' as const },
  { name: 'Zehir Danışma', number: '114', icon: 'medkit-outline' as const },
];

export default function EmergencyScreen() {
  const router = useRouter();

  const call = (number: string) => Linking.openURL(`tel:${number}`);

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
          <View style={styles.alertBadge}>
            <Ionicons name="warning" size={16} color={Colors.danger[600]} />
            <Text style={styles.alertBadgeText}>ACİL YARDIM</Text>
          </View>
          <Text style={styles.heroTitle}>Acil Numaralar</Text>
          <Text style={styles.heroSub}>Tehlike anında hızlı aramak için dokunun</Text>
        </View>
        {/* Big 112 Button */}
        <TouchableOpacity style={styles.bigCallBtn} onPress={() => call('112')} activeOpacity={0.85}>
          <View style={styles.bigCallInner}>
            <Ionicons name="call" size={28} color={Colors.white} />
            <View>
              <Text style={styles.bigCallNumber}>112</Text>
              <Text style={styles.bigCallLabel}>Acil Çağrı Merkezi</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
        {/* Emergency Numbers */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acil Hizmetler</Text>
          <View style={styles.numbersGrid}>
            {EMERGENCY_NUMBERS.filter(n => !n.isPrimary).map((n) => (
              <TouchableOpacity
                key={n.name}
                style={[styles.numCard, { backgroundColor: n.bg }]}
                onPress={() => call(n.number)}
                activeOpacity={0.8}
              >
                <View style={[styles.numIcon, { backgroundColor: n.color + '20' }]}>
                  <Ionicons name={n.icon} size={22} color={n.color} />
                </View>
                <Text style={[styles.numName, { color: n.color }]}>{n.name}</Text>
                <Text style={[styles.numNumber, { color: n.color }]}>{n.number}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Hospitals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sağlık Hizmetleri</Text>
          <View style={styles.listCard}>
            {HOSPITAL_NUMBERS.map((h, i) => (
              <TouchableOpacity
                key={h.name}
                style={[styles.listItem, i > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: Colors.border }]}
                onPress={() => call(h.number)}
                activeOpacity={0.8}
              >
                <View style={styles.listIconWrap}>
                  <Ionicons name="medical" size={18} color={Colors.forest[500]} />
                </View>
                <View style={styles.listInfo}>
                  <Text style={styles.listName}>{h.name}</Text>
                  <Text style={styles.listAddress}>{h.address}</Text>
                </View>
                <View style={styles.callChip}>
                  <Ionicons name="call" size={13} color={Colors.forest[600]} />
                  <Text style={styles.callChipText}>{h.number}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Other Numbers */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Diğer Hizmetler</Text>
          <View style={styles.listCard}>
            {OTHER_NUMBERS.map((o, i) => (
              <TouchableOpacity
                key={o.name}
                style={[styles.listItem, i > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: Colors.border }]}
                onPress={() => call(o.number)}
                activeOpacity={0.8}
              >
                <View style={styles.listIconWrap}>
                  <Ionicons name={o.icon} size={18} color={Colors.primary[500]} />
                </View>
                <Text style={[styles.listName, { flex: 1 }]}>{o.name}</Text>
                <View style={styles.callChip}>
                  <Ionicons name="call" size={13} color={Colors.primary[600]} />
                  <Text style={[styles.callChipText, { color: Colors.primary[600] }]}>{o.number}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <Ionicons name="information-circle" size={20} color={Colors.primary[500]} />
          <Text style={styles.infoText}>
            Deprem, sel veya yangın gibi acil durumlarda önce güvenli bir yere geçin, ardından 112'yi arayın.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },

  hero: {
    backgroundColor: Colors.danger[700],
    paddingTop: (StatusBar.currentHeight || 44) + 8,
    paddingBottom: Spacing.lg,
    overflow: 'hidden',
  },
  heroCircle: {
    position: 'absolute', width: 200, height: 200, borderRadius: 100,
    backgroundColor: Colors.danger[600], opacity: 0.3, top: -60, right: -40,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
    marginHorizontal: Spacing.lg, marginBottom: Spacing.md,
  },
  heroContent: { paddingHorizontal: Spacing.lg, marginBottom: Spacing.lg },
  alertBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.white, alignSelf: 'flex-start',
    paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: BorderRadius.full, marginBottom: Spacing.sm,
  },
  alertBadgeText: { ...Typography.label, color: Colors.danger[600] },
  heroTitle: { ...Typography.h2, color: Colors.white, marginBottom: 4 },
  heroSub: { ...Typography.body, color: 'rgba(255,255,255,0.7)' },

  bigCallBtn: {
    marginHorizontal: Spacing.lg,
    backgroundColor: Colors.danger[600],
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.25)',
    ...Shadows.lg,
  },
  bigCallInner: { flexDirection: 'row', alignItems: 'center', gap: Spacing.lg },
  bigCallNumber: { fontSize: 34, fontWeight: '800', color: Colors.white },
  bigCallLabel: { ...Typography.bodySm, color: 'rgba(255,255,255,0.8)' },

  scroll: { flex: 1 },
  section: { padding: Spacing.lg, paddingBottom: 0 },
  sectionTitle: { ...Typography.h4, color: Colors.textPrimary, marginBottom: Spacing.md },

  numbersGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  numCard: {
    width: '47.5%', borderRadius: BorderRadius.lg,
    padding: Spacing.md, alignItems: 'center', gap: 6, ...Shadows.sm,
  },
  numIcon: {
    width: 48, height: 48, borderRadius: BorderRadius.md,
    alignItems: 'center', justifyContent: 'center',
  },
  numName: { ...Typography.label, textAlign: 'center' },
  numNumber: { fontSize: 18, fontWeight: '800' },

  listCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.xl, ...Shadows.md, overflow: 'hidden' },
  listItem: {
    flexDirection: 'row', alignItems: 'center',
    padding: Spacing.md, gap: Spacing.md,
  },
  listIconWrap: {
    width: 40, height: 40, borderRadius: BorderRadius.md,
    backgroundColor: Colors.gray[100], alignItems: 'center', justifyContent: 'center',
  },
  listInfo: { flex: 1 },
  listName: { ...Typography.body, color: Colors.textPrimary, fontWeight: '500' },
  listAddress: { ...Typography.caption, color: Colors.textMuted, marginTop: 1 },
  callChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.forest[100], paddingHorizontal: 8, paddingVertical: 5,
    borderRadius: BorderRadius.md,
  },
  callChipText: { ...Typography.label, color: Colors.forest[600] },

  infoBanner: {
    flexDirection: 'row', gap: Spacing.sm, alignItems: 'flex-start',
    margin: Spacing.lg, backgroundColor: Colors.primary[50],
    borderRadius: BorderRadius.lg, padding: Spacing.md,
    borderWidth: 1, borderColor: Colors.primary[200],
  },
  infoText: { flex: 1, ...Typography.bodySm, color: Colors.primary[800], lineHeight: 20 },
});
