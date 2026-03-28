import { useState, useMemo } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/theme';
import { searchService } from '../services/search.service';

export default function SearchScreen() {
  const [q, setQ] = useState('');
  const [submitted, setSubmitted] = useState('');

  const trimmed = useMemo(() => submitted.trim(), [submitted]);

  const { data, isFetching, isError } = useQuery({
    queryKey: ['search', trimmed],
    queryFn: () => searchService.global(trimmed),
    enabled: trimmed.length >= 2,
  });

  const payload = data?.data as
    | {
        news: Array<{ id: string; title: string }>;
        listings: Array<{ id: string; title: string }>;
        businesses: Array<{ id: string; name: string }>;
      }
    | undefined;

  return (
    <View className="flex-1 bg-gray-50">
      <View className="flex-row items-center bg-white px-3 py-2 border-b border-gray-100">
        <Ionicons
          name="search"
          size={20}
          color={colors.text.tertiary}
        />
        <TextInput
          className="flex-1 ml-2 py-2 text-base"
          placeholder="Haber, ilan, işletme ara..."
          placeholderTextColor="#999"
          value={q}
          onChangeText={setQ}
          onSubmitEditing={() => setSubmitted(q.trim())}
          returnKeyType="search"
          accessibilityLabel="Arama kutusu"
        />
        <TouchableOpacity
          onPress={() => setSubmitted(q.trim())}
          style={{ backgroundColor: colors.primary }}
          className="px-3 py-2 rounded-lg"
          accessibilityLabel="Ara"
        >
          <Text className="text-white font-semibold text-sm">
            Ara
          </Text>
        </TouchableOpacity>
      </View>

      {trimmed.length < 2 ? (
        <View className="flex-1 items-center justify-center px-8">
          <Ionicons
            name="search-circle-outline"
            size={64}
            color="#ccc"
          />
          <Text className="text-gray-500 text-center mt-4">
            En az 2 karakter yazıp aramaya basın.
          </Text>
        </View>
      ) : isFetching ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator
            size="large"
            color={colors.primary}
          />
        </View>
      ) : isError ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-gray-500 text-center">
            Arama yapılamadı. Bağlantınızı kontrol edin.
          </Text>
        </View>
      ) : (
        <ScrollView className="flex-1 px-4 py-3">
          <Section
            title="Haberler"
            items={payload?.news ?? []}
            onPress={(id) => router.push(`/news/${id}`)}
            labelKey="title"
          />
          <Section
            title="İlanlar"
            items={payload?.listings ?? []}
            onPress={(id) => router.push(`/listing/${id}`)}
            labelKey="title"
          />
          <Section
            title="İşletmeler"
            items={payload?.businesses ?? []}
            onPress={(id) => router.push(`/business/${id}`)}
            labelKey="name"
          />
          {!payload?.news?.length &&
            !payload?.listings?.length &&
            !payload?.businesses?.length && (
              <Text className="text-gray-400 text-center mt-8">
                Sonuç bulunamadı.
              </Text>
            )}
        </ScrollView>
      )}
    </View>
  );
}

function Section<T extends { id: string }>({
  title,
  items,
  onPress,
  labelKey,
}: {
  title: string;
  items: T[];
  onPress: (id: string) => void;
  labelKey: keyof T;
}) {
  if (!items.length) return null;
  return (
    <View className="mb-6">
      <Text className="text-sm font-bold text-gray-500 mb-2 uppercase">
        {title}
      </Text>
      {items.map((item) => (
        <TouchableOpacity
          key={item.id}
          className="bg-white rounded-xl p-3 mb-2 border border-gray-100"
          onPress={() => onPress(item.id)}
        >
          <Text className="text-base text-gray-800" numberOfLines={2}>
            {String(item[labelKey])}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
