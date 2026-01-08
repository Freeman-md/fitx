import { useCallback, useMemo, useState } from 'react';
import { useFocusEffect } from 'expo-router';

import type { Weekday, WorkoutDay, WorkoutPlan } from '@/data/models';
import { loadWorkoutPlans, saveWorkoutPlans } from '@/data/storage';
import { getNextOrder, normalizeOrder, sortByOrder } from '@/features/plan/utils/order';
import { generateId } from '@/lib/id';

export type DayEdit = {
  id: string;
  name: string;
  weekday: Weekday | null;
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
    const updatedAt = new Date().toISOString();
    const nextPlan = {
      ...plan,
      days: plan.days.map((day) =>
        day.id === dayId ? { ...updater(day), updatedAt } : day
      ),
      updatedAt,
    };
    await persistPlan(nextPlan);
  };

  const isWeekdayTaken = (weekday: Weekday, excludeDayId?: string) => {
    if (!plan) {
      return false;
    }
    return plan.days.some((day) => day.weekday === weekday && day.id !== excludeDayId);
  };

  const addDay = async (name: string, weekday: Weekday) => {
    if (!plan) {
      return { ok: false, error: 'Plan not found.' };
    }
    if (isWeekdayTaken(weekday)) {
      return { ok: false, error: 'That weekday is already assigned.' };
    }
    const nextOrder = getNextOrder(orderedDays);
    const updatedAt = new Date().toISOString();
    const nextDay: WorkoutDay = {
      id: generateId('day'),
      name,
      weekday,
      order: nextOrder,
      updatedAt,
      blocks: [],
    };
    const nextPlan = {
      ...plan,
      days: [...plan.days, nextDay],
      updatedAt,
    };
    await persistPlan(nextPlan);
    return { ok: true };
  };

  const updateDayDetails = async (dayEdit: DayEdit) => {
    if (!dayEdit.weekday) {
      return { ok: false, error: 'Select a weekday.' };
    }
    if (isWeekdayTaken(dayEdit.weekday, dayEdit.id)) {
      return { ok: false, error: 'That weekday is already assigned.' };
    }
    await updateDay(dayEdit.id, (day) => ({
      ...day,
      name: dayEdit.name,
      weekday: dayEdit.weekday,
    }));
    return { ok: true };
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
    const updatedAt = new Date().toISOString();
    const normalizedDays = normalizeOrder(nextDays).map((day) => ({
      ...day,
      updatedAt,
    }));
    const nextPlan = {
      ...plan,
      days: normalizedDays,
      updatedAt,
    };
    await persistPlan(nextPlan);
  };

  return {
    plan,
    orderedDays,
    addDay,
    updateDayDetails,
    deleteDay,
    moveDay,
  };
}
