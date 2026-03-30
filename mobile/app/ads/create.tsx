import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import api from '../../services/api';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';

const PLACEMENTS = [
  { key: 'HOME_BANNER', label: 'Ana Sayfa Banner', desc: 'En çok görünürlük', price: '0.50₺/tık', icon: 'home-outline' as const, color: Colors.primary[600] },
  { key: 'NEWS_INLINE', label: 'Haber Akışı', desc: 'Haberler arasında', price: '0.30₺/tık', icon: 'newspaper-outline' as const, color: Colors.primary[400] },
  { key: 'MARKET_TOP', label: 'Pazar Üst Sıra', desc: 'Pazarda en üstte', price: '0.40₺/tık', icon: 'pricetag-outline' as const, color: Colors.forest[500] },
  { key: 'MAP_FEATURED', label: 'Harita Öne Çıkan', desc: 'Haritada vurgulu', price: '0.35₺/tık', icon: 'map-outline' as const, color: Colors.stone[600] },
  { key: 'SPLASH_SCREEN', label: 'Açılış Ekranı', desc: 'Uygulama açılışında', price: '0.75₺/tık', icon: 'phone-portrait-outline' as const, color: Colors.purple[500] },
  { key: 'CATEGORY_SPONSOR', label: 'Kategori Sponsor', desc: 'Kategori sayfası', price: '0.25₺/tık', icon: 'grid-outline' as const, color: Colors.sunset[500] },
];

