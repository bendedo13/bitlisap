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
import { colors } from '../../constants/theme';
import { listingService } from '../../services/listing.service';
import {
  LISTING_CATEGORIES,
  DISTRICTS,
} from '../../constants/districts';

export default function CreateListingScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [district, setDistrict] = useState('');
  const [isNegotiable, setIsNegotiable] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!title.trim()) {
      Alert.alert('Hata', 'Başlık girin');
      return;
    }
    setLoading(true);
    try {
      await listingService.create({
        title,
        description,
        price: price ? parseFloat(price) : undefined,
        category,
        district,
        isNegotiable,
      });
      Alert.alert('Başarılı', 'İlanınız yayınlandı!');
      router.back();
    } catch {
      Alert.alert('Hata', 'İlan oluşturulamadı');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white px-4 pt-4">
      <Text className="text-base font-semibold mb-1">
        Başlık *
      </Text>
      <TextInput
        className="border border-gray-300 rounded-xl px-4 py-3 mb-4"
        placeholder="İlan başlığı"
        value={title}
        onChangeText={setTitle}
        maxLength={200}
        accessibilityLabel="İlan başlığı"
      />

      <Text className="text-base font-semibold mb-1">
        Açıklama
      </Text>
      <TextInput
        className="border border-gray-300 rounded-xl px-4 py-3 mb-4"
        placeholder="Detaylı açıklama"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
        accessibilityLabel="Açıklama"
      />

      <Text className="text-base font-semibold mb-1">
        Fiyat (₺)
      </Text>
      <TextInput
        className="border border-gray-300 rounded-xl px-4 py-3 mb-2"
        placeholder="0"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        accessibilityLabel="Fiyat"
      />
      <TouchableOpacity
        className="flex-row items-center mb-4"
        onPress={() => setIsNegotiable(!isNegotiable)}
        accessibilityLabel="Pazarlık"
      >
        <View
          style={{
            width: 20,
            height: 20,
            borderRadius: 4,
            borderWidth: 2,
            borderColor: isNegotiable
              ? colors.primary
              : '#ccc',
            backgroundColor: isNegotiable
              ? colors.primary
              : 'transparent',
            marginRight: 8,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {isNegotiable && (
            <Text className="text-white text-xs">
              ✓
            </Text>
          )}
        </View>
        <Text className="text-gray-600">
          Pazarlık payı var
        </Text>
      </TouchableOpacity>

      <Text className="text-base font-semibold mb-2">
        Kategori
      </Text>
      <View className="flex-row flex-wrap gap-2 mb-4">
        {LISTING_CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.key}
            onPress={() => setCategory(cat.key)}
            style={{
              backgroundColor:
                category === cat.key
                  ? colors.primary
                  : '#F2F2F7',
              borderRadius: 20,
              paddingHorizontal: 14,
              paddingVertical: 6,
            }}
          >
            <Text
              style={{
                color:
                  category === cat.key
                    ? '#fff'
                    : '#666',
              }}
            >
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text className="text-base font-semibold mb-2">
        İlçe
      </Text>
      <View className="flex-row flex-wrap gap-2 mb-6">
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
              paddingHorizontal: 14,
              paddingVertical: 6,
            }}
          >
            <Text
              style={{
                color:
                  district === d ? '#fff' : '#666',
              }}
            >
              {d}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={{ backgroundColor: colors.primary }}
        className="rounded-xl py-4 items-center mb-8"
        onPress={handleCreate}
        disabled={loading}
        accessibilityLabel="İlan yayınla"
      >
        <Text className="text-white text-lg font-semibold">
          {loading
            ? 'Yayınlanıyor...'
            : 'İlanı Yayınla'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
