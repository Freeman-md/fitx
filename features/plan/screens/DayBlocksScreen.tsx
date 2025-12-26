import { useLocalSearchParams, useRouter } from 'expo-router';

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
    handleAddBlock,
    handleSaveEdit,
    handleDeleteBlock,
    startEditingBlock,
    handleEditingTitleChange,
    handleEditingDurationChange,
    cancelEdit,
    moveBlock,
  } = useDayBlocksScreen(planId, dayId);

  return (
    <DayBlocksView
      plan={currentPlan}
      day={currentDay}
      blocks={orderedBlocks}
      draftTitle={draftTitle}
      draftDuration={draftDuration}
      editingBlock={editingBlock}
      onChangeDraftTitle={setDraftTitle}
      onChangeDraftDuration={setDraftDuration}
      onAddBlock={() => void handleAddBlock()}
      onCancelEdit={cancelEdit}
      onSaveEdit={() => void handleSaveEdit()}
      onStartEdit={startEditingBlock}
      onChangeEditingTitle={handleEditingTitleChange}
      onChangeEditingDuration={handleEditingDurationChange}
      onMoveUp={(blockId) => void moveBlock(blockId, 'up')}
      onMoveDown={(blockId) => void moveBlock(blockId, 'down')}
      onShowExercises={(blockId) =>
        router.push(`/plans/${planId}/days/${dayId}/blocks/${blockId}`)
      }
      onDeleteBlock={handleDeleteBlock}
      onBack={() => router.back()}
    />
  );
}
