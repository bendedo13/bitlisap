export const DISTRICTS = [
  'Merkez',
  'Tatvan',
  'Ahlat',
  'Güroymak',
  'Hizan',
  'Mutki',
  'Adilcevaz',
] as const;

export type District = (typeof DISTRICTS)[number];

export const LISTING_CATEGORIES = [
  { key: 'vasita', label: 'Vasıta', icon: 'car' },
  { key: 'emlak', label: 'Emlak', icon: 'home' },
  { key: 'elektronik', label: 'Elektronik', icon: 'phone-portrait' },
  { key: 'ev-esyasi', label: 'Ev Eşyası', icon: 'bed' },
  { key: 'is', label: 'İş İlanı', icon: 'briefcase' },
  { key: 'hizmet', label: 'Hizmet', icon: 'construct' },
  { key: 'diger', label: 'Diğer', icon: 'ellipsis-horizontal' },
] as const;

export const NEWS_CATEGORIES = [
  'Tümü',
  'Gündem',
  'Spor',
  'Kültür',
  'Ekonomi',
  'Duyuru',
  'Turizm',
  'Ulaşım',
] as const;

export const BUSINESS_CATEGORIES = [
  { key: 'restaurant', label: 'Restaurant', icon: 'restaurant' },
  { key: 'kafe', label: 'Kafe', icon: 'cafe' },
  { key: 'market', label: 'Market', icon: 'cart' },
  { key: 'eczane', label: 'Eczane', icon: 'medkit' },
  { key: 'hastane', label: 'Hastane', icon: 'medical' },
  { key: 'otel', label: 'Otel', icon: 'bed' },
  { key: 'turizm', label: 'Turizm', icon: 'compass' },
  { key: 'egitim', label: 'Eğitim', icon: 'school' },
] as const;

export const EMERGENCY_NUMBERS = [
  { name: 'Acil Yardım', number: '112', icon: 'alert-circle' },
  { name: 'Polis', number: '155', icon: 'shield' },
  { name: 'Jandarma', number: '156', icon: 'shield-checkmark' },
  { name: 'İtfaiye', number: '110', icon: 'flame' },
  { name: 'AFAD', number: '122', icon: 'warning' },
  { name: 'Sağlık', number: '184', icon: 'heart' },
];

export const LOCAL_FOODS = [
  {
    name: 'Büryan Kebabı',
    description: 'Bitlis\'in en meşhur yemeği',
  },
  {
    name: 'Kürt Kavurması',
    description: 'Geleneksel et yemeği',
  },
  { name: 'Katmer', description: 'Tatlı hamur işi' },
  {
    name: 'Murtuga',
    description: 'Geleneksel kahvaltılık',
  },
  {
    name: 'Tirit',
    description: 'Ekmek bazlı yemek',
  },
];
