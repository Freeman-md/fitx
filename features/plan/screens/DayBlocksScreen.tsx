import { useEffect, useState } from 'react';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';

import { BottomSheet } from '@/components/ui/bottom-sheet';
import { FormFooter } from '@/components/ui/form-footer';
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
  const [titleTouched, setTitleTouched] = useState(false);
  const [editTitleTouched, setEditTitleTouched] = useState(false);

  useEffect(() => {
    if (editingBlock) {
      setEditTitleTouched(false);
    }
  }, [editingBlock]);

  const trimmedTitle = draftTitle.trim();
  const titleError =
    titleTouched && trimmedTitle.length === 0 ? 'Block title is required.' : '';
  const isAddValid = trimmedTitle.length > 0;

  const trimmedEditTitle = editingBlock?.title.trim() ?? '';
  const editTitleError =
    editTitleTouched && trimmedEditTitle.length === 0 ? 'Block title is required.' : '';
  const isEditValid = trimmedEditTitle.length > 0;

  const closeAddBlockSheet = () => {
    setIsAddOpen(false);
    setDraftTitle('');
    setDraftDuration(5);
    setTitleTouched(false);
  };

  const handleAddBlock = async () => {
    if (!isAddValid) {
      return;
    }
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
          <FormFooter
            primaryLabel="Save"
            secondaryLabel="Cancel"
            onPrimary={() => void handleAddBlock()}
            onSecondary={closeAddBlockSheet}
            primaryDisabled={!isAddValid}
          />
        }>
        <BlockForm
          title={draftTitle}
          durationMinutes={draftDuration}
          onChangeTitle={(value) => {
            setDraftTitle(value);
            if (!titleTouched) {
              setTitleTouched(true);
            }
          }}
          onBlurTitle={() => setTitleTouched(true)}
          titleError={titleError}
          onChangeDuration={setDraftDuration}
        />
      </BottomSheet>
      <BottomSheet
        visible={Boolean(editingBlock)}
        title="Edit Block"
        onDismiss={cancelBlockEdit}
        footer={
          <FormFooter
            primaryLabel="Save"
            secondaryLabel="Cancel"
            onPrimary={() => void saveBlockEdit()}
            onSecondary={cancelBlockEdit}
            primaryDisabled={!isEditValid}
          />
        }>
        {editingBlock ? (
          <BlockForm
            title={editingBlock.title}
            durationMinutes={editingBlock.durationMinutes}
            onChangeTitle={(value) => {
              setEditingTitle(value);
              if (!editTitleTouched) {
                setEditTitleTouched(true);
              }
            }}
            onBlurTitle={() => setEditTitleTouched(true)}
            titleError={editTitleError}
            onChangeDuration={setEditingDuration}
          />
        ) : null}
      </BottomSheet>
    </>
  );
}
