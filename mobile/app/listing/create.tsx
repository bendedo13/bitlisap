import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Switch,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { listingService } from '../../services/listingService';
import { useQueryClient } from '@tanstack/react-query';
import { districts } from '../../constants/districts';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import PrimaryButton from '../../components/ui/PrimaryButton';

const CATEGORIES = [
  { key: 'ELECTRONICS', label: 'Elektronik', icon: '📱' },
  { key: 'VEHICLES', label: 'Araçlar', icon: '🚗' },
  { key: 'REAL_ESTATE', label: 'Emlak', icon: '🏠' },
  { key: 'CLOTHES', label: 'Giyim', icon: '👕' },
  { key: 'FOOD', label: 'Yiyecek', icon: '🍎' },
  { key: 'SERVICES', label: 'Hizmetler', icon: '🔧' },
  { key: 'OTHER', label: 'Diğer', icon: '📦' },
];

export default function CreateListingScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [isNegotiable, setIsNegotiable] = useState(false);
  const [category, setCategory] = useState('');
  const [district, setDistrict] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreate = async () => {
    if (!title.trim()) { setError('Başlık gerekli'); return; }
    if (!category) { setError('Kategori seçin'); return; }
    if (!district) { setError('İlçe seçin'); return; }
    setError('');
    setLoading(true);
    try {
      await listingService.create({
        title, description, price: price ? parseFloat(price) : undefined,
        isNegotiable, category, district,
      });
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      router.back();
    } catch {
      setError('İlan oluşturulamadı. Lütfen tekrar deneyin.');
    } finally { setLoading(false); }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.hero}>
        <View style={styles.heroCircle} />
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="close" size={20} color={Colors.white} />
        </TouchableOpacity>
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>İlan Ver</Text>
          <Text style={styles.heroSub}>Bitlis pazarında satışa çıkarın</Text>
        </View>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: Spacing.lg, paddingBottom: 40 }}>
          {/* Title */}
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Başlık *</Text>
            <TextInput
              style={styles.input}
              placeholder="İlan başlığını girin"
              placeholderTextColor={Colors.gray[300]}
              value={title}
              onChangeText={setTitle}
              maxLength={100}
            />
            <Text style={styles.charCount}>{title.length}/100</Text>
          </View>

          {/* Description */}
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Açıklama</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Ürün/hizmet hakkında detayları girin..."
              placeholderTextColor={Colors.gray[300]}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              maxLength={1000}
            />
          </View>

          {/* Price */}
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Fiyat (₺)</Text>
            <View style={styles.priceRow}>
              <View style={[styles.input, styles.priceInput]}>
                <Text style={styles.priceCurrency}>₺</Text>
                <TextInput
                  style={styles.priceTextInput}
                  placeholder="0"
                  placeholderTextColor={Colors.gray[300]}
                  value={price}
                  onChangeText={(t) => setPrice(t.replace(/[^0-9.]/g, ''))}
                  keyboardType="decimal-pad"
                />
              </View>
              <View style={styles.negotiableRow}>
                <Text style={styles.negotiableLabel}>Pazarlıklı</Text>
                <Switch
                  value={isNegotiable}
                  onValueChange={setIsNegotiable}
                  trackColor={{ false: Colors.gray[200], true: Colors.forest[300] }}
                  thumbColor={isNegotiable ? Colors.forest[500] : Colors.gray[400]}
                />
              </View>
            </View>
          </View>

          {/* Category */}
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Kategori *</Text>
            <View style={styles.chipGrid}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat.key}
                  style={[styles.catChip, category === cat.key && styles.catChipActive]}
                  onPress={() => setCategory(cat.key)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.catChipEmoji}>{cat.icon}</Text>
                  <Text style={[styles.catChipText, category === cat.key && { color: Colors.white }]}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* District */}
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>İlçe *</Text>
            <View style={styles.chipGrid}>
              {districts.map((d) => (
                <TouchableOpacity
                  key={d}
                  style={[styles.distChip, district === d && styles.distChipActive]}
                  onPress={() => setDistrict(d)}
                  activeOpacity={0.8}
                >
                  {district === d && <Ionicons name="checkmark" size={11} color={Colors.white} />}
                  <Text style={[styles.distChipText, district === d && { color: Colors.white }]}>{d}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <PrimaryButton
            label="İlanı Yayınla"
            onPress={handleCreate}
            loading={loading}
            size="lg"
            style={{ marginTop: Spacing.md }}
            leftIcon={<Ionicons name="checkmark-circle" size={20} color={Colors.white} />}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },

  hero: {
    backgroundColor: Colors.forest[500],
    paddingTop: (StatusBar.currentHeight || 44) + 8,
    paddingBottom: Spacing.xl,
    overflow: 'hidden',
  },
  heroCircle: {
    position: 'absolute', width: 180, height: 180, borderRadius: 90,
    backgroundColor: Colors.forest[400], opacity: 0.3, top: -50, right: -40,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
    marginHorizontal: Spacing.lg, marginBottom: Spacing.sm,
  },
  heroContent: { paddingHorizontal: Spacing.lg },
  heroTitle: { ...Typography.h2, color: Colors.white, marginBottom: 4 },
  heroSub: { ...Typography.body, color: 'rgba(255,255,255,0.65)' },

  field: { marginBottom: Spacing.lg },
  fieldLabel: {
    ...Typography.label, color: Colors.textSecondary,
    marginBottom: 8, textTransform: 'uppercase',
  },
  input: {
    backgroundColor: Colors.white, borderWidth: 1.5, borderColor: Colors.border,
    borderRadius: BorderRadius.lg, paddingHorizontal: 14, paddingVertical: 13,
    ...Typography.body, color: Colors.textPrimary,
  },
  textArea: { height: 110, textAlignVertical: 'top', paddingTop: 13 },
  charCount: { ...Typography.caption, color: Colors.textMuted, textAlign: 'right', marginTop: 4 },

  priceRow: { flexDirection: 'row', gap: Spacing.sm, alignItems: 'center' },
  priceInput: { flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12 },
  priceCurrency: { ...Typography.h3, color: Colors.forest[500], marginRight: 6 },
  priceTextInput: { flex: 1, ...Typography.h3, color: Colors.textPrimary },
  negotiableRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  negotiableLabel: { ...Typography.body, color: Colors.textSecondary },

  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  catChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: BorderRadius.full,
    backgroundColor: Colors.white, borderWidth: 1.5, borderColor: Colors.border,
  },
  catChipActive: { backgroundColor: Colors.forest[500], borderColor: Colors.forest[500] },
  catChipEmoji: { fontSize: 14 },
  catChipText: { ...Typography.btnSm, color: Colors.textSecondary },

  distChip: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: BorderRadius.full,
    backgroundColor: Colors.white, borderWidth: 1.5, borderColor: Colors.border,
  },
  distChipActive: { backgroundColor: Colors.primary[600], borderColor: Colors.primary[600] },
  distChipText: { ...Typography.btnSm, color: Colors.textSecondary },

  errorText: { ...Typography.bodySm, color: Colors.danger[600], textAlign: 'center', marginBottom: 8 },
});
