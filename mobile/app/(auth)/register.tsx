import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { userService } from '../../services/userService';
import { useAuthStore } from '../../store/authStore';
import { districts } from '../../constants/districts';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import PrimaryButton from '../../components/ui/PrimaryButton';

export default function RegisterScreen() {
  const router = useRouter();
  const { updateUser } = useAuthStore();
  const [fullName, setFullName] = useState('');
  const [district, setDistrict] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!fullName.trim()) { setError('İsim soyisim gerekli'); return; }
    if (!district) { setError('Lütfen ilçenizi seçin'); return; }
    setError('');
    setLoading(true);
    try {
      const data = await userService.updateMe({ fullName, district });
      updateUser(data.user);
      router.replace('/(tabs)' as any);
    } catch {
      setError('Profil güncellenemedi. Lütfen tekrar deneyin.');
    } finally { setLoading(false); }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      <View style={styles.hero}>
        <View style={styles.heroCircle} />
        <Text style={styles.heroTitle}>Profilinizi Oluşturun</Text>
        <Text style={styles.heroSub}>Bitlis Şehrim ailesine hoş geldiniz</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          {/* Name */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Ad Soyad</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="person-outline" size={18} color={Colors.gray[400]} />
              <TextInput
                style={styles.input}
                placeholder="Ad ve soyadınızı girin"
                placeholderTextColor={Colors.gray[300]}
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize="words"
              />
            </View>
          </View>

          {/* District */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>İlçeniz</Text>
            <View style={styles.districtGrid}>
              {districts.map((d) => (
                <TouchableOpacity
                  key={d}
                  style={[
                    styles.districtChip,
                    district === d && styles.districtChipActive,
                  ]}
                  onPress={() => setDistrict(d)}
                  activeOpacity={0.8}
                >
                  {district === d && (
                    <Ionicons name="checkmark" size={12} color={Colors.white} />
                  )}
                  <Text style={[styles.districtText, district === d && styles.districtTextActive]}>
                    {d}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <PrimaryButton
            label="Kayıt Ol"
            onPress={handleSubmit}
            loading={loading}
            size="lg"
            style={{ marginTop: Spacing.md }}
          />
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },

  hero: {
    backgroundColor: Colors.primary[800],
    paddingTop: (StatusBar.currentHeight || 44) + 20,
    paddingBottom: Spacing.xxl,
    paddingHorizontal: Spacing.lg,
    overflow: 'hidden',
  },
  heroCircle: {
    position: 'absolute', width: 180, height: 180, borderRadius: 90,
    backgroundColor: Colors.primary[600], opacity: 0.25, top: -50, right: -40,
  },
  heroTitle: { ...Typography.h2, color: Colors.white, marginBottom: 6 },
  heroSub: { ...Typography.body, color: 'rgba(255,255,255,0.6)' },

  content: { padding: Spacing.lg },

  card: {
    backgroundColor: Colors.white, borderRadius: BorderRadius.xxl,
    padding: Spacing.xl, ...Shadows.xl,
  },

  fieldGroup: { marginBottom: Spacing.lg },
  fieldLabel: { ...Typography.label, color: Colors.textSecondary, marginBottom: 8, textTransform: 'uppercase' },

  inputWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    borderWidth: 1.5, borderColor: Colors.border,
    borderRadius: BorderRadius.lg, paddingHorizontal: 14, paddingVertical: 12,
  },
  input: { flex: 1, ...Typography.body, color: Colors.textPrimary },

  districtGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  districtChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 12, paddingVertical: 8,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.gray[100], borderWidth: 1.5, borderColor: Colors.border,
  },
  districtChipActive: {
    backgroundColor: Colors.primary[600], borderColor: Colors.primary[600],
  },
  districtText: { ...Typography.btnSm, color: Colors.textSecondary },
  districtTextActive: { color: Colors.white },

  errorText: { ...Typography.bodySm, color: Colors.danger[600], textAlign: 'center', marginTop: 8 },
});
