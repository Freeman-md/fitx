import { useState } from 'react';
import { Alert } from 'react-native';

import type { Block } from '@/data/models';
import { useDayBlocks } from '@/features/plan/hooks/use-day-blocks';
import { getDurationAlert, getRequiredNameAlert, parsePositiveNumber } from '@/features/plan/utils/validation';

type EditableBlock = {
  id: string;
  title: string;
  durationMinutes: string;
};

export function useDayBlocksScreen(planId: string | undefined, dayId: string | undefined) {
  const { currentPlan, currentDay, orderedBlocks, addBlock, editBlock, deleteBlock, moveBlock } =
    useDayBlocks(planId, dayId);
  const [draftTitle, setDraftTitle] = useState('');
  const [draftDuration, setDraftDuration] = useState('');
  const [editingBlock, setEditingBlock] = useState<EditableBlock | null>(null);

  const addBlockWithValidation = async () => {
    const titleError = getRequiredNameAlert('Block title', draftTitle);
    if (titleError) {
      Alert.alert(titleError.title, titleError.message);
      return false;
    }
    const duration = parsePositiveNumber(draftDuration);
    if (!duration) {
      const durationError = getDurationAlert();
      Alert.alert(durationError.title, durationError.message);
      return false;
    }
    const added = await addBlock(draftTitle.trim(), duration);
    if (added) {
      setDraftTitle('');
      setDraftDuration('');
    }
    return added;
  };

  const saveBlockEdit = async () => {
    if (!editingBlock) {
      return;
    }
    const titleError = getRequiredNameAlert('Block title', editingBlock.title);
    if (titleError) {
      Alert.alert(titleError.title, titleError.message);
      return;
    }
    const duration = parsePositiveNumber(editingBlock.durationMinutes);
    if (!duration) {
      const durationError = getDurationAlert();
      Alert.alert(durationError.title, durationError.message);
      return;
    }
    await editBlock(editingBlock.id, editingBlock.title.trim(), duration);
    setEditingBlock(null);
  };

  const confirmDeleteBlock = (blockId: string, blockTitle: string) => {
    Alert.alert('Delete Block', `Delete "${blockTitle}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteBlock(blockId);
        },
      },
    ]);
  };

  const beginBlockEdit = (block: Block) => {
    setEditingBlock({
      id: block.id,
      title: block.title,
      durationMinutes: String(block.durationMinutes),
    });
  };

  const setEditingTitle = (value: string) => {
    setEditingBlock((current) => (current ? { ...current, title: value } : current));
  };

  const setEditingDuration = (value: string) => {
    setEditingBlock((current) => (current ? { ...current, durationMinutes: value } : current));
  };

  return {
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
    cancelBlockEdit: () => setEditingBlock(null),
    moveBlock,
  };
}
