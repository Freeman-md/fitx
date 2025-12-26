import { Button, StyleSheet, Text, TextInput, View } from 'react-native';

import type { WorkoutDay } from '@/data/models';

type DayCardProps = {
  day: WorkoutDay;
  isEditing: boolean;
  editingName: string;
  onChangeName: (value: string) => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onOpenBlocks: () => void;
  onStartEdit: () => void;
  onDelete: () => void;
};

export function DayCard({
  day,
  isEditing,
  editingName,
  onChangeName,
  onCancelEdit,
  onSaveEdit,
  onMoveUp,
  onMoveDown,
  onOpenBlocks,
  onStartEdit,
  onDelete,
}: DayCardProps) {
  return (
    <View style={styles.card}>
      {isEditing ? (
        <>
          <TextInput value={editingName} onChangeText={onChangeName} style={styles.input} />
          <View style={styles.row}>
            <Button title="Cancel" onPress={onCancelEdit} />
            <Button title="Save" onPress={onSaveEdit} />
          </View>
        </>
      ) : (
        <>
          <View style={styles.row}>
            <Text style={styles.cardTitle}>{day.name}</Text>
            <Text style={styles.cardMeta}>#{day.order}</Text>
          </View>
          <View style={styles.row}>
            <Button title="Up" onPress={onMoveUp} />
            <Button title="Down" onPress={onMoveDown} />
            <Button title="Blocks" onPress={onOpenBlocks} />
            <Button title="Rename" onPress={onStartEdit} />
            <Button title="Delete" onPress={onDelete} />
          </View>
        </>
      )}
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
});
