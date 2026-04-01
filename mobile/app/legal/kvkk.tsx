import { ScrollView, Text, View, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { colors } from '../../constants/theme';
import { legalService } from '../../services/legal.service';

type Section = { heading: string; body: string };

export default function KvkkScreen() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['legal', 'kvkk'],
    queryFn: () => legalService.kvkk(),
  });

  const doc = data?.data as
    | {
        title: string;
        version: string;
        updatedAt: string;
        sections: Section[];
      }
    | undefined;

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  if (isError || !doc) {
    return (
      <View className="flex-1 items-center justify-center px-6 bg-gray-50">
        <Text className="text-gray-500 text-center">
          Metin yüklenemedi. Daha sonra tekrar deneyin.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-gray-50 px-4 py-4"
      contentContainerStyle={{ paddingBottom: 32 }}
    >
      <Text className="text-2xl font-bold text-gray-900">{doc.title}</Text>
      <Text className="text-sm text-gray-500 mt-1">
        Sürüm {doc.version} · Güncelleme: {doc.updatedAt}
      </Text>
      {doc.sections.map((s, i) => (
        <View key={i} className="mt-5">
          <Text className="text-lg font-semibold text-gray-800">{s.heading}</Text>
          <Text className="text-base text-gray-600 mt-2 leading-6">{s.body}</Text>
        </View>
      ))}
    </ScrollView>
  );
}
