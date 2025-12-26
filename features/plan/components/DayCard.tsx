import { StyleSheet, TextInput, View } from 'react-native';

import type { WorkoutDay } from '@/data/models';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PrimaryText, SecondaryText } from '@/components/ui/text';
import { Spacing } from '@/components/ui/spacing';

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
    <Card style={styles.card}>
      {isEditing ? (
        <>
          <TextInput value={editingName} onChangeText={onChangeName} style={styles.input} />
          <View style={styles.row}>
            <Button label="Cancel" variant="secondary" size="compact" onPress={onCancelEdit} />
            <Button label="Save" size="compact" onPress={onSaveEdit} />
          </View>
        </>
      ) : (
        <>
          <View style={styles.row}>
            <PrimaryText style={styles.cardTitle}>{day.name}</PrimaryText>
            <SecondaryText style={styles.cardMeta}>#{day.order}</SecondaryText>
          </View>
          <View style={styles.row}>
            <Button label="Up" variant="secondary" size="compact" onPress={onMoveUp} />
            <Button label="Down" variant="secondary" size="compact" onPress={onMoveDown} />
            <Button label="Blocks" variant="secondary" size="compact" onPress={onOpenBlocks} />
            <Button label="Rename" variant="secondary" size="compact" onPress={onStartEdit} />
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
