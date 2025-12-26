import { useState } from 'react';
import { Alert } from 'react-native';

import type { Block } from '@/data/models';
import { useDayBlocks } from '@/features/plan/hooks/use-day-blocks';
type EditableBlock = {
  id: string;
  title: string;
  durationMinutes: number;
};

export function useDayBlocksScreen(planId: string | undefined, dayId: string | undefined) {
  const { currentPlan, currentDay, orderedBlocks, addBlock, editBlock, deleteBlock, moveBlock } =
    useDayBlocks(planId, dayId);
  const [draftTitle, setDraftTitle] = useState('');
  const [draftDuration, setDraftDuration] = useState(30);
  const [editingBlock, setEditingBlock] = useState<EditableBlock | null>(null);

  const addBlockWithValidation = async () => {
    if (!draftTitle.trim()) {
      return false;
    }
    const added = await addBlock(draftTitle.trim(), draftDuration);
    if (added) {
      setDraftTitle('');
      setDraftDuration(30);
    }
    return added;
  };

  const saveBlockEdit = async () => {
    if (!editingBlock) {
      return;
    }
    if (!editingBlock.title.trim()) {
      return;
    }
    await editBlock(editingBlock.id, editingBlock.title.trim(), editingBlock.durationMinutes);
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
      durationMinutes: block.durationMinutes,
    });
  };

  const setEditingTitle = (value: string) => {
    setEditingBlock((current) => (current ? { ...current, title: value } : current));
  };

  const setEditingDuration = (value: number) => {
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
