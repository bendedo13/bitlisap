import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing } from '../../constants/theme';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  onSeeAll?: () => void;
  seeAllLabel?: string;
  accentColor?: string;
}

export default function SectionHeader({
  title,
  subtitle,
  onSeeAll,
  seeAllLabel = 'Tümünü Gör',
  accentColor = Colors.primary[600],
}: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <View style={[styles.accent, { backgroundColor: accentColor }]} />
        <View>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      </View>
      {onSeeAll && (
        <TouchableOpacity onPress={onSeeAll} style={styles.seeAllBtn} activeOpacity={0.7}>
          <Text style={[styles.seeAllText, { color: accentColor }]}>{seeAllLabel}</Text>
          <Ionicons name="chevron-forward" size={14} color={accentColor} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accent: {
    width: 4,
    height: 22,
    borderRadius: 2,
    marginRight: 10,
  },
  title: {
    ...Typography.h4,
    color: Colors.textPrimary,
  },
  subtitle: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: 1,
  },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  seeAllText: {
    ...Typography.label,
  },
});
