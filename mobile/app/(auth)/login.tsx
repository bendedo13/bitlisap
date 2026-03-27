import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { authService } from '../../services/auth.service';
import { useAuthStore } from '../../store/authStore';
import { colors } from '../../constants/theme';

export default function LoginScreen() {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>(
    'phone'
  );
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((s) => s.setAuth);

  const handleSendOtp = async () => {
    if (phone.length < 10) {
      Alert.alert('Hata', 'Geçerli telefon numarası girin');
      return;
    }
    setLoading(true);
    try {
      await authService.sendOtp(phone);
      setStep('otp');
    } catch {
      Alert.alert('Hata', 'OTP gönderilemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (code.length !== 6) {
      Alert.alert('Hata', '6 haneli kodu girin');
      return;
    }
    setLoading(true);
    try {
      const { data } = await authService.verifyOtp(
        phone,
        code
      );
      setAuth(data.user, data.token, data.refreshToken);
      router.replace('/(tabs)');
    } catch {
      Alert.alert('Hata', 'Doğrulama başarısız');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={
        Platform.OS === 'ios' ? 'padding' : 'height'
      }
      className="flex-1 bg-white"
    >
      <View className="flex-1 justify-center px-8">
        {/* Logo */}
        <View className="items-center mb-12">
          <Text
            style={{ color: colors.primary }}
            className="text-4xl font-bold"
          >
            Bitlis Şehrim
          </Text>
          <Text className="text-gray-500 mt-2 text-base">
            Dijital Şehir Uygulaması
          </Text>
        </View>

        {step === 'phone' ? (
          <>
            <Text className="text-lg font-semibold mb-2">
              Telefon Numarası
            </Text>
            <TextInput
              className="border border-gray-300 rounded-xl px-4 py-4 text-lg mb-4"
              placeholder="+90 555 123 4567"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
              maxLength={20}
              accessibilityLabel="Telefon numarası"
            />
            <TouchableOpacity
              style={{
                backgroundColor: colors.primary,
              }}
              className="rounded-xl py-4 items-center"
              onPress={handleSendOtp}
              disabled={loading}
              accessibilityLabel="Doğrulama kodu gönder"
            >
              <Text className="text-white text-lg font-semibold">
                {loading
                  ? 'Gönderiliyor...'
                  : 'Doğrulama Kodu Gönder'}
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text className="text-lg font-semibold mb-2">
              Doğrulama Kodu
            </Text>
            <Text className="text-gray-500 mb-4">
              {phone} numarasına gönderilen 6 haneli kodu
              girin
            </Text>
            <TextInput
              className="border border-gray-300 rounded-xl px-4 py-4 text-2xl text-center tracking-widest mb-4"
              placeholder="000000"
              keyboardType="number-pad"
              value={code}
              onChangeText={setCode}
              maxLength={6}
              accessibilityLabel="Doğrulama kodu"
            />
            <TouchableOpacity
              style={{
                backgroundColor: colors.primary,
              }}
              className="rounded-xl py-4 items-center mb-4"
              onPress={handleVerifyOtp}
              disabled={loading}
              accessibilityLabel="Giriş yap"
            >
              <Text className="text-white text-lg font-semibold">
                {loading
                  ? 'Doğrulanıyor...'
                  : 'Giriş Yap'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setStep('phone');
                setCode('');
              }}
              accessibilityLabel="Numarayı değiştir"
            >
              <Text
                style={{ color: colors.primaryLight }}
                className="text-center"
              >
                Numarayı Değiştir
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}
