import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { Block, WorkoutDay, WorkoutPlan } from '@/data/models';
import { BlockCard } from '@/features/plan/components/BlockCard';
import { BlockForm } from '@/features/plan/components/BlockForm';

type EditableBlock = {
  id: string;
  title: string;
  durationMinutes: string;
};

type DayBlocksViewProps = {
  plan: WorkoutPlan | null;
  day: WorkoutDay | null;
  blocks: Block[];
  draftTitle: string;
  draftDuration: string;
  editingBlock: EditableBlock | null;
  onChangeDraftTitle: (value: string) => void;
  onChangeDraftDuration: (value: string) => void;
  onAddBlock: () => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  onStartEdit: (block: Block) => void;
  onChangeEditingTitle: (value: string) => void;
  onChangeEditingDuration: (value: string) => void;
  onMoveUp: (blockId: string) => void;
  onMoveDown: (blockId: string) => void;
  onShowExercises: (blockId: string) => void;
  onDeleteBlock: (blockId: string, blockTitle: string) => void;
  onBack: () => void;
};

export function DayBlocksView({
  plan,
  day,
  blocks,
  draftTitle,
  draftDuration,
  editingBlock,
  onChangeDraftTitle,
  onChangeDraftDuration,
  onAddBlock,
  onCancelEdit,
  onSaveEdit,
  onStartEdit,
  onChangeEditingTitle,
  onChangeEditingDuration,
  onMoveUp,
  onMoveDown,
  onShowExercises,
  onDeleteBlock,
  onBack,
}: DayBlocksViewProps) {
  if (!plan || !day) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.container}>
          <Text>Day not found.</Text>
          <Button title="Back" onPress={onBack} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container} alwaysBounceVertical={false}>
        <Text style={styles.title}>{day.name}</Text>
        <Text style={styles.subtitle}>
          {plan.name} · {plan.gymType ?? 'No gym type'}
        </Text>
        <View style={styles.section}>
          <BlockForm
            title={draftTitle}
            durationMinutes={draftDuration}
            onChangeTitle={onChangeDraftTitle}
            onChangeDuration={onChangeDraftDuration}
            onSubmit={onAddBlock}
            submitLabel="Add Block"
          />
        </View>
        <View style={styles.section}>
          {blocks.length === 0 ? (
            <Text>No blocks yet.</Text>
          ) : (
            blocks.map((block) => (
              <BlockCard
                key={block.id}
                block={block}
                isEditing={editingBlock?.id === block.id}
                editingTitle={editingBlock?.title ?? block.title}
                editingDuration={editingBlock?.durationMinutes ?? String(block.durationMinutes)}
                onChangeTitle={onChangeEditingTitle}
                onChangeDuration={onChangeEditingDuration}
                onCancelEdit={onCancelEdit}
                onSaveEdit={onSaveEdit}
                onMoveUp={() => onMoveUp(block.id)}
                onMoveDown={() => onMoveDown(block.id)}
                onShowExercises={() => onShowExercises(block.id)}
                onStartEdit={() => onStartEdit(block)}
                onDelete={() => onDeleteBlock(block.id, block.title)}
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    padding: 16,
    gap: 16,
  },
  title: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    opacity: 0.7,
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 12,
    opacity: 0.7,
  },
  section: {
    gap: 12,
  },
});
