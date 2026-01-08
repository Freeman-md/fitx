import { useCallback, useMemo, useState } from 'react';
import { useFocusEffect } from 'expo-router';

import type { Exercise, WorkoutPlan } from '@/data/models';
import { loadWorkoutPlans, saveWorkoutPlans } from '@/data/storage';
import { normalizeOrder, sortByOrder } from '@/features/plan/utils/order';

type MoveDirection = 'up' | 'down';

export function useBlockExercises(
  planId: string | undefined,
  dayId: string | undefined,
  blockId: string | undefined
) {
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

  const currentBlock = useMemo(
    () => currentDay?.blocks.find((block) => block.id === blockId) ?? null,
    [currentDay, blockId]
  );

  const orderedExercises = useMemo(() => {
    if (!currentBlock) {
      return [];
    }
    return sortByOrder(currentBlock.exercises);
  }, [currentBlock]);

  const persistPlan = async (nextPlan: WorkoutPlan) => {
    const nextPlans = plans.map((plan) => (plan.id === nextPlan.id ? nextPlan : plan));
    await saveWorkoutPlans(nextPlans);
    setPlans(nextPlans);
  };

  const updateBlock = async (updater: (exercises: Exercise[]) => Exercise[]) => {
    if (!currentPlan || !currentDay || !currentBlock) {
      return;
    }
    const updatedAt = new Date().toISOString();
    const nextBlocks = currentDay.blocks.map((block) =>
      block.id === currentBlock.id
        ? { ...block, exercises: updater(block.exercises), updatedAt }
        : block
    );
    const nextDays = currentPlan.days.map((day) =>
      day.id === currentDay.id ? { ...day, blocks: nextBlocks, updatedAt } : day
    );
    const nextPlan = {
      ...currentPlan,
      days: nextDays,
      updatedAt,
    };
    await persistPlan(nextPlan);
  };

  const addExercise = async (exercise: Exercise) => {
    await updateBlock((exercises) => [...exercises, exercise]);
  };

  const editExercise = async (exerciseId: string, updater: (exercise: Exercise) => Exercise) => {
    const updatedAt = new Date().toISOString();
    await updateBlock((exercises) =>
      exercises.map((exercise) =>
        exercise.id === exerciseId ? { ...updater(exercise), updatedAt } : exercise
      )
    );
  };

  const deleteExercise = async (exerciseId: string) => {
    await updateBlock((exercises) => exercises.filter((exercise) => exercise.id !== exerciseId));
  };

  const moveExercise = async (exerciseId: string, direction: MoveDirection) => {
    const list = [...orderedExercises];
    const index = list.findIndex((exercise) => exercise.id === exerciseId);
    if (index === -1) {
      return;
    }
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) {
      return;
    }
    [list[index], list[targetIndex]] = [list[targetIndex], list[index]];
    const updatedAt = new Date().toISOString();
    const nextExercises = normalizeOrder(list).map((exercise) => ({
      ...exercise,
      updatedAt,
    }));
    await updateBlock(() => nextExercises);
  };

  return {
    currentPlan,
    currentDay,
    currentBlock,
    orderedExercises,
    addExercise,
    editExercise,
    deleteExercise,
    moveExercise,
  };
}
