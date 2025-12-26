import { Pressable, StyleSheet } from 'react-native';

import type { WorkoutDay } from '@/data/models';
import { PrimaryText } from '@/components/ui/text';
import { Spacing } from '@/components/ui/spacing';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type DayChipProps = {
  day: WorkoutDay;
  isSelected: boolean;
  onPress: () => void;
};

export function DayChip({ day, isSelected, onPress }: DayChipProps) {
  const colorScheme = useColorScheme();
  const borderColor = colorScheme === 'dark' ? '#374151' : '#d1d5db';
  const selectedColor = colorScheme === 'dark' ? Colors.dark.tint : Colors.light.tint;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[
        styles.chip,
        { borderColor },
        isSelected ? styles.selected : null,
        isSelected ? { borderColor: selectedColor } : null,
      ]}>
      <PrimaryText style={[styles.label, isSelected ? { color: selectedColor } : null]}>
        {day.name}
      </PrimaryText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  selected: {
    borderWidth: 2,
  },
  label: {
    fontSize: 13,
  },
});
