import React from 'react';
import { View, Text, StyleSheet, ViewStyle, StatusBar } from 'react-native';
import { Colors, Typography, Spacing } from '../../constants/theme';

interface GradientHeaderProps {
  title?: string;
  subtitle?: string;
  colorSet?: 'primary' | 'stone' | 'forest' | 'danger' | 'gold';
  children?: React.ReactNode;
  height?: number;
  style?: ViewStyle;
}

const COLOR_SETS = {
  primary: { top: Colors.primary[800], mid: Colors.primary[600], bottom: Colors.primary[500] },
  stone: { top: Colors.stone[900], mid: Colors.stone[700], bottom: Colors.stone[500] },
  forest: { top: '#0A3D2B', mid: Colors.forest[500], bottom: Colors.forest[400] },
  danger: { top: Colors.danger[700], mid: Colors.danger[600], bottom: Colors.danger[500] },
  gold: { top: Colors.stone[700], mid: '#B7770D', bottom: '#D4AC0D' },
};

export default function GradientHeader({
  title,
  subtitle,
  colorSet = 'primary',
  children,
  height = 160,
  style,
}: GradientHeaderProps) {
  const colors = COLOR_SETS[colorSet];
  return (
    <View style={[styles.container, { height, backgroundColor: colors.mid }, style]}>
      {/* Decorative circles */}
      <View style={[styles.circle1, { backgroundColor: colors.top, opacity: 0.5 }]} />
      <View style={[styles.circle2, { backgroundColor: colors.bottom, opacity: 0.3 }]} />
      <View style={[styles.circle3, { backgroundColor: colors.top, opacity: 0.2 }]} />
      {/* Content */}
      <View style={styles.content}>
        {title && <Text style={styles.title}>{title}</Text>}
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    paddingTop: (StatusBar.currentHeight || 44) + 8,
  },
  circle1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    top: -60,
    right: -40,
  },
  circle2: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    bottom: -50,
    left: -30,
  },
  circle3: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    top: 10,
    left: '50%',
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    justifyContent: 'flex-end',
  },
  title: {
    ...Typography.h2,
    color: Colors.white,
    marginBottom: 4,
  },
  subtitle: {
    ...Typography.bodySm,
    color: 'rgba(255,255,255,0.75)',
  },
});
