import { StyleSheet, View } from 'react-native';

import type { Exercise } from '@/data/models';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PrimaryText, SecondaryText } from '@/components/ui/text';
import { Spacing } from '@/components/ui/spacing';

type ExerciseCardProps = {
  exercise: Exercise;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export function ExerciseCard({
  exercise,
  onMoveUp,
  onMoveDown,
  onEdit,
  onDelete,
}: ExerciseCardProps) {
  return (
    <Card style={styles.card}>
      <View style={styles.row}>
        <PrimaryText style={styles.cardTitle}>{exercise.name || 'Untitled'}</PrimaryText>
        <SecondaryText style={styles.cardMeta}>#{exercise.order}</SecondaryText>
      </View>
      <View style={styles.row}>
        <Button label="Up" variant="secondary" size="compact" onPress={onMoveUp} />
        <Button label="Down" variant="secondary" size="compact" onPress={onMoveDown} />
        <Button label="Edit" variant="secondary" size="compact" onPress={onEdit} />
        <Button label="Delete" variant="destructive" size="compact" onPress={onDelete} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  cardTitle: {
    fontWeight: '600',
  },
  cardMeta: {
    opacity: 0.7,
  },
});
