import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/theme';
import { EMERGENCY_NUMBERS } from '../constants/districts';

const DETAILED_NUMBERS = [
  ...EMERGENCY_NUMBERS,
  {
    name: 'Bitlis Devlet Hastanesi',
    number: '0434 226 1965',
    icon: 'medical',
  },
  {
    name: 'Tatvan Devlet Hastanesi',
    number: '0434 827 1040',
    icon: 'medical',
  },
  {
    name: 'Bitlis İl Jandarma',
    number: '0434 226 2626',
    icon: 'shield',
  },
  {
    name: 'Bitlis Belediyesi',
    number: '0434 226 1025',
    icon: 'business',
  },
  {
    name: 'ALO 182 - Eczane',
    number: '182',
    icon: 'medkit',
  },
];

export default function EmergencyScreen() {
  return (
    <ScrollView className="flex-1 bg-gray-50 p-4">
      {/* Emergency banner */}
      <View
        style={{ backgroundColor: colors.danger }}
        className="rounded-2xl p-4 mb-4"
      >
        <View className="flex-row items-center">
          <Ionicons
            name="alert-circle"
            size={28}
            color="white"
          />
          <View className="ml-3 flex-1">
            <Text className="text-white text-lg font-bold">
              Acil Durum
            </Text>
            <Text className="text-white/80">
              Aşağıdaki numaralardan hızlıca ulaşın
            </Text>
          </View>
        </View>

        <TouchableOpacity
          className="bg-white/20 rounded-xl py-3 mt-3 items-center"
          onPress={() => Linking.openURL('tel:112')}
          accessibilityLabel="112 Acil Yardım Ara"
        >
          <Text className="text-white text-xl font-bold">
            112 ARA
          </Text>
        </TouchableOpacity>
      </View>

      {/* Number list */}
      {DETAILED_NUMBERS.map((item) => (
        <TouchableOpacity
          key={item.number}
          className="bg-white rounded-xl px-4 py-4 mb-2 flex-row items-center"
          onPress={() =>
            Linking.openURL(
              `tel:${item.number.replace(/\s/g, '')}`
            )
          }
          accessibilityLabel={`${item.name} ara`}
        >
          <View
            style={{
              backgroundColor: colors.danger + '15',
            }}
            className="w-10 h-10 rounded-full items-center justify-center"
          >
            <Ionicons
              name={item.icon as keyof typeof Ionicons.glyphMap}
              size={20}
              color={colors.danger}
            />
          </View>
          <View className="flex-1 ml-3">
            <Text className="font-semibold">
              {item.name}
            </Text>
            <Text className="text-gray-400 text-sm">
              {item.number}
            </Text>
          </View>
          <Ionicons
            name="call"
            size={22}
            color={colors.accent}
          />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
