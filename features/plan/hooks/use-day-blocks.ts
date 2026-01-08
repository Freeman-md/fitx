import { useCallback, useMemo, useState } from 'react';
import { useFocusEffect } from 'expo-router';

import type { Block, WorkoutDay, WorkoutPlan } from '@/data/models';
import { loadWorkoutPlans, saveWorkoutPlans } from '@/data/storage';
import { attemptPlanMirror, markPlanDirty } from '@/data/mirror';
import { getNextOrder, normalizeOrder, sortByOrder } from '@/features/plan/utils/order';
import { generateId } from '@/lib/id';

type MoveDirection = 'up' | 'down';

export function useDayBlocks(planId: string | undefined, dayId: string | undefined) {
  const [plans, setPlans] = useState<WorkoutPlan[]>([]);

  const loadPlansFromStorage = useCallback(async () => {
    const storedPlans = await loadWorkoutPlans();
    setPlans(storedPlans);
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadPlansFromStorage();
    }, [loadPlansFromStorage])
  );

  const currentPlan = useMemo(
    () => plans.find((plan) => plan.id === planId) ?? null,
    [plans, planId]
  );

  const currentDay = useMemo(
    () => currentPlan?.days.find((day) => day.id === dayId) ?? null,
    [currentPlan, dayId]
  );

  const orderedBlocks = useMemo(() => {
    if (!currentDay) {
      return [];
    }
    return sortByOrder(currentDay.blocks);
  }, [currentDay]);

  const persistPlan = async (nextPlan: WorkoutPlan) => {
    const nextPlans = plans.map((plan) => (plan.id === nextPlan.id ? nextPlan : plan));
    await saveWorkoutPlans(nextPlans);
    await markPlanDirty(nextPlan.id);
    void attemptPlanMirror(nextPlan);
    setPlans(nextPlans);
  };

  const updateDay = async (updater: (day: WorkoutDay) => WorkoutDay) => {
    if (!currentPlan || !currentDay) {
      return;
    }
    const updatedAt = new Date().toISOString();
    const nextPlan = {
      ...currentPlan,
      days: currentPlan.days.map((day) =>
        day.id === currentDay.id ? { ...updater(day), updatedAt } : day
      ),
      updatedAt,
    };
    await persistPlan(nextPlan);
  };

  const addBlock = async (title: string, durationMinutes: number) => {
    if (!currentDay) {
      return false;
    }
    const nextOrder = getNextOrder(orderedBlocks);
    const updatedAt = new Date().toISOString();
    const nextBlock: Block = {
      id: generateId('block'),
      title,
      durationMinutes,
      order: nextOrder,
      updatedAt,
      exercises: [],
    };
    await updateDay((day) => ({ ...day, blocks: [...day.blocks, nextBlock] }));
    return true;
  };

  const editBlock = async (blockId: string, title: string, durationMinutes: number) => {
    const updatedAt = new Date().toISOString();
    await updateDay((day) => ({
      ...day,
      blocks: day.blocks.map((block) =>
        block.id === blockId ? { ...block, title, durationMinutes, updatedAt } : block
      ),
    }));
  };

  const deleteBlock = async (blockId: string) => {
    await updateDay((day) => ({
      ...day,
      blocks: day.blocks.filter((item) => item.id !== blockId),
    }));
  };

  const moveBlock = async (blockId: string, direction: MoveDirection) => {
    const blocks = [...orderedBlocks];
    const index = blocks.findIndex((block) => block.id === blockId);
    if (index === -1) {
      return;
    }
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= blocks.length) {
      return;
    }
    [blocks[index], blocks[targetIndex]] = [blocks[targetIndex], blocks[index]];
    const updatedAt = new Date().toISOString();
    const normalizedBlocks = normalizeOrder(blocks).map((block) => ({
      ...block,
      updatedAt,
    }));
    await updateDay((day) => ({ ...day, blocks: normalizedBlocks }));
  };

  return {
    currentPlan,
    currentDay,
    orderedBlocks,
    addBlock,
    editBlock,
    deleteBlock,
    moveBlock,
  };
}
