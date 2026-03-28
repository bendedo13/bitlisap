import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/theme';

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({
  icon,
  title,
  subtitle,
  actionLabel,
  onAction,
}: Props) {
  return (
    <View className="flex-1 items-center justify-center px-8 py-12">
      <View
        className="w-20 h-20 rounded-full items-center justify-center mb-4"
        style={{ backgroundColor: colors.primary + '12' }}
      >
        <Ionicons
          name={icon}
          size={40}
          color={colors.primary}
        />
      </View>
      <Text className="text-lg font-semibold text-gray-800 text-center">
        {title}
      </Text>
      {subtitle ? (
        <Text className="text-sm text-gray-500 text-center mt-2 leading-5">
          {subtitle}
        </Text>
      ) : null}
      {actionLabel && onAction ? (
        <TouchableOpacity
          style={{ backgroundColor: colors.primary }}
          className="mt-6 px-6 py-3 rounded-xl"
          onPress={onAction}
          accessibilityLabel={actionLabel}
        >
          <Text className="text-white font-semibold">
            {actionLabel}
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
