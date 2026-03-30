import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, BorderRadius, Shadows, Spacing } from '../../constants/theme';

interface StatCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  value: string | number;
  label: string;
  color?: string;
  style?: ViewStyle;
}

export default function StatCard({ icon, value, label, color = Colors.primary[600], style }: StatCardProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={[styles.iconBg, { backgroundColor: color + '18' }]}>
        <Ionicons name={icon} size={22} color={color} />
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    ...Shadows.md,
  },
  iconBg: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  value: {
    ...Typography.h3,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  label: {
    ...Typography.caption,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});
