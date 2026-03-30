export const Colors = {
  // Primary Palette - Nemrut Gölü & Bitlis Gökyüzü
  primary: {
    900: '#0A1628',
    800: '#0D2137',
    700: '#122952',
    600: '#1B4F72',
    500: '#2471A3',
    400: '#2980B9',
    300: '#5DADE2',
    200: '#AED6F1',
    100: '#D6EAF8',
    50:  '#EBF5FB',
  },
  // Secondary Palette - Bitlis Taşı & Kale Duvarları
  stone: {
    900: '#2C1A0E',
    800: '#3D2314',
    700: '#5D3A1A',
    600: '#784212',
    500: '#935116',
    400: '#A04000',
    300: '#CA6F1E',
    200: '#E59866',
    100: '#F0B27A',
    50:  '#FDEBD0',
  },
  // Accent - Orman Yeşili
  forest: {
    700: '#0E6655',
    600: '#148F77',
    500: '#1E8449',
    400: '#27AE60',
    300: '#52BE80',
    200: '#A9DFBF',
    100: '#D5F5E3',
  },
  // Amber - Bitlis Altını
  gold: {
    600: '#B7770D',
    500: '#D4AC0D',
    400: '#F1C40F',
    300: '#F7DC6F',
    200: '#FCF3CF',
  },
  // Sunset - Bitlis Gün Batımı
  sunset: {
    600: '#CA6F1E',
    500: '#E67E22',
    400: '#F39C12',
    300: '#FAD7A0',
  },
  // Danger
  danger: {
    700: '#922B21',
    600: '#C0392B',
    500: '#E74C3C',
    400: '#F1948A',
    100: '#FDEDEC',
  },
  // Purple
  purple: {
    600: '#6C3483',
    500: '#8E44AD',
    400: '#A569BD',
    100: '#E8DAEF',
  },
  // Neutrals
  white: '#FFFFFF',
  black: '#000000',
  gray: {
    900: '#111827',
    800: '#1F2937',
    700: '#374151',
    600: '#4B5563',
    500: '#6B7280',
    400: '#9CA3AF',
    300: '#D1D5DB',
    200: '#E5E7EB',
    100: '#F3F4F6',
    50:  '#F9FAFB',
  },
  // Semantic
  background: '#F0F4F8',
  surface: '#FFFFFF',
  border: '#E2E8F0',
  textPrimary: '#0D2137',
  textSecondary: '#4A5568',
  textMuted: '#718096',
  textInverse: '#FFFFFF',
};

export const Shadows = {
  sm: {
    shadowColor: '#0D2137',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#0D2137',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#0D2137',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 16,
    elevation: 8,
  },
  xl: {
    shadowColor: '#0D2137',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 12,
  },
};

export const Typography = {
  display: { fontSize: 36, fontWeight: '800' as const, letterSpacing: -1, lineHeight: 44 },
  h1: { fontSize: 28, fontWeight: '700' as const, letterSpacing: -0.5, lineHeight: 36 },
  h2: { fontSize: 22, fontWeight: '700' as const, letterSpacing: -0.3, lineHeight: 30 },
  h3: { fontSize: 18, fontWeight: '600' as const, letterSpacing: -0.2, lineHeight: 26 },
  h4: { fontSize: 16, fontWeight: '600' as const, letterSpacing: 0, lineHeight: 24 },
  bodyLg: { fontSize: 17, fontWeight: '400' as const, lineHeight: 26 },
  body: { fontSize: 15, fontWeight: '400' as const, lineHeight: 23 },
  bodySm: { fontSize: 13, fontWeight: '400' as const, lineHeight: 20 },
  label: { fontSize: 12, fontWeight: '600' as const, letterSpacing: 0.5, lineHeight: 18 },
  caption: { fontSize: 11, fontWeight: '400' as const, letterSpacing: 0.2, lineHeight: 16 },
  btnLg: { fontSize: 17, fontWeight: '700' as const, letterSpacing: 0.3 },
  btn: { fontSize: 15, fontWeight: '600' as const, letterSpacing: 0.2 },
  btnSm: { fontSize: 13, fontWeight: '600' as const, letterSpacing: 0.1 },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  full: 9999,
};

export const Layout = {
  screenPadding: 20,
  cardPadding: 16,
  headerHeight: 60,
  tabBarHeight: 80,
};

// Legacy compat exports
export const colors = {
  primary: Colors.primary[600],
  primaryLight: Colors.primary[400],
  secondary: Colors.stone[600],
  secondaryLight: Colors.stone[400],
  accent: Colors.forest[500],
  accentLight: Colors.forest[400],
  warning: Colors.sunset[500],
  danger: Colors.danger[600],
  background: Colors.background,
  surface: Colors.surface,
  card: Colors.surface,
  text: {
    primary: Colors.textPrimary,
    secondary: Colors.textSecondary,
    tertiary: Colors.textMuted,
    inverse: Colors.textInverse,
  },
  border: Colors.border,
  divider: Colors.gray[100],
  categories: {
    news: Colors.primary[400],
    market: Colors.forest[500],
    emergency: Colors.danger[600],
    tourism: Colors.stone[600],
    events: Colors.purple[500],
    weather: Colors.primary[400],
  },
};

export const spacing = Spacing;
export const borderRadius = BorderRadius;
export const typography = Typography;

export default { Colors, Shadows, Typography, Spacing, BorderRadius, Layout };
