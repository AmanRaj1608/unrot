import { View, StyleSheet, Animated } from "react-native";
import { useEffect, useRef } from "react";

function PulsingBlock({ width, height }: { width: number | string; height: number }) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[styles.block, { width: width as any, height, opacity }]}
    />
  );
}

function SkeletonCard() {
  return (
    <View style={styles.card}>
      <PulsingBlock width={60} height={20} />
      <PulsingBlock width="80%" height={16} />
      <PulsingBlock width="100%" height={14} />
      <PulsingBlock width="60%" height={14} />
    </View>
  );
}

export function FeedSkeleton() {
  return (
    <View>
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    gap: 10,
  },
  block: {
    backgroundColor: "#E5E7EB",
    borderRadius: 6,
  },
});
