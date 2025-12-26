import { StyleSheet, TextInput, View } from 'react-native';

import type { Block } from '@/data/models';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PrimaryText, SecondaryText } from '@/components/ui/text';
import { Spacing } from '@/components/ui/spacing';

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
    <Card style={styles.card}>
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
            <Button label="Cancel" variant="secondary" size="compact" onPress={onCancelEdit} />
            <Button label="Save" size="compact" onPress={onSaveEdit} />
          </View>
        </>
      ) : (
        <>
          <View style={styles.row}>
            <PrimaryText style={styles.cardTitle}>{block.title}</PrimaryText>
            <SecondaryText style={styles.cardMeta}>
              {block.durationMinutes}m · #{block.order}
            </SecondaryText>
          </View>
          <View style={styles.row}>
            <Button label="Up" variant="secondary" size="compact" onPress={onMoveUp} />
            <Button label="Down" variant="secondary" size="compact" onPress={onMoveDown} />
            <Button label="Exercises" variant="secondary" size="compact" onPress={onShowExercises} />
            <Button label="Edit" variant="secondary" size="compact" onPress={onStartEdit} />
            <Button label="Delete" variant="destructive" size="compact" onPress={onDelete} />
          </View>
        </>
      )}
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
});
