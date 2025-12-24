import { useCallback, useMemo, useState } from 'react';
import { useFocusEffect } from 'expo-router';

import type { Block, WorkoutDay, WorkoutPlan } from '@/data/models';
import { loadWorkoutPlans, saveWorkoutPlans } from '@/data/storage';

type MoveDirection = 'up' | 'down';

export function useDayBlocks(planId: string | undefined, dayId: string | undefined) {
  const [plans, setPlans] = useState<WorkoutPlan[]>([]);

  const loadPlan = useCallback(async () => {
    const storedPlans = await loadWorkoutPlans();
    setPlans(storedPlans);
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadPlan();
    }, [loadPlan])
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
    return [...currentDay.blocks].sort((a, b) => a.order - b.order);
  }, [currentDay]);

  const persistPlan = async (nextPlan: WorkoutPlan) => {
    const nextPlans = plans.map((plan) => (plan.id === nextPlan.id ? nextPlan : plan));
    await saveWorkoutPlans(nextPlans);
    setPlans(nextPlans);
  };

  const updateDay = async (updater: (day: WorkoutDay) => WorkoutDay) => {
    if (!currentPlan || !currentDay) {
      return;
    }
    const nextPlan = {
      ...currentPlan,
      days: currentPlan.days.map((day) => (day.id === currentDay.id ? updater(day) : day)),
      updatedAt: new Date().toISOString(),
    };
    await persistPlan(nextPlan);
  };

  const normalizeBlockOrder = (blocks: Block[]) => {
    return blocks.map((block, index) => ({ ...block, order: index + 1 }));
  };

  const addBlock = async (title: string, durationMinutes: number) => {
    if (!currentDay) {
      return false;
    }
    const nextOrder =
      orderedBlocks.length > 0 ? orderedBlocks[orderedBlocks.length - 1].order + 1 : 1;
    const nextBlock: Block = {
      id: `block-${Date.now()}`,
      title,
      durationMinutes,
      order: nextOrder,
      exercises: [],
    };
    await updateDay((day) => ({ ...day, blocks: [...day.blocks, nextBlock] }));
    return true;
  };

  const editBlock = async (blockId: string, title: string, durationMinutes: number) => {
    await updateDay((day) => ({
      ...day,
      blocks: day.blocks.map((block) =>
        block.id === blockId ? { ...block, title, durationMinutes } : block
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
    const normalizedBlocks = normalizeBlockOrder(blocks);
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
