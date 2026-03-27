import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { api } from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import { colors } from '../../constants/theme';
import { DISTRICTS } from '../../constants/districts';

export default function RegisterScreen() {
  const [fullName, setFullName] = useState('');
  const [district, setDistrict] = useState('');
  const [loading, setLoading] = useState(false);
  const updateUser = useAuthStore((s) => s.updateUser);

  const handleRegister = async () => {
    if (!fullName.trim()) {
      Alert.alert('Hata', 'İsim girin');
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.put('/users/me', {
        fullName,
        district,
      });
      updateUser(data);
      router.replace('/(tabs)');
    } catch {
      Alert.alert('Hata', 'Profil güncellenemedi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white px-8 pt-16">
      <Text
        style={{ color: colors.primary }}
        className="text-2xl font-bold mb-2"
      >
        Hoş Geldin!
      </Text>
      <Text className="text-gray-500 mb-8">
        Profilini tamamla
      </Text>

      <Text className="text-base font-semibold mb-2">
        Ad Soyad
      </Text>
      <TextInput
        className="border border-gray-300 rounded-xl px-4 py-3 text-base mb-6"
        placeholder="İsminizi girin"
        value={fullName}
        onChangeText={setFullName}
        accessibilityLabel="Ad soyad"
      />

      <Text className="text-base font-semibold mb-2">
        İlçe
      </Text>
      <View className="flex-row flex-wrap gap-2 mb-8">
        {DISTRICTS.map((d) => (
          <TouchableOpacity
            key={d}
            onPress={() => setDistrict(d)}
            style={{
              backgroundColor:
                district === d
                  ? colors.primary
                  : '#F2F2F7',
              borderRadius: 20,
              paddingHorizontal: 16,
              paddingVertical: 8,
            }}
            accessibilityLabel={`İlçe: ${d}`}
          >
            <Text
              style={{
                color:
                  district === d ? '#fff' : '#333',
              }}
            >
              {d}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={{ backgroundColor: colors.primary }}
        className="rounded-xl py-4 items-center"
        onPress={handleRegister}
        disabled={loading}
        accessibilityLabel="Kayıt ol"
      >
        <Text className="text-white text-lg font-semibold">
          {loading ? 'Kaydediliyor...' : 'Devam Et'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
