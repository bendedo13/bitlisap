import { View, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/theme';

function StatCard({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View className="bg-white rounded-xl p-4 flex-1 mr-3">
      <Ionicons
        name={icon}
        size={24}
        color={colors.primary}
      />
      <Text className="text-2xl font-bold mt-2">
        {value}
      </Text>
      <Text className="text-gray-400 text-sm">
        {label}
      </Text>
    </View>
  );
}

export default function BusinessPanelScreen() {
  return (
    <ScrollView className="flex-1 bg-gray-50 p-4">
      <Text className="text-xl font-bold mb-4">
        İşletme Paneli
      </Text>

      <View className="flex-row mb-4">
        <StatCard
          icon="eye"
          label="Görüntülenme"
          value="0"
        />
        <StatCard
          icon="call"
          label="Arama"
          value="0"
        />
        <StatCard
          icon="star"
          label="Puan"
          value="0.0"
        />
      </View>

      <View className="bg-white rounded-xl p-4 mb-4">
        <Text className="text-base font-semibold mb-2">
          Kampanyalar
        </Text>
        <Text className="text-gray-400">
          Henüz kampanya yok. Kampanya oluşturarak
          müşterilerinize ulaşın.
        </Text>
      </View>

      <View className="bg-white rounded-xl p-4 mb-4">
        <Text className="text-base font-semibold mb-2">
          Son Yorumlar
        </Text>
        <Text className="text-gray-400">
          Henüz yorum yok.
        </Text>
      </View>

      <View
        style={{
          backgroundColor: colors.primary + '10',
        }}
        className="rounded-xl p-4"
      >
        <Text
          style={{ color: colors.primary }}
          className="font-semibold"
        >
          Premium İşletme Ol
        </Text>
        <Text className="text-gray-600 mt-1 text-sm">
          Öne çıkma, detaylı istatistik ve premium rozet
          ile daha fazla müşteriye ulaşın.
        </Text>
        <Text
          style={{ color: colors.primary }}
          className="font-bold mt-2"
        >
          149 ₺/ay
        </Text>
      </View>
    </ScrollView>
  );
}
