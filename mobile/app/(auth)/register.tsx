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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(0); // 0: tür seç, 1: zorunlu, 2: ek bilgiler
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Role
  const [userType, setUserType] = useState<'USER' | 'BUSINESS' | ''>('');

  // Required
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // User optional
  const [age, setAge] = useState('');
  const [occupation, setOccupation] = useState('');
  const [gender, setGender] = useState('');
  const [district, setDistrict] = useState('');

  // Business required (step 2 for BUSINESS)
  const [businessName, setBusinessName] = useState('');
  const [taxNo, setTaxNo] = useState('');

  const handleRegister = async () => {
    setError('');
    if (userType === 'BUSINESS') {
      if (!businessName.trim()) { setError('İşletme adı zorunludur'); return; }
      if (!taxNo.trim()) { setError('Vergi kimlik no zorunludur'); return; }
    }
    setLoading(true);
    try {
      const body: any = {
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        userType: userType || 'USER',
      };
      if (userType === 'BUSINESS') {
        body.businessName = businessName.trim();
        body.taxNo = taxNo.trim();
      } else {
        if (age) body.age = parseInt(age);
        if (occupation) body.occupation = occupation.trim();
        if (gender) body.gender = gender;
        if (district) body.district = district;
      }

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

      <View style={[styles.hero, { paddingTop: insets.top + 12 }]}>
        <View style={styles.heroCircle} />
        <View style={styles.heroIcon}>
          <Ionicons name="person-add-outline" size={32} color={Colors.white} />
        </View>
        <Text style={styles.heroTitle}>Hesap Oluştur</Text>
        <Text style={styles.heroSub}>Bitlis Şehrim'e katılın</Text>
      </View>

      {/* Step Indicator */}
      <View style={styles.steps}>
        <TouchableOpacity style={[styles.stepItem, step >= 0 && styles.stepItemActive]} onPress={() => setStep(0)}>
          <Text style={[styles.stepNum, step >= 0 && styles.stepNumActive]}>1</Text>
          <Text style={[styles.stepLabel, step >= 0 && styles.stepLabelActive]}>Tür</Text>
        </TouchableOpacity>
        <View style={[styles.stepLine, step >= 1 && { backgroundColor: Colors.primary[600] }]} />
        <TouchableOpacity style={[styles.stepItem, step >= 1 && styles.stepItemActive]} onPress={() => step >= 1 && setStep(1)}>
          <Text style={[styles.stepNum, step >= 1 && styles.stepNumActive]}>2</Text>
          <Text style={[styles.stepLabel, step >= 1 && styles.stepLabelActive]}>Zorunlu</Text>
        </TouchableOpacity>
        <View style={[styles.stepLine, step >= 2 && { backgroundColor: Colors.primary[600] }]} />
        <TouchableOpacity style={[styles.stepItem, step >= 2 && styles.stepItemActive]} onPress={() => step >= 2 && setStep(2)}>
          <Text style={[styles.stepNum, step >= 2 && styles.stepNumActive]}>3</Text>
          <Text style={[styles.stepLabel, step >= 2 && styles.stepLabelActive]}>{userType === 'BUSINESS' ? 'İşletme' : 'Ek Bilgi'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {step === 0 ? (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Hesap Türü</Text>
            <Text style={styles.sectionSub}>Nasıl kullanacağınızı belirleyin</Text>

            <TouchableOpacity
              style={[styles.roleCard, userType === 'USER' && styles.roleCardActive]}
              onPress={() => setUserType('USER')}
              activeOpacity={0.8}
            >
              <View style={[styles.roleIcon, userType === 'USER' && { backgroundColor: Colors.primary[600] }]}>
                <Ionicons name="person-outline" size={28} color={userType === 'USER' ? Colors.white : Colors.primary[600]} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.roleTitle, userType === 'USER' && { color: Colors.primary[700] }]}>Bireysel Üye</Text>
                <Text style={styles.roleDesc}>Haberleri takip edin, etkinliklere katılın, şehri keşfedin</Text>
              </View>
              {userType === 'USER' && <Ionicons name="checkmark-circle" size={22} color={Colors.primary[600]} />}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.roleCard, userType === 'BUSINESS' && styles.roleCardActiveBusiness]}
              onPress={() => setUserType('BUSINESS')}
              activeOpacity={0.8}
            >
              <View style={[styles.roleIcon, { backgroundColor: userType === 'BUSINESS' ? Colors.forest[500] : Colors.forest[500] + '22' }]}>
                <Ionicons name="storefront-outline" size={28} color={userType === 'BUSINESS' ? Colors.white : Colors.forest[500]} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.roleTitle, userType === 'BUSINESS' && { color: Colors.forest[600] }]}>Kurumsal Üye (Esnaf)</Text>
                <Text style={styles.roleDesc}>İşletmenizi listeleyin, kampanyalar oluşturun, müşterilerinize ulaşın</Text>
              </View>
              {userType === 'BUSINESS' && <Ionicons name="checkmark-circle" size={22} color={Colors.forest[500]} />}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, { opacity: userType ? 1 : 0.45 }]}
              onPress={() => userType && setStep(1)}
              disabled={!userType}
              activeOpacity={0.85}
            >
              <Text style={styles.btnText}>Devam Et</Text>
              <Ionicons name="arrow-forward" size={18} color={Colors.white} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.loginLink} onPress={() => router.push('/(auth)/login' as any)}>
              <Text style={styles.loginLinkText}>Zaten hesabınız var mı? <Text style={{ color: Colors.primary[600], fontWeight: '600' }}>Giriş Yapın</Text></Text>
            </TouchableOpacity>
          </View>
        ) : step === 1 ? (
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
            <Text style={styles.sectionTitle}>{userType === 'BUSINESS' ? 'İşletme Bilgileri' : 'Ek Bilgiler'}</Text>
            <Text style={styles.sectionSub}>{userType === 'BUSINESS' ? 'Bu bilgiler hesabınız için zorunludur' : 'Bu alanlar opsiyoneldir, daha sonra da doldurabilirsiniz'}</Text>

            {userType === 'BUSINESS' ? (
              <>
                {/* Business Name */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>İşletme Adı *</Text>
                  <View style={styles.inputRow}>
                    <Ionicons name="storefront-outline" size={18} color={Colors.gray[400]} style={{ marginLeft: 14 }} />
                    <TextInput style={styles.input} placeholder="Örn: Nemrut Cafe" placeholderTextColor={Colors.gray[400]} value={businessName} onChangeText={setBusinessName} />
                  </View>
                </View>

                {/* Tax No */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Vergi Kimlik No *</Text>
                  <View style={styles.inputRow}>
                    <Ionicons name="document-text-outline" size={18} color={Colors.gray[400]} style={{ marginLeft: 14 }} />
                    <TextInput style={styles.input} placeholder="10 haneli vergi numarası" placeholderTextColor={Colors.gray[400]} keyboardType="number-pad" maxLength={11} value={taxNo} onChangeText={setTaxNo} />
                  </View>
                </View>

                {/* District for business */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>İlçe</Text>
                  <View style={styles.districtGrid}>
                    {DISTRICTS.map((d) => (
                      <TouchableOpacity
                        key={d}
                        style={[styles.districtChip, district === d && { backgroundColor: Colors.forest[500], borderColor: Colors.forest[500] }]}
                        onPress={() => setDistrict(district === d ? '' : d)}
                        activeOpacity={0.75}
                      >
                        <Text style={[styles.districtText, district === d && { color: Colors.white }]}>{d}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </>
            ) : (
              <>
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
              </>
            )}

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TouchableOpacity
              style={[styles.btn, { backgroundColor: userType === 'BUSINESS' ? Colors.forest[500] : Colors.forest[500], opacity: loading ? 0.7 : 1 }]}
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

            {userType !== 'BUSINESS' && (
              <TouchableOpacity style={styles.skipBtn} onPress={handleRegister}>
                <Text style={styles.skipText}>Bu adımı atla, hemen başla</Text>
              </TouchableOpacity>
            )}
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

  roleCard: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    padding: Spacing.md, borderRadius: BorderRadius.xl,
    borderWidth: 2, borderColor: Colors.border,
    marginBottom: Spacing.md, backgroundColor: Colors.gray[50],
  },
  roleCardActive: { borderColor: Colors.primary[500], backgroundColor: Colors.primary[50] },
  roleCardActiveBusiness: { borderColor: Colors.forest[500], backgroundColor: '#f0fdf4' },
  roleIcon: {
    width: 52, height: 52, borderRadius: BorderRadius.lg,
    backgroundColor: Colors.primary[50],
    alignItems: 'center', justifyContent: 'center',
  },
  roleTitle: { ...Typography.h4, color: Colors.textPrimary, marginBottom: 2 },
  roleDesc: { ...Typography.caption, color: Colors.textMuted, flexShrink: 1 },
});
