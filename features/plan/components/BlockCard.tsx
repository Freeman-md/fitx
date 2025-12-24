import { Button, StyleSheet, Text, TextInput, View } from 'react-native';

import type { Block } from '@/data/models';

type BlockCardProps = {
  block: Block;
  isEditing: boolean;
  editingTitle: string;
  editingDuration: string;
  onChangeTitle: (value: string) => void;
  onChangeDuration: (value: string) => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onShowExercises: () => void;
  onStartEdit: () => void;
  onDelete: () => void;
};

export function BlockCard({
  block,
  isEditing,
  editingTitle,
  editingDuration,
  onChangeTitle,
  onChangeDuration,
  onCancelEdit,
  onSaveEdit,
  onMoveUp,
  onMoveDown,
  onShowExercises,
  onStartEdit,
  onDelete,
}: BlockCardProps) {
  return (
    <View style={styles.card}>
      {isEditing ? (
        <>
          <TextInput
            value={editingTitle}
            onChangeText={onChangeTitle}
            style={styles.input}
          />
          <TextInput
            value={editingDuration}
            onChangeText={onChangeDuration}
            keyboardType="number-pad"
            style={styles.input}
          />
          <View style={styles.row}>
            <Button title="Cancel" onPress={onCancelEdit} />
            <Button title="Save" onPress={onSaveEdit} />
          </View>
        </>
      ) : (
        <>
          <View style={styles.row}>
            <Text style={styles.cardTitle}>{block.title}</Text>
            <Text style={styles.cardMeta}>
              {block.durationMinutes}m · #{block.order}
            </Text>
          </View>
          <View style={styles.row}>
            <Button title="Up" onPress={onMoveUp} />
            <Button title="Down" onPress={onMoveDown} />
            <Button title="Exercises" onPress={onShowExercises} />
            <Button title="Edit" onPress={onStartEdit} />
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
