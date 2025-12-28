import { Animated, Easing, StyleSheet, View, type ViewStyle } from 'react-native';
import { useEffect, useRef } from 'react';

import { Button } from '@/components/ui/button';
import { PrimaryText, SecondaryText } from '@/components/ui/text';
import { Spacing } from '@/components/ui/spacing';
import { useColorScheme } from '@/hooks/use-color-scheme';

type EmptyStateProps = {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  actionVariant?: 'primary' | 'secondary';
  size?: 'screen' | 'section';
  style?: ViewStyle;
};

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  actionVariant = 'primary',
  size = 'section',
  style,
}: EmptyStateProps) {
  const colorScheme = useColorScheme();
  const floatAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const isDark = colorScheme === 'dark';
  const palette = {
    fill: isDark ? '#1f2937' : '#f3f4f6',
    outline: isDark ? '#374151' : '#d1d5db',
    accent: isDark ? '#93c5fd' : '#60a5fa',
    tray: isDark ? '#111827' : '#ffffff',
  };

  useEffect(() => {
    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 1400,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1400,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1400,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 1400,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );

    floatLoop.start();
    pulseLoop.start();

    return () => {
      floatLoop.stop();
      pulseLoop.stop();
    };
  }, [floatAnim, pulseAnim]);

  const floatY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [4, -6],
  });
  const shadowScale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.9, 1.05],
  });
  const shadowOpacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.15, 0.3],
  });

  return (
    <View style={[styles.container, size === 'screen' ? styles.screen : styles.section, style]}>
      <View style={styles.illustration}>
        <View style={[styles.tray, { borderColor: palette.outline, backgroundColor: palette.tray }]} />
        <Animated.View
          style={[
            styles.orbShadow,
            {
              backgroundColor: palette.accent,
              opacity: shadowOpacity,
              transform: [{ scale: shadowScale }],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.orb,
            {
              backgroundColor: palette.fill,
              borderColor: palette.outline,
              transform: [{ translateY: floatY }],
            },
          ]}>
          <View style={[styles.orbDot, { backgroundColor: palette.accent }]} />
        </Animated.View>
      </View>
      <PrimaryText style={styles.title}>{title}</PrimaryText>
      {description ? (
        <SecondaryText style={styles.description}>{description}</SecondaryText>
      ) : null}
      {actionLabel && onAction ? (
        <View style={styles.action}>
          <Button label={actionLabel} onPress={onAction} variant={actionVariant} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  screen: {
    flex: 1,
  },
  section: {
    minHeight: 180,
  },
  illustration: {
    width: 140,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tray: {
    position: 'absolute',
    bottom: 16,
    width: 108,
    height: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  orb: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  orbShadow: {
    position: 'absolute',
    bottom: 8,
    width: 48,
    height: 12,
    borderRadius: 6,
  },
  title: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
  },
  description: {
    textAlign: 'center',
  },
  action: {
    paddingTop: Spacing.xs,
  },
});
