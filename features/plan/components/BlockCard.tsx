import { StyleSheet, TextInput, View } from 'react-native';

import type { Block } from '@/data/models';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PrimaryText, SecondaryText } from '@/components/ui/text';
import { Spacing } from '@/components/ui/spacing';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

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
  const colorScheme = useColorScheme();
  const borderColor = colorScheme === 'dark' ? '#374151' : '#e5e7eb';
  const textColor = colorScheme === 'dark' ? Colors.dark.text : Colors.light.text;

  return (
    <Card style={styles.card}>
      {isEditing ? (
        <>
          <SecondaryText>Block title</SecondaryText>
          <TextInput
            value={editingTitle}
            onChangeText={onChangeTitle}
            style={[styles.input, { borderColor, color: textColor }]}
          />
          <SecondaryText>Duration minutes</SecondaryText>
          <TextInput
            value={editingDuration}
            onChangeText={onChangeDuration}
            keyboardType="number-pad"
            style={[styles.input, { borderColor, color: textColor }]}
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
    borderRadius: 8,
    minHeight: 44,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
});