export default function CreateAdScreen() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [placement, setPlacement] = useState('');
  const [budget, setBudget] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!title || !placement || !budget) {
      Alert.alert('Hata', 'Başlık, yerleşim ve bütçe alanları zorunlu');
      return;
    }
    setLoading(true);
    try {
      const now = new Date();
      const endDate = new Date(now);
      endDate.setMonth(endDate.getMonth() + 1);

      await api.post('/ads', {
        title,
        description,
        placement,
        totalBudget: parseFloat(budget),
        startDate: now.toISOString(),
        endDate: endDate.toISOString(),
      });
      Alert.alert('Başarılı', 'Reklam talebiniz oluşturuldu. Onay bekleniyor.', [
        { text: 'Tamam', onPress: () => router.back() }
      ]);
    } catch (e: any) {
      Alert.alert('Hata', e?.response?.data?.message || 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <View style={styles.headerCircle} />
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={Colors.white} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Reklam Ver</Text>
          <Text style={styles.headerSub}>İşletmenizi tanıtın, müşteri kazanın</Text>
        </View>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: Spacing.lg, paddingBottom: 100 }}>

        {/* Title */}
        <View style={styles.field}>
          <Text style={styles.label}>Reklam Başlığı *</Text>
          <TextInput style={styles.input} placeholder="Ör: Yeni Açılış! %20 İndirim" placeholderTextColor={Colors.gray[400]} value={title} onChangeText={setTitle} />
        </View>

        {/* Description */}
        <View style={styles.field}>
          <Text style={styles.label}>Açıklama</Text>
          <TextInput style={[styles.input, { height: 80, textAlignVertical: 'top' }]} placeholder="Reklam detayları..." placeholderTextColor={Colors.gray[400]} multiline value={description} onChangeText={setDescription} />
        </View>

        {/* Placement */}
        <View style={styles.field}>
          <Text style={styles.label}>Reklam Yerleşimi *</Text>
          <View style={styles.placementGrid}>
            {PLACEMENTS.map((p) => (
              <TouchableOpacity
                key={p.key}
                style={[styles.placementCard, placement === p.key && { borderColor: p.color, borderWidth: 2, backgroundColor: p.color + '08' }]}
                onPress={() => setPlacement(p.key)}
                activeOpacity={0.8}
              >
                <Ionicons name={p.icon} size={22} color={placement === p.key ? p.color : Colors.gray[400]} />
                <Text style={[styles.placementLabel, placement === p.key && { color: p.color }]}>{p.label}</Text>
                <Text style={styles.placementDesc}>{p.desc}</Text>
                <Text style={[styles.placementPrice, { color: p.color }]}>{p.price}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Budget */}
        <View style={styles.field}>
          <Text style={styles.label}>Toplam Bütçe (₺) *</Text>
          <View style={styles.budgetRow}>
            <TextInput style={[styles.input, { flex: 1 }]} placeholder="Min. 50₺" placeholderTextColor={Colors.gray[400]} keyboardType="numeric" value={budget} onChangeText={setBudget} />
            <Text style={styles.budgetHint}>₺</Text>
          </View>
          <View style={styles.budgetChips}>
            {['100', '250', '500', '1000'].map((b) => (
              <TouchableOpacity key={b} style={[styles.budgetChip, budget === b && { backgroundColor: Colors.primary[600] }]} onPress={() => setBudget(b)}>
                <Text style={[styles.budgetChipText, budget === b && { color: Colors.white }]}>{b}₺</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle-outline" size={20} color={Colors.primary[500]} />
          <View style={{ flex: 1 }}>
            <Text style={styles.infoTitle}>Nasıl Çalışır?</Text>
            <Text style={styles.infoText}>Reklam talebiniz onaylandıktan sonra yayınlanır. Tıklama başına ücretlendirilirsiniz. Bütçeniz bittiğinde reklam otomatik durur.</Text>
          </View>
        </View>

        <TouchableOpacity style={[styles.submitBtn, { opacity: loading ? 0.7 : 1 }]} onPress={handleCreate} disabled={loading} activeOpacity={0.85}>
          {loading ? <ActivityIndicator color={Colors.white} /> : (
            <>
              <Text style={styles.submitText}>Reklam Talebi Gönder</Text>
              <Ionicons name="megaphone-outline" size={18} color={Colors.white} />
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.primary[800],
    paddingTop: (StatusBar.currentHeight || 44) + 8,
    paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xl,
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    overflow: 'hidden',
  },
  headerCircle: { position: 'absolute', width: 160, height: 160, borderRadius: 80, backgroundColor: Colors.primary[600], opacity: 0.2, top: -40, right: -30 },
  backBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { ...Typography.h2, color: Colors.white },
  headerSub: { ...Typography.caption, color: 'rgba(255,255,255,0.55)' },

  scroll: { flex: 1 },
  field: { marginBottom: Spacing.lg },
  label: { ...Typography.label, color: Colors.textSecondary, marginBottom: 8, textTransform: 'uppercase' },
  input: {
    backgroundColor: Colors.white, borderRadius: BorderRadius.lg,
    borderWidth: 1.5, borderColor: Colors.border,
    paddingHorizontal: 14, paddingVertical: 12,
    ...Typography.body, color: Colors.textPrimary,
  },

  placementGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  placementCard: {
    width: '48%', backgroundColor: Colors.white, borderRadius: BorderRadius.lg,
    padding: Spacing.md, alignItems: 'center', gap: 4,
    borderWidth: 1.5, borderColor: Colors.border, ...Shadows.sm,
  },
  placementLabel: { ...Typography.label, color: Colors.textPrimary, textAlign: 'center' },
  placementDesc: { ...Typography.caption, color: Colors.textMuted, textAlign: 'center' },
  placementPrice: { ...Typography.label, marginTop: 4 },

  budgetRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  budgetHint: { ...Typography.h3, color: Colors.textMuted },
  budgetChips: { flexDirection: 'row', gap: 8, marginTop: 8 },
  budgetChip: {
    paddingHorizontal: 14, paddingVertical: 7,
    borderRadius: BorderRadius.full, backgroundColor: Colors.gray[100],
  },
  budgetChipText: { ...Typography.label, color: Colors.textSecondary },

  infoCard: {
    flexDirection: 'row', gap: 10,
    backgroundColor: Colors.primary[50], borderRadius: BorderRadius.lg,
    padding: Spacing.md, marginBottom: Spacing.lg,
    borderWidth: 1, borderColor: Colors.primary[200],
  },
  infoTitle: { ...Typography.label, color: Colors.primary[700], marginBottom: 4 },
  infoText: { ...Typography.bodySm, color: Colors.primary[600], lineHeight: 20 },

  submitBtn: {
    backgroundColor: Colors.primary[600], borderRadius: BorderRadius.lg,
    paddingVertical: 16, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 8, ...Shadows.md,
  },
  submitText: { ...Typography.btnLg, color: Colors.white },
});
