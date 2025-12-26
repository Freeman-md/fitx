import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { Spacing } from '@/components/ui/spacing';

type FabProps = {
  onPress: () => void;
  accessibilityLabel: string;
  label: string;
};

export function Fab({ onPress, accessibilityLabel, label }: FabProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const backgroundColor = isDark ? '#f3f4f6' : '#111827';
  const textColor = isDark ? '#111827' : '#ffffff';
  const labelColor = isDark ? '#e5e7eb' : '#111827';

  return (
    <View style={styles.container}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        onPress={onPress}
        style={[styles.fab, { backgroundColor }]}>
        <Text style={[styles.icon, { color: textColor }]}>+</Text>
      </Pressable>
      <Text style={[styles.label, { color: labelColor }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: Spacing.md,
    bottom: Spacing.md,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  icon: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 30,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
});
