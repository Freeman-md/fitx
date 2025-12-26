import { useCallback, useMemo, useState } from 'react';
import { useFocusEffect } from 'expo-router';

import type { WorkoutDay, WorkoutPlan } from '@/data/models';
import { loadWorkoutPlans, saveWorkoutPlans } from '@/data/storage';
import { getNextOrder, normalizeOrder, sortByOrder } from '@/features/plan/utils/order';

export type DayEdit = {
  id: string;
  name: string;
};

type MoveDirection = 'up' | 'down';

export function usePlanDays(planId: string | undefined) {
  const [plan, setPlan] = useState<WorkoutPlan | null>(null);
  const [plans, setPlans] = useState<WorkoutPlan[]>([]);

  const loadPlanFromStorage = useCallback(async () => {
    const storedPlans = await loadWorkoutPlans();
    setPlans(storedPlans);
    const selectedPlan = storedPlans.find((item) => item.id === planId) ?? null;
    setPlan(selectedPlan);
  }, [planId]);

  useFocusEffect(
    useCallback(() => {
      void loadPlanFromStorage();
    }, [loadPlanFromStorage])
  );

  const orderedDays = useMemo(() => {
    if (!plan) {
      return [];
    }
    return sortByOrder(plan.days);
  }, [plan]);

  const persistPlan = async (nextPlan: WorkoutPlan) => {
    const nextPlans = plans.map((item) => (item.id === nextPlan.id ? nextPlan : item));
    await saveWorkoutPlans(nextPlans);
    setPlans(nextPlans);
    setPlan(nextPlan);
  };

  const updateDay = async (dayId: string, updater: (day: WorkoutDay) => WorkoutDay) => {
    if (!plan) {
      return;
    }
    const nextPlan = {
      ...plan,
      days: plan.days.map((day) => (day.id === dayId ? updater(day) : day)),
      updatedAt: new Date().toISOString(),
    };
    await persistPlan(nextPlan);
  };

  const addDay = async (name: string) => {
    if (!plan) {
      return false;
    }
    const nextOrder = getNextOrder(orderedDays);
    const nextDay: WorkoutDay = {
      id: `day-${Date.now()}`,
      name,
      order: nextOrder,
      blocks: [],
    };
    const nextPlan = {
      ...plan,
      days: [...plan.days, nextDay],
      updatedAt: new Date().toISOString(),
    };
    await persistPlan(nextPlan);
    return true;
  };

  const renameDay = async (dayEdit: DayEdit) => {
    await updateDay(dayEdit.id, (day) => ({ ...day, name: dayEdit.name }));
  };

  const deleteDay = async (dayId: string) => {
    if (!plan) {
      return;
    }
    const remainingDays = plan.days.filter((item) => item.id !== dayId);
    const nextPlan = {
      ...plan,
      days: remainingDays,
      updatedAt: new Date().toISOString(),
    };
    await persistPlan(nextPlan);
  };

  const moveDay = async (dayId: string, direction: MoveDirection) => {
    if (!plan) {
      return;
    }
    const days = [...orderedDays];
    const index = days.findIndex((day) => day.id === dayId);
    if (index === -1) {
      return;
    }
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= days.length) {
      return;
    }
    const nextDays = [...days];
    [nextDays[index], nextDays[targetIndex]] = [nextDays[targetIndex], nextDays[index]];
    const normalizedDays = normalizeOrder(nextDays);
    const nextPlan = {
      ...plan,
      days: normalizedDays,
      updatedAt: new Date().toISOString(),
    };
    await persistPlan(nextPlan);
  };

  return {
    plan,
    orderedDays,
    addDay,
    renameDay,
    deleteDay,
    moveDay,
  };
}
