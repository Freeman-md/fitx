import { SessionStatus } from '@/data/models';
import type { Session, WorkoutDay, WorkoutPlan } from '@/data/models';
import { findNextIncompleteSet } from '@/data/session-runner';
import type { SessionPosition } from '@/data/session-runner';

export const selectPlanById = (plans: WorkoutPlan[], planId: string | null) => {
  if (!planId) {
    return null;
  }
  return plans.find((plan) => plan.id === planId) ?? null;
};

export const selectDayById = (plan: WorkoutPlan | null, dayId: string) => {
  if (!plan) {
    return null;
  }
  return plan.days.find((day) => day.id === dayId) ?? null;
};

export const selectActivePlan = (plans: WorkoutPlan[], activeSession: Session | null) => {
  if (!activeSession) {
    return null;
  }
  return plans.find((plan) => plan.id === activeSession.workoutPlanId) ?? null;
};

export const selectActiveDay = (plan: WorkoutPlan | null, activeSession: Session | null) => {
  if (!plan || !activeSession) {
    return null;
  }
  return plan.days.find((day) => day.id === activeSession.workoutDayId) ?? null;
};

export const selectActivePosition = (activeSession: Session | null): SessionPosition | null => {
  if (!activeSession || activeSession.status !== SessionStatus.Active) {
    return null;
  }
  return findNextIncompleteSet(activeSession);
};

export const isActiveSession = (activeSession: Session | null) => {
  return Boolean(activeSession && activeSession.status === SessionStatus.Active);
};
