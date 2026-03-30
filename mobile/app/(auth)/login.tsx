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
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { authService } from '../../services/authService';
import { useAuthStore } from '../../store/authStore';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import PrimaryButton from '../../components/ui/PrimaryButton';

export default function LoginScreen() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sendOtp = async () => {
    if (phone.length < 10) { setError('Geçerli bir telefon numarası girin'); return; }
    setError('');
    setLoading(true);
    try {
      await authService.sendOtp(phone);
      setStep('otp');
    } catch {
      setError('Kod gönderilemedi. Lütfen tekrar deneyin.');
    } finally { setLoading(false); }
  };

  const verifyOtp = async () => {
    if (otp.length !== 6) { setError('6 haneli kodu girin'); return; }
    setError('');
    setLoading(true);
    try {
      const data = await authService.verifyOtp(phone, otp);
      setAuth(data.user, data.token, data.refreshToken);
      if (data.isNewUser) {
        router.replace('/(auth)/register' as any);
      } else {
        router.replace('/(tabs)' as any);
      }
    } catch {
      setError('Hatalı kod. Lütfen tekrar deneyin.');
    } finally { setLoading(false); }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      {/* Hero */}
      <View style={styles.hero}>
        <View style={styles.heroCircle1} />
        <View style={styles.heroCircle2} />
        <View style={styles.heroCircle3} />
        <View style={styles.heroContent}>
          <View style={styles.logoWrap}>
            <Ionicons name="location" size={32} color={Colors.white} />
          </View>
          <Text style={styles.heroTitle}>Bitlis Şehrim</Text>
          <Text style={styles.heroSub}>Şehrin dijital kalbi</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.kav}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.formContainer} showsVerticalScrollIndicator={false}>
          {/* Card */}
          <View style={styles.card}>
            {/* Step indicator */}
            <View style={styles.stepRow}>
              <View style={styles.stepItem}>
                <View style={[styles.stepCircle, { backgroundColor: Colors.primary[600] }]}>
                  <Text style={styles.stepNum}>1</Text>
                </View>
                <Text style={[styles.stepLabel, { color: Colors.primary[600] }]}>Telefon</Text>
              </View>
              <View style={[styles.stepLine, step === 'otp' && { backgroundColor: Colors.primary[600] }]} />
              <View style={styles.stepItem}>
                <View style={[styles.stepCircle, step === 'otp' ? { backgroundColor: Colors.primary[600] } : { backgroundColor: Colors.gray[200] }]}>
                  <Text style={[styles.stepNum, step !== 'otp' && { color: Colors.gray[500] }]}>2</Text>
                </View>
                <Text style={[styles.stepLabel, step === 'otp' ? { color: Colors.primary[600] } : { color: Colors.gray[400] }]}>Doğrulama</Text>
              </View>
            </View>

            {step === 'phone' ? (
              <>
                <Text style={styles.formTitle}>Telefon Numarası</Text>
                <Text style={styles.formSub}>Sizi doğrulamak için SMS kodu göndereceğiz</Text>
                <View style={styles.inputWrap}>
                  <View style={styles.inputPrefix}>
                    <Text style={styles.inputPrefixText}>🇹🇷 +90</Text>
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="5XX XXX XX XX"
                    placeholderTextColor={Colors.gray[300]}
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={(t) => setPhone(t.replace(/\D/g, ''))}
                    maxLength={11}
                  />
                </View>
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
                <PrimaryButton
                  label="Devam Et"
                  onPress={sendOtp}
                  loading={loading}
                  size="lg"
                  style={{ marginTop: Spacing.md }}
                  rightIcon={<Ionicons name="arrow-forward" size={18} color={Colors.white} />}
                />
              </>
            ) : (
              <>
                <Text style={styles.formTitle}>Doğrulama Kodu</Text>
                <Text style={styles.formSub}>
                  <Text style={{ color: Colors.primary[600] }}>{phone}</Text> numarasına gönderilen 6 haneli kodu girin
                </Text>
                <TextInput
                  style={styles.otpInput}
                  placeholder="• • • • • •"
                  placeholderTextColor={Colors.gray[300]}
                  keyboardType="number-pad"
                  value={otp}
                  onChangeText={(t) => setOtp(t.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                  textAlign="center"
                />
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
                <PrimaryButton
                  label="Giriş Yap"
                  onPress={verifyOtp}
                  loading={loading}
                  size="lg"
                  style={{ marginTop: Spacing.md }}
                />
                <TouchableOpacity style={styles.resendBtn} onPress={() => setStep('phone')}>
                  <Ionicons name="arrow-back" size={14} color={Colors.primary[500]} />
                  <Text style={styles.resendText}>Numarayı değiştir</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.resendBtn} onPress={sendOtp}>
                  <Ionicons name="refresh" size={14} color={Colors.textMuted} />
                  <Text style={[styles.resendText, { color: Colors.textMuted }]}>Kodu tekrar gönder</Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          {/* Features */}
          <View style={styles.features}>
            {[
              { icon: 'shield-checkmark' as const, text: 'Güvenli SMS doğrulama' },
              { icon: 'flash' as const, text: 'Hızlı giriş, şifre yok' },
              { icon: 'people' as const, text: '10.000+ Bitlisli kullanıcı' },
            ].map((f) => (
              <View key={f.text} style={styles.featureItem}>
                <Ionicons name={f.icon} size={16} color={Colors.primary[400]} />
                <Text style={styles.featureText}>{f.text}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  kav: { flex: 1 },

  hero: {
    backgroundColor: Colors.primary[800],
    paddingTop: (StatusBar.currentHeight || 44) + 20,
    paddingBottom: Spacing.xxxl,
    alignItems: 'center',
    overflow: 'hidden',
  },
  heroCircle1: {
    position: 'absolute', width: 250, height: 250, borderRadius: 125,
    backgroundColor: Colors.primary[600], opacity: 0.25, top: -80, right: -60,
  },
  heroCircle2: {
    position: 'absolute', width: 150, height: 150, borderRadius: 75,
    backgroundColor: Colors.gold[400], opacity: 0.08, bottom: -30, left: -20,
  },
  heroCircle3: {
    position: 'absolute', width: 80, height: 80, borderRadius: 40,
    backgroundColor: Colors.primary[400], opacity: 0.15, top: 20, left: '30%',
  },
  heroContent: { alignItems: 'center', zIndex: 1 },
  logoWrap: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.2)',
    marginBottom: Spacing.md,
  },
  heroTitle: { ...Typography.h1, color: Colors.white, marginBottom: 6 },
  heroSub: { ...Typography.body, color: 'rgba(255,255,255,0.6)' },

  formContainer: { padding: Spacing.lg, paddingTop: Spacing.xl },

  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xxl,
    padding: Spacing.xl,
    ...Shadows.xl,
  },

  stepRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.xl },
  stepItem: { alignItems: 'center', gap: 4 },
  stepCircle: {
    width: 32, height: 32, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
  },
  stepNum: { ...Typography.label, color: Colors.white },
  stepLabel: { ...Typography.caption, fontWeight: '600' },
  stepLine: {
    flex: 1, height: 2, backgroundColor: Colors.gray[200],
    marginHorizontal: Spacing.sm, marginBottom: 18,
  },

  formTitle: { ...Typography.h3, color: Colors.textPrimary, marginBottom: 6 },
  formSub: { ...Typography.body, color: Colors.textMuted, marginBottom: Spacing.lg, lineHeight: 22 },

  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1.5, borderColor: Colors.border,
    borderRadius: BorderRadius.lg, overflow: 'hidden',
  },
  inputPrefix: {
    paddingHorizontal: 12, paddingVertical: 14,
    backgroundColor: Colors.gray[50], borderRightWidth: 1, borderRightColor: Colors.border,
  },
  inputPrefixText: { ...Typography.body, color: Colors.textPrimary },
  input: {
    flex: 1, paddingHorizontal: 14, paddingVertical: 14,
    ...Typography.bodyLg, color: Colors.textPrimary,
  },

  otpInput: {
    borderWidth: 1.5, borderColor: Colors.border, borderRadius: BorderRadius.lg,
    paddingVertical: 18, ...Typography.display, color: Colors.textPrimary,
    letterSpacing: 12,
  },

  errorText: { ...Typography.bodySm, color: Colors.danger[600], marginTop: 8, textAlign: 'center' },

  resendBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: 8, marginTop: 4,
  },
  resendText: { ...Typography.bodySm, color: Colors.primary[500] },

  features: { marginTop: Spacing.xl, gap: Spacing.md },
  featureItem: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  featureText: { ...Typography.body, color: Colors.textSecondary },
});
