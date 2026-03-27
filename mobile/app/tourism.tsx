import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/theme';
import { LOCAL_FOODS } from '../constants/districts';

const TOURIST_SPOTS = [
  {
    name: 'Bitlis Kalesi',
    desc: 'Tarihi kale, şehir panoraması',
    district: 'Merkez',
    icon: 'shield',
  },
  {
    name: 'Nemrut Krater Gölü',
    desc: 'Türkiye\'nin en büyük krater gölü',
    district: 'Tatvan',
    icon: 'water',
  },
  {
    name: 'Ahlat Selçuklu Mezarlığı',
    desc: 'UNESCO Dünya Mirası adayı',
    district: 'Ahlat',
    icon: 'flag',
  },
  {
    name: 'Zeynel Bey Türbesi',
    desc: 'Akkoyunlu dönemi eseri',
    district: 'Ahlat',
    icon: 'star',
  },
  {
    name: 'Van Gölü Kıyısı',
    desc: 'Türkiye\'nin en büyük gölü',
    district: 'Tatvan',
    icon: 'boat',
  },
  {
    name: 'Sahip Ata Camii',
    desc: 'Osmanlı dönemi mimari eser',
    district: 'Merkez',
    icon: 'business',
  },
];

export default function TourismScreen() {
  return (
    <ScrollView className="flex-1 bg-gray-50 p-4">
      {/* Hero */}
      <View
        style={{ backgroundColor: colors.secondary }}
        className="rounded-2xl p-6 mb-6"
      >
        <Text className="text-white text-2xl font-bold">
          Bitlis'i Keşfet
        </Text>
        <Text className="text-white/80 mt-2">
          Tarihi kaleler, krater gölleri, Selçuklu
          mirası... Bitlis'in eşsiz güzelliklerini keşfedin.
        </Text>
      </View>

      {/* Tourist spots */}
      <Text className="text-xl font-bold mb-3">
        Gezilecek Yerler
      </Text>
      {TOURIST_SPOTS.map((spot) => (
        <TouchableOpacity
          key={spot.name}
          className="bg-white rounded-xl p-4 mb-3"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 3,
            elevation: 1,
          }}
        >
          <View className="flex-row items-center">
            <View
              style={{
                backgroundColor:
                  colors.secondary + '15',
              }}
              className="w-12 h-12 rounded-full items-center justify-center"
            >
              <Ionicons
                name={spot.icon as keyof typeof Ionicons.glyphMap}
                size={24}
                color={colors.secondary}
              />
            </View>
            <View className="flex-1 ml-3">
              <Text className="text-base font-semibold">
                {spot.name}
              </Text>
              <Text className="text-gray-500 text-sm">
                {spot.desc}
              </Text>
              <Text className="text-gray-400 text-xs mt-1">
                {spot.district}
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={18}
              color="#ccc"
            />
          </View>
        </TouchableOpacity>
      ))}

      {/* Local foods */}
      <Text className="text-xl font-bold mt-4 mb-3">
        Yerel Lezzetler
      </Text>
      {LOCAL_FOODS.map((food) => (
        <View
          key={food.name}
          className="bg-white rounded-xl p-4 mb-2 flex-row items-center"
        >
          <Ionicons
            name="restaurant"
            size={20}
            color={colors.warning}
          />
          <View className="ml-3">
            <Text className="font-semibold">
              {food.name}
            </Text>
            <Text className="text-gray-400 text-sm">
              {food.description}
            </Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}
