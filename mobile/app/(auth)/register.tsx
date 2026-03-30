import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import api from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { DISTRICTS } from '../../constants/districts';

const GENDERS = [
  { key: 'MALE', label: 'Erkek', icon: 'male-outline' as const },
  { key: 'FEMALE', label: 'Kadın', icon: 'female-outline' as const },
  { key: 'OTHER', label: 'Diğer', icon: 'people-outline' as const },
  { key: 'PREFER_NOT_TO_SAY', label: 'Belirtmek istemiyorum', icon: 'remove-outline' as const },
];

export default function RegisterScreen() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [step, setStep] = useState(1); // 1: zorunlu, 2: opsiyonel
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Required
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Optional
  const [age, setAge] = useState('');
  const [occupation, setOccupation] = useState('');
  const [gender, setGender] = useState('');
  const [district, setDistrict] = useState('');

  const handleRegister = async () => {
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setError('Zorunlu alanları doldurun'); return;
    }
    if (password.length < 6) { setError('Şifre en az 6 karakter olmalı'); return; }
    setError('');
    setLoading(true);
    try {
      const body: any = { fullName: fullName.trim(), email: email.trim(), password };
      if (age) body.age = parseInt(age);
      if (occupation) body.occupation = occupation.trim();
      if (gender) body.gender = gender;
      if (district) body.district = district;

      const res = await api.post('/auth/register', body);
      setAuth(res.data.user, res.data.token, res.data.refreshToken);
      router.replace('/(tabs)' as any);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Kayıt başarısız');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary[800]} />

      <View style={styles.hero}>
        <View style={styles.heroCircle} />
        <View style={styles.heroIcon}>
          <Ionicons name="person-add-outline" size={32} color={Colors.white} />
        </View>
        <Text style={styles.heroTitle}>Hesap Oluştur</Text>
        <Text style={styles.heroSub}>Bitlis Şehrim'e katılın</Text>
      </View>

      {/* Step Indicator */}
      <View style={styles.steps}>
        <TouchableOpacity style={[styles.stepItem, step >= 1 && styles.stepItemActive]} onPress={() => setStep(1)}>
          <Text style={[styles.stepNum, step >= 1 && styles.stepNumActive]}>1</Text>
          <Text style={[styles.stepLabel, step >= 1 && styles.stepLabelActive]}>Zorunlu</Text>
        </TouchableOpacity>
        <View style={[styles.stepLine, step >= 2 && { backgroundColor: Colors.primary[600] }]} />
        <TouchableOpacity style={[styles.stepItem, step >= 2 && styles.stepItemActive]} onPress={() => step >= 1 && setStep(2)}>
          <Text style={[styles.stepNum, step >= 2 && styles.stepNumActive]}>2</Text>
          <Text style={[styles.stepLabel, step >= 2 && styles.stepLabelActive]}>Opsiyonel</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {step === 1 ? (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Temel Bilgiler</Text>
            <Text style={styles.sectionSub}>Bu alanlar zorunludur</Text>

            {/* Full Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Ad Soyad *</Text>
              <View style={styles.inputRow}>
                <Ionicons name="person-outline" size={18} color={Colors.gray[400]} style={{ marginLeft: 14 }} />
                <TextInput style={styles.input} placeholder="Adınız Soyadınız" placeholderTextColor={Colors.gray[400]} value={fullName} onChangeText={setFullName} />
              </View>
            </View>

            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>E-posta *</Text>
              <View style={styles.inputRow}>
                <Ionicons name="mail-outline" size={18} color={Colors.gray[400]} style={{ marginLeft: 14 }} />
                <TextInput style={styles.input} placeholder="ornek@email.com" placeholderTextColor={Colors.gray[400]} keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
              </View>
            </View>

            {/* Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Şifre *</Text>
              <View style={styles.inputRow}>
                <Ionicons name="lock-closed-outline" size={18} color={Colors.gray[400]} style={{ marginLeft: 14 }} />
                <TextInput style={styles.input} placeholder="En az 6 karakter" placeholderTextColor={Colors.gray[400]} secureTextEntry={!showPassword} value={password} onChangeText={setPassword} />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ paddingRight: 14 }}>
                  <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={Colors.gray[400]} />
                </TouchableOpacity>
              </View>
            </View>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TouchableOpacity style={styles.btn} onPress={() => {
              if (!fullName.trim() || !email.trim() || !password.trim()) { setError('Tüm zorunlu alanları doldurun'); return; }
              if (password.length < 6) { setError('Şifre en az 6 karakter olmalı'); return; }
              setError('');
              setStep(2);
            }} activeOpacity={0.85}>
              <Text style={styles.btnText}>Devam Et</Text>
              <Ionicons name="arrow-forward" size={18} color={Colors.white} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.loginLink} onPress={() => router.push('/(auth)/login' as any)}>
              <Text style={styles.loginLinkText}>Zaten hesabınız var mı? <Text style={{ color: Colors.primary[600], fontWeight: '600' }}>Giriş Yapın</Text></Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Ek Bilgiler</Text>
            <Text style={styles.sectionSub}>Bu alanlar opsiyoneldir, daha sonra da doldurabilirsiniz</Text>

            {/* Age */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Yaş</Text>
              <View style={styles.inputRow}>
                <Ionicons name="calendar-outline" size={18} color={Colors.gray[400]} style={{ marginLeft: 14 }} />
                <TextInput style={styles.input} placeholder="25" placeholderTextColor={Colors.gray[400]} keyboardType="number-pad" maxLength={3} value={age} onChangeText={setAge} />
              </View>
            </View>

            {/* Occupation */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Meslek</Text>
              <View style={styles.inputRow}>
                <Ionicons name="briefcase-outline" size={18} color={Colors.gray[400]} style={{ marginLeft: 14 }} />
                <TextInput style={styles.input} placeholder="Mühendis, Öğretmen, Esnaf..." placeholderTextColor={Colors.gray[400]} value={occupation} onChangeText={setOccupation} />
              </View>
            </View>

            {/* Gender */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Cinsiyet</Text>
              <View style={styles.genderRow}>
                {GENDERS.map((g) => (
                  <TouchableOpacity
                    key={g.key}
                    style={[styles.genderChip, gender === g.key && { backgroundColor: Colors.primary[600], borderColor: Colors.primary[600] }]}
                    onPress={() => setGender(gender === g.key ? '' : g.key)}
                    activeOpacity={0.75}
                  >
                    <Ionicons name={g.icon} size={14} color={gender === g.key ? Colors.white : Colors.textMuted} />
                    <Text style={[styles.genderText, gender === g.key && { color: Colors.white }]}>{g.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* District */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>İlçe</Text>
              <View style={styles.districtGrid}>
                {DISTRICTS.map((d) => (
                  <TouchableOpacity
                    key={d}
                    style={[styles.districtChip, district === d && { backgroundColor: Colors.primary[600], borderColor: Colors.primary[600] }]}
                    onPress={() => setDistrict(district === d ? '' : d)}
                    activeOpacity={0.75}
                  >
                    <Text style={[styles.districtText, district === d && { color: Colors.white }]}>{d}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TouchableOpacity
              style={[styles.btn, { backgroundColor: Colors.forest[500], opacity: loading ? 0.7 : 1 }]}
              onPress={handleRegister}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <>
                  <Text style={styles.btnText}>Kayıt Ol ve Başla</Text>
                  <Ionicons name="rocket-outline" size={18} color={Colors.white} />
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.skipBtn} onPress={handleRegister}>
              <Text style={styles.skipText}>Bu adımı atla, hemen başla</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  hero: {
    backgroundColor: Colors.primary[800],
    paddingTop: (StatusBar.currentHeight || 44) + 12,
    paddingBottom: Spacing.xl,
    alignItems: 'center',
    overflow: 'hidden',
  },
  heroCircle: {
    position: 'absolute', width: 200, height: 200, borderRadius: 100,
    backgroundColor: Colors.primary[600], opacity: 0.25, top: -60, right: -40,
  },
  heroIcon: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: Spacing.sm,
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.2)',
  },
  heroTitle: { ...Typography.h2, color: Colors.white, marginBottom: 4 },
  heroSub: { ...Typography.bodySm, color: 'rgba(255,255,255,0.6)' },

  steps: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: Spacing.md, backgroundColor: Colors.white,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  stepItem: { alignItems: 'center', gap: 2 },
  stepItemActive: {},
  stepNum: {
    width: 28, height: 28, borderRadius: 14, textAlign: 'center', lineHeight: 28,
    fontSize: 13, fontWeight: '700', backgroundColor: Colors.gray[200], color: Colors.gray[400], overflow: 'hidden',
  },
  stepNumActive: { backgroundColor: Colors.primary[600], color: Colors.white },
  stepLabel: { ...Typography.caption, color: Colors.gray[400] },
  stepLabelActive: { color: Colors.primary[600] },
  stepLine: { width: 50, height: 2, backgroundColor: Colors.gray[200], marginHorizontal: Spacing.sm },

  scroll: { flex: 1 },
  scrollContent: { padding: Spacing.lg },

  card: {
    backgroundColor: Colors.white, borderRadius: BorderRadius.xxl,
    padding: Spacing.xl, ...Shadows.lg,
  },
  sectionTitle: { ...Typography.h3, color: Colors.textPrimary, marginBottom: 2 },
  sectionSub: { ...Typography.caption, color: Colors.textMuted, marginBottom: Spacing.lg },

  inputGroup: { marginBottom: Spacing.md },
  inputLabel: { ...Typography.label, color: Colors.textSecondary, marginBottom: 6, textTransform: 'uppercase' },
  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1.5, borderColor: Colors.border,
    borderRadius: BorderRadius.lg, overflow: 'hidden',
  },
  input: {
    flex: 1, ...Typography.bodyLg, color: Colors.textPrimary,
    paddingHorizontal: 12, paddingVertical: 14,
  },

  genderRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  genderChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 12, paddingVertical: 8,
    borderRadius: BorderRadius.full,
    borderWidth: 1.5, borderColor: Colors.border,
  },
  genderText: { ...Typography.label, color: Colors.textSecondary },

  districtGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  districtChip: {
    paddingHorizontal: 12, paddingVertical: 7,
    borderRadius: BorderRadius.full,
    borderWidth: 1.5, borderColor: Colors.border,
  },
  districtText: { ...Typography.label, color: Colors.textSecondary },

  error: { ...Typography.bodySm, color: Colors.danger[600], marginBottom: Spacing.md },

  btn: {
    backgroundColor: Colors.primary[600],
    borderRadius: BorderRadius.lg, paddingVertical: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    ...Shadows.md, marginTop: Spacing.sm,
  },
  btnText: { ...Typography.btnLg, color: Colors.white },

  loginLink: { alignItems: 'center', marginTop: Spacing.lg },
  loginLinkText: { ...Typography.body, color: Colors.textMuted },

  skipBtn: { alignItems: 'center', marginTop: Spacing.md },
  skipText: { ...Typography.label, color: Colors.primary[500] },
});
