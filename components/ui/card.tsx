import type { ReactNode } from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Spacing } from '@/components/ui/spacing';

type CardProps = ViewProps & {
  children: ReactNode;
};

export function Card({ children, style, ...props }: CardProps) {
  const colorScheme = useColorScheme();
  const borderColor = colorScheme === 'dark' ? '#374151' : '#e5e7eb';
  const backgroundColor = colorScheme === 'dark' ? Colors.dark.background : Colors.light.background;

  return (
    <View style={[styles.card, { borderColor, backgroundColor }, style]} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
});
