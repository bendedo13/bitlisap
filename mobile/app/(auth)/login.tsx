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

export default function LoginScreen() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) { setError('E-posta ve şifre gerekli'); return; }
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      setAuth(res.data.user, res.data.token, res.data.refreshToken);
      router.replace('/(tabs)' as any);
    } catch (e: any) {
      if (e?.code === 'ECONNABORTED' || e?.message?.includes('timeout')) {
        setError('Sunucuya bağlanılamadı. İnternet bağlantınızı kontrol edin.');
      } else if (!e?.response) {
        setError('Sunucuya ulaşılamıyor. Lütfen daha sonra tekrar deneyin.');
      } else {
        setError(e?.response?.data?.message || 'Giriş başarısız');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary[800]} />

      {/* Hero */}
      <View style={[styles.hero, { paddingTop: insets.top + 16 }]}>
        <View style={styles.heroCircle1} />
        <View style={styles.heroCircle2} />
        <View style={styles.heroIcon}>
          <Ionicons name="location" size={36} color={Colors.white} />
        </View>
        <Text style={styles.heroTitle}>Bitlis Şehrim</Text>
        <Text style={styles.heroSub}>Hesabınıza giriş yapın</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIcon}>
              <Ionicons name="log-in-outline" size={24} color={Colors.primary[600]} />
            </View>
            <View>
              <Text style={styles.cardTitle}>Giriş Yap</Text>
              <Text style={styles.cardSub}>E-posta ve şifrenizle giriş yapın</Text>
            </View>
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>E-posta</Text>
            <View style={styles.inputRow}>
              <Ionicons name="mail-outline" size={18} color={Colors.gray[400]} style={{ marginLeft: 14 }} />
              <TextInput
                style={styles.input}
                placeholder="ornek@email.com"
                placeholderTextColor={Colors.gray[400]}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                autoFocus
              />
            </View>
          </View>

          {/* Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Şifre</Text>
            <View style={styles.inputRow}>
              <Ionicons name="lock-closed-outline" size={18} color={Colors.gray[400]} style={{ marginLeft: 14 }} />
              <TextInput
                style={styles.input}
                placeholder="••••••"
                placeholderTextColor={Colors.gray[400]}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ paddingRight: 14 }}>
                <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={Colors.gray[400]} />
              </TouchableOpacity>
            </View>
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity
            style={[styles.btn, { opacity: loading ? 0.7 : 1 }]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <>
                <Text style={styles.btnText}>Giriş Yap</Text>
                <Ionicons name="arrow-forward" size={18} color={Colors.white} />
              </>
            )}
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>veya</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={styles.registerBtn}
            onPress={() => router.push('/(auth)/register' as any)}
            activeOpacity={0.8}
          >
            <Ionicons name="person-add-outline" size={18} color={Colors.primary[600]} />
            <Text style={styles.registerBtnText}>Hesap Oluştur</Text>
          </TouchableOpacity>

          <Text style={styles.termsText}>
            Giriş yaparak{' '}
            <Text style={{ color: Colors.primary[600] }}>Kullanım Koşulları</Text>'nı kabul etmiş olursunuz
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  hero: {
    backgroundColor: Colors.primary[800],
    paddingBottom: Spacing.xxl,
    alignItems: 'center',
    overflow: 'hidden',
  },
  heroCircle1: {
    position: 'absolute', width: 200, height: 200, borderRadius: 100,
    backgroundColor: Colors.primary[600], opacity: 0.3, top: -60, right: -40,
  },
  heroCircle2: {
    position: 'absolute', width: 120, height: 120, borderRadius: 60,
    backgroundColor: Colors.gold[400], opacity: 0.1, bottom: 10, left: -20,
  },
  heroIcon: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: Spacing.md,
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.2)',
  },
  heroTitle: { ...Typography.h1, color: Colors.white, marginBottom: 6 },
  heroSub: { ...Typography.body, color: 'rgba(255,255,255,0.6)' },

  scroll: { flex: 1 },
  scrollContent: { padding: Spacing.lg },

  card: {
    backgroundColor: Colors.white, borderRadius: BorderRadius.xxl,
    padding: Spacing.xl, ...Shadows.xl,
  },
  cardHeader: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  cardIcon: {
    width: 52, height: 52, borderRadius: BorderRadius.lg,
    backgroundColor: Colors.primary[50],
    alignItems: 'center', justifyContent: 'center',
  },
  cardTitle: { ...Typography.h3, color: Colors.textPrimary, marginBottom: 2 },
  cardSub: { ...Typography.caption, color: Colors.textMuted },

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

  error: { ...Typography.bodySm, color: Colors.danger[600], marginBottom: Spacing.md },

  btn: {
    backgroundColor: Colors.primary[600],
    borderRadius: BorderRadius.lg, paddingVertical: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    ...Shadows.md, marginTop: Spacing.sm,
  },
  btnText: { ...Typography.btnLg, color: Colors.white },

  divider: {
    flexDirection: 'row', alignItems: 'center',
    marginVertical: Spacing.lg,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  dividerText: { ...Typography.label, color: Colors.textMuted, marginHorizontal: 12 },

  registerBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    borderWidth: 1.5, borderColor: Colors.primary[300],
    borderRadius: BorderRadius.lg, paddingVertical: 14,
    backgroundColor: Colors.primary[50],
  },
  registerBtnText: { ...Typography.btn, color: Colors.primary[600] },

  termsText: { ...Typography.caption, color: Colors.textMuted, textAlign: 'center', marginTop: Spacing.md },
});
