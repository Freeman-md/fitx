import { Stack, useLocalSearchParams, useRouter } from 'expo-router';

import { DayBlocksView } from '@/features/plan/components/DayBlocksView';
import { useDayBlocksScreen } from '@/features/plan/hooks/use-day-blocks-screen';

export default function DayBlocksScreen() {
  const router = useRouter();
  const { planId, dayId } = useLocalSearchParams<{ planId: string; dayId: string }>();
  const {
    currentPlan,
    currentDay,
    orderedBlocks,
    draftTitle,
    draftDuration,
    editingBlock,
    setDraftTitle,
    setDraftDuration,
    addBlockWithValidation,
    saveBlockEdit,
    confirmDeleteBlock,
    beginBlockEdit,
    setEditingTitle,
    setEditingDuration,
    cancelBlockEdit,
    moveBlock,
  } = useDayBlocksScreen(planId, dayId);

  return (
    <>
      <Stack.Screen
        options={{
          title: currentDay?.name ? `Day: ${currentDay.name}` : 'Day',
          headerBackTitle: 'Back',
          headerBackTitleVisible: true,
        }}
      />
      <DayBlocksView
        plan={currentPlan}
        day={currentDay}
        blocks={orderedBlocks}
        draftTitle={draftTitle}
        draftDuration={draftDuration}
        editingBlock={editingBlock}
        onChangeDraftTitle={setDraftTitle}
        onChangeDraftDuration={setDraftDuration}
        onAddBlock={() => void addBlockWithValidation()}
        onCancelEdit={cancelBlockEdit}
        onSaveEdit={() => void saveBlockEdit()}
        onStartEdit={beginBlockEdit}
        onChangeEditingTitle={setEditingTitle}
        onChangeEditingDuration={setEditingDuration}
        onMoveUp={(blockId) => void moveBlock(blockId, 'up')}
        onMoveDown={(blockId) => void moveBlock(blockId, 'down')}
        onShowExercises={(blockId) =>
          router.push(`/plans/${planId}/days/${dayId}/blocks/${blockId}`)
        }
        onDeleteBlock={confirmDeleteBlock}
        onBack={() => router.back()}
      />
    </>
  );
}
