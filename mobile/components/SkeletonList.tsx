import { useEffect, useRef } from 'react';
import { View, Animated, Easing } from 'react-native';

function SkeletonBlock({
  width,
  height,
  className,
}: {
  width: number | `${number}%`;
  height: number;
  className?: string;
}) {
  const opacity = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.85,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.35,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View
      className={`rounded-lg bg-gray-200 ${className ?? ''}`}
      style={{
        width,
        height,
        opacity,
      }}
    />
  );
}

export function NewsListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <View className="px-4 pt-2">
      {Array.from({ length: count }).map((_, i) => (
        <View
          key={i}
          className="bg-white rounded-xl p-4 mb-3"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          <SkeletonBlock width={80} height={18} className="mb-3" />
          <SkeletonBlock width="100%" height={20} className="mb-2" />
          <SkeletonBlock width="90%" height={16} className="mb-3" />
          <SkeletonBlock width={120} height={12} />
        </View>
      ))}
    </View>
  );
}

export function ListingListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <View className="px-4 pt-2">
      {Array.from({ length: count }).map((_, i) => (
        <View
          key={i}
          className="bg-white rounded-xl p-4 mb-3"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          <View className="flex-row justify-between">
            <View className="flex-1 mr-3">
              <SkeletonBlock width="100%" height={18} className="mb-2" />
              <SkeletonBlock width="60%" height={14} />
            </View>
            <SkeletonBlock width={72} height={22} />
          </View>
        </View>
      ))}
    </View>
  );
}
