import React from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Shadows, BorderRadius, Spacing } from '../../constants/theme';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  padding?: number;
  shadow?: 'sm' | 'md' | 'lg' | 'xl' | 'none';
  radius?: number;
  activeOpacity?: number;
  borderColor?: string;
}

export default function Card({
  children,
  onPress,
  style,
  padding = Spacing.md,
  shadow = 'md',
  radius = BorderRadius.lg,
  activeOpacity = 0.9,
  borderColor,
}: CardProps) {
  const shadowStyle = shadow !== 'none' ? Shadows[shadow] : {};
  const borderStyle = borderColor ? { borderWidth: 1, borderColor } : {};

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={activeOpacity}
        style={[styles.base, shadowStyle, borderStyle, { padding, borderRadius: radius }, style]}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.base, shadowStyle, borderStyle, { padding, borderRadius: radius }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: Colors.surface,
    overflow: 'hidden',
  },
});
