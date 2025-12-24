import { Button, StyleSheet, Text, View } from 'react-native';

import type { Exercise } from '@/data/models';

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
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.cardTitle}>{exercise.name || 'Untitled'}</Text>
        <Text style={styles.cardMeta}>#{exercise.order}</Text>
      </View>
      <View style={styles.row}>
        <Button title="Up" onPress={onMoveUp} />
        <Button title="Down" onPress={onMoveDown} />
        <Button title="Edit" onPress={onEdit} />
        <Button title="Delete" onPress={onDelete} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    padding: 12,
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  cardMeta: {
    fontSize: 12,
    opacity: 0.7,
  },
});
