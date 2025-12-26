import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';

import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Button } from '@/components/ui/button';
import { Spacing } from '@/components/ui/spacing';
import { BlockForm } from '@/features/plan/components/BlockForm';
import { DayBlocksView } from '@/features/plan/components/DayBlocksView';
import { useDayBlocksScreen } from '@/features/plan/hooks/use-day-blocks-screen';

export default function DayBlocksScreen() {
  const router = useRouter();
  const { planId, dayId } = useLocalSearchParams<{ planId: string; dayId: string }>();
  const {
    currentPlan,
    currentDay,
    orderedBlocks,
    editingBlock,
    draftTitle,
    draftDuration,
    saveBlockEdit,
    confirmDeleteBlock,
    beginBlockEdit,
    setDraftTitle,
    setDraftDuration,
    setEditingTitle,
    setEditingDuration,
    cancelBlockEdit,
    moveBlock,
    addBlockWithValidation,
  } = useDayBlocksScreen(planId, dayId);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const closeAddBlockSheet = () => {
    setIsAddOpen(false);
    setDraftTitle('');
    setDraftDuration('');
  };

  const handleAddBlock = async () => {
    const added = await addBlockWithValidation();
    if (added) {
      closeAddBlockSheet();
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Day Details',
          headerBackTitle: 'Back',
          headerBackTitleVisible: true,
        }}
      />
      <DayBlocksView
        plan={currentPlan}
        day={currentDay}
        blocks={orderedBlocks}
        onAddBlock={() => setIsAddOpen(true)}
        onMoveUp={(blockId) => void moveBlock(blockId, 'up')}
        onMoveDown={(blockId) => void moveBlock(blockId, 'down')}
        onShowExercises={(blockId) =>
          router.push(`/plans/${planId}/days/${dayId}/blocks/${blockId}`)
        }
        onEditBlock={beginBlockEdit}
        onDeleteBlock={confirmDeleteBlock}
        onBack={() => router.back()}
      />
      <BottomSheet
        visible={isAddOpen}
        title="Add Block"
        onDismiss={closeAddBlockSheet}
        footer={
          <View style={styles.footer}>
            <Button label="Save" onPress={() => void handleAddBlock()} style={styles.fullWidth} />
            <Button
              label="Cancel"
              variant="secondary"
              onPress={closeAddBlockSheet}
              style={styles.fullWidth}
            />
          </View>
        }>
        <BlockForm
          title={draftTitle}
          durationMinutes={draftDuration}
          onChangeTitle={setDraftTitle}
          onChangeDuration={setDraftDuration}
        />
      </BottomSheet>
      <BottomSheet
        visible={Boolean(editingBlock)}
        title="Edit Block"
        onDismiss={cancelBlockEdit}
        footer={
          <View style={styles.footer}>
            <Button label="Save" onPress={() => void saveBlockEdit()} style={styles.fullWidth} />
            <Button
              label="Cancel"
              variant="secondary"
              onPress={cancelBlockEdit}
              style={styles.fullWidth}
            />
          </View>
        }>
        {editingBlock ? (
          <BlockForm
            title={editingBlock.title}
            durationMinutes={editingBlock.durationMinutes}
            onChangeTitle={setEditingTitle}
            onChangeDuration={setEditingDuration}
          />
        ) : null}
      </BottomSheet>
    </>
  );
}

const styles = StyleSheet.create({
  footer: {
    gap: Spacing.sm,
  },
  fullWidth: {
    width: '100%',
  },
});
