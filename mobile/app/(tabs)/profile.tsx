import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/theme';
import { useAuthStore } from '../../store/authStore';

interface MenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  color?: string;
}

function MenuItem({
  icon,
  label,
  onPress,
  color,
}: MenuItemProps) {
  return (
    <TouchableOpacity
      className="flex-row items-center bg-white px-4 py-4 border-b border-gray-100"
      onPress={onPress}
      accessibilityLabel={label}
    >
      <Ionicons
        name={icon}
        size={22}
        color={color || colors.primary}
      />
      <Text className="flex-1 text-base ml-3">
        {label}
      </Text>
      <Ionicons
        name="chevron-forward"
        size={18}
        color="#ccc"
      />
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const user = useAuthStore((s) => s.user);
  const isAuth = useAuthStore((s) => s.isAuthenticated);
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    Alert.alert(
      'Çıkış',
      'Çıkış yapmak istediğinize emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Çıkış Yap',
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  if (!isAuth) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50 px-8">
        <Ionicons
          name="person-circle-outline"
          size={80}
          color="#ccc"
        />
        <Text className="text-xl font-bold mt-4">
          Giriş Yapın
        </Text>
        <Text className="text-gray-500 text-center mt-2">
          İlan vermek, mesajlaşmak ve daha fazlası için
        </Text>
        <TouchableOpacity
          style={{ backgroundColor: colors.primary }}
          className="rounded-xl px-8 py-3 mt-6"
          onPress={() =>
            router.push('/(auth)/login')
          }
          accessibilityLabel="Giriş yap"
        >
          <Text className="text-white font-semibold text-base">
            Giriş Yap
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="mt-6"
          onPress={() => router.push('/legal/privacy')}
        >
          <Text
            style={{ color: colors.primary }}
            className="text-sm underline"
          >
            Gizlilik Sözleşmesi
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="mt-2"
          onPress={() => router.push('/legal/terms')}
        >
          <Text
            style={{ color: colors.primary }}
            className="text-sm underline"
          >
            Kullanım Şartları
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Profile header */}
      <View
        style={{ backgroundColor: colors.primary }}
        className="px-6 pt-8 pb-6"
      >
        <View className="flex-row items-center">
          <View className="w-16 h-16 rounded-full bg-white/20 items-center justify-center">
            <Ionicons
              name="person"
              size={32}
              color="white"
            />
          </View>
          <View className="ml-4 flex-1">
            <Text className="text-white text-xl font-bold">
              {user?.fullName || 'Kullanıcı'}
            </Text>
            <Text className="text-white/70">
              {user?.district || 'Bitlis'}
            </Text>
          </View>
        </View>
        <View className="flex-row items-center mt-4 bg-white/10 rounded-xl px-4 py-3">
          <Ionicons
            name="trophy"
            size={20}
            color="#FFD700"
          />
          <Text className="text-white font-semibold ml-2">
            {user?.cityPoints || 0} Bitlis Altını
          </Text>
        </View>
      </View>

      {/* Menu */}
      <View className="mt-4">
        <MenuItem
          icon="search"
          label="Genel arama"
          onPress={() => router.push('/search')}
        />
        <MenuItem
          icon="list"
          label="İlanlarım"
          onPress={() => {}}
        />
        <MenuItem
          icon="heart"
          label="Favori İlanlar"
          onPress={() => {}}
        />
        <MenuItem
          icon="chatbubbles"
          label="Mesajlarım"
          onPress={() => {}}
        />
        <MenuItem
          icon="notifications"
          label="Bildirimler"
          onPress={() => {}}
        />
      </View>

      {user?.userType === 'BUSINESS' && (
        <View className="mt-4">
          <MenuItem
            icon="storefront"
            label="Esnaf Paneli"
            onPress={() =>
              router.push('/business/panel')
            }
          />
        </View>
      )}

      <View className="mt-4">
        <MenuItem
          icon="calendar"
          label="Etkinlikler"
          onPress={() => router.push('/events')}
        />
        <MenuItem
          icon="alert-circle"
          label="Acil Yardım"
          onPress={() => router.push('/emergency')}
          color={colors.danger}
        />
        <MenuItem
          icon="compass"
          label="Tarih & Turizm"
          onPress={() => router.push('/tourism')}
          color={colors.secondary}
        />
      </View>

      <View className="mt-4 mb-8">
        <MenuItem
          icon="document-text-outline"
          label="Gizlilik Sözleşmesi"
          onPress={() => router.push('/legal/privacy')}
        />
        <MenuItem
          icon="reader-outline"
          label="Kullanım Şartları"
          onPress={() => router.push('/legal/terms')}
        />
        <MenuItem
          icon="settings"
          label="Ayarlar"
          onPress={() => {}}
        />
        <MenuItem
          icon="log-out"
          label="Çıkış Yap"
          onPress={handleLogout}
          color={colors.danger}
        />
      </View>
    </ScrollView>
  );
}
