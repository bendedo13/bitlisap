import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  View,
} from 'react-native';
import { Colors, BorderRadius, Typography, Shadows } from '../../constants/theme';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
  textStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const VARIANTS = {
  primary: {
    bg: Colors.primary[600],
    text: Colors.white,
    border: Colors.primary[600],
    shadow: Shadows.md,
  },
  secondary: {
    bg: Colors.stone[600],
    text: Colors.white,
    border: Colors.stone[600],
    shadow: Shadows.md,
  },
  outline: {
    bg: 'transparent',
    text: Colors.primary[600],
    border: Colors.primary[600],
    shadow: {},
  },
  ghost: {
    bg: Colors.primary[50],
    text: Colors.primary[600],
    border: 'transparent',
    shadow: {},
  },
  danger: {
    bg: Colors.danger[600],
    text: Colors.white,
    border: Colors.danger[600],
    shadow: Shadows.md,
  },
};

const SIZES = {
  sm: { paddingH: 14, paddingV: 8, radius: BorderRadius.md, textStyle: Typography.btnSm, height: 36 },
  md: { paddingH: 20, paddingV: 12, radius: BorderRadius.lg, textStyle: Typography.btn, height: 48 },
  lg: { paddingH: 24, paddingV: 16, radius: BorderRadius.xl, textStyle: Typography.btnLg, height: 56 },
};

export default function PrimaryButton({
  label,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
  size = 'md',
  style,
  textStyle,
  leftIcon,
  rightIcon,
  fullWidth = true,
}: PrimaryButtonProps) {
  const v = VARIANTS[variant];
  const s = SIZES[size];
  const opacity = disabled || loading ? 0.55 : 1;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        styles.base,
        v.shadow,
        {
          backgroundColor: v.bg,
          borderColor: v.border,
          borderWidth: variant === 'outline' ? 1.5 : 0,
          paddingHorizontal: s.paddingH,
          paddingVertical: s.paddingV,
          borderRadius: s.radius,
          height: s.height,
          opacity,
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={v.text} size="small" />
      ) : (
        <View style={styles.inner}>
          {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
          <Text style={[s.textStyle, { color: v.text }, textStyle]}>{label}</Text>
          {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
});
