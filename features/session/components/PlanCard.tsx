import { Pressable, StyleSheet, View } from 'react-native';

import type { WorkoutPlan } from '@/data/models';
import { Card } from '@/components/ui/card';
import { PrimaryText, SecondaryText } from '@/components/ui/text';
import { Spacing } from '@/components/ui/spacing';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type PlanCardProps = {
  plan: WorkoutPlan;
  isSelected: boolean;
  onPress: () => void;
};

export function PlanCard({ plan, isSelected, onPress }: PlanCardProps) {
  const colorScheme = useColorScheme();
  const selectedBorderColor = colorScheme === 'dark' ? Colors.dark.tint : Colors.light.tint;

  return (
    <Pressable onPress={onPress} accessibilityRole="button">
      <Card style={[styles.card, isSelected ? { borderColor: selectedBorderColor } : null]}>
        <View style={styles.header}>
          <PrimaryText style={styles.title}>{plan.name}</PrimaryText>
          {isSelected ? (
            <SecondaryText style={styles.selectedLabel}>Selected</SecondaryText>
          ) : null}
        </View>
        {plan.gymType ? <SecondaryText>{plan.gymType}</SecondaryText> : null}
        <SecondaryText>{plan.days.length} days</SecondaryText>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.xs,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  title: {
    fontWeight: '600',
  },
  selectedLabel: {
    textTransform: 'uppercase',
    fontSize: 11,
    letterSpacing: 0.5,
  },
});
