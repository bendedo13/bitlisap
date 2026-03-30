import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, BorderRadius, Typography } from '../../constants/theme';

interface BadgeProps {
  label: string;
  color?: string;
  textColor?: string;
  size?: 'sm' | 'md';
  style?: ViewStyle;
  dot?: boolean;
}

export default function Badge({
  label,
  color = Colors.primary[100],
  textColor = Colors.primary[700],
  size = 'sm',
  style,
  dot = false,
}: BadgeProps) {
  return (
    <View style={[styles.base, styles[size], { backgroundColor: color }, style]}>
      {dot && <View style={[styles.dot, { backgroundColor: textColor }]} />}
      <Text style={[styles.text, styles[`text_${size}`], { color: textColor }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: BorderRadius.full,
  },
  sm: {
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  md: {
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  text: {
    fontWeight: '600',
  },
  text_sm: {
    fontSize: 11,
    letterSpacing: 0.3,
  },
  text_md: {
    fontSize: 13,
    letterSpacing: 0.2,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    marginRight: 5,
  },
});
