import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { colors } from '../../constants/theme';
import { businessService } from '../../services/business.service';
import { BUSINESS_CATEGORIES } from '../../constants/districts';

// Bitlis merkez koordinatlari
const BITLIS_CENTER = {
  latitude: 38.4003,
  longitude: 42.1097,
};

interface Business {
  id: string;
  name: string;
  category: string | null;
  district: string | null;
  rating: number;
  phone: string | null;
}

export default function MapScreen() {
  const [selectedCategory, setSelectedCategory] =
    useState<string | undefined>();
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['businesses', selectedCategory],
    queryFn: () =>
      businessService.getAll({
        category: selectedCategory,
      }),
  });

  const businesses: Business[] =
    data?.data?.data ?? [];

  const filtered = search
    ? businesses.filter((b) =>
        b.name.toLowerCase().includes(
          search.toLowerCase()
        )
      )
    : businesses;

  return (
    <View className="flex-1 bg-gray-50">
      {/* Search */}
      <View className="px-4 pt-3">
        <View className="flex-row items-center bg-white rounded-xl px-4 py-3 mb-3">
          <Ionicons
            name="search"
            size={20}
            color="#999"
          />
          <TextInput
            className="flex-1 ml-2 text-base"
            placeholder="İşletme ara..."
            value={search}
            onChangeText={setSearch}
            accessibilityLabel="İşletme ara"
          />
        </View>
      </View>

      {/* Category filters */}
      <View className="px-4 mb-3">
        <View className="flex-row flex-wrap gap-2">
          <TouchableOpacity
            onPress={() =>
              setSelectedCategory(undefined)
            }
            style={{
              backgroundColor: !selectedCategory
                ? colors.primary
                : '#F2F2F7',
              borderRadius: 20,
              paddingHorizontal: 12,
              paddingVertical: 6,
            }}
            accessibilityLabel="Tüm kategoriler"
          >
            <Text
              style={{
                color: !selectedCategory
                  ? '#fff'
                  : '#666',
                fontSize: 12,
              }}
            >
              Tümü
            </Text>
          </TouchableOpacity>
          {BUSINESS_CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.key}
              onPress={() =>
                setSelectedCategory(cat.key)
              }
              style={{
                backgroundColor:
                  selectedCategory === cat.key
                    ? colors.primary
                    : '#F2F2F7',
                borderRadius: 20,
                paddingHorizontal: 12,
                paddingVertical: 6,
              }}
              accessibilityLabel={cat.label}
            >
              <Text
                style={{
                  color:
                    selectedCategory === cat.key
                      ? '#fff'
                      : '#666',
                  fontSize: 12,
                }}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Map placeholder */}
      <View
        style={{ backgroundColor: '#E8F4F8' }}
        className="mx-4 rounded-2xl h-48 items-center justify-center mb-4"
      >
        <Ionicons
          name="map"
          size={48}
          color={colors.primaryLight}
        />
        <Text className="text-gray-400 mt-2">
          Harita (react-native-maps)
        </Text>
        <Text className="text-gray-400 text-xs">
          {BITLIS_CENTER.latitude}°N,{' '}
          {BITLIS_CENTER.longitude}°E
        </Text>
      </View>

      {/* Business list */}
      {isLoading ? (
        <ActivityIndicator
          className="mt-4"
          color={colors.primary}
        />
      ) : (
        <View className="px-4 flex-1">
          <Text className="text-lg font-bold mb-3">
            İşletmeler ({filtered.length})
          </Text>
          {filtered.map((biz) => (
            <TouchableOpacity
              key={biz.id}
              className="bg-white rounded-xl p-4 mb-3"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 3,
                elevation: 1,
              }}
              onPress={() =>
                router.push(`/business/${biz.id}`)
              }
            >
              <Text className="text-base font-semibold">
                {biz.name}
              </Text>
              <View className="flex-row items-center mt-1">
                {biz.category && (
                  <Text className="text-gray-400 text-xs mr-2">
                    {biz.category}
                  </Text>
                )}
                {biz.district && (
                  <View className="flex-row items-center">
                    <Ionicons
                      name="location-outline"
                      size={11}
                      color="#999"
                    />
                    <Text className="text-gray-400 text-xs ml-0.5">
                      {biz.district}
                    </Text>
                  </View>
                )}
                {biz.rating > 0 && (
                  <View className="flex-row items-center ml-2">
                    <Ionicons
                      name="star"
                      size={11}
                      color={colors.warning}
                    />
                    <Text className="text-gray-500 text-xs ml-0.5">
                      {Number(biz.rating).toFixed(1)}
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}
