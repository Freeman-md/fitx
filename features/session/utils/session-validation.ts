import type { WorkoutPlan } from '@/data/models';

export type SessionStartCheck =
  | { ok: true }
  | { ok: false; reason: string };

export const canStartSessionFromPlan = (
  plan: WorkoutPlan | null,
  dayId: string
): SessionStartCheck => {
  if (!plan) {
    return { ok: false, reason: 'No plan selected.' };
  }
  const day = plan.days.find((item) => item.id === dayId);
  if (!day) {
    return { ok: false, reason: 'Selected day not found.' };
  }
  if (day.blocks.length === 0) {
    return { ok: false, reason: 'Add at least one block before starting a session.' };
  }
  const emptyBlock = day.blocks.find((block) => block.exercises.length === 0);
  if (emptyBlock) {
    return { ok: false, reason: 'Each block must have at least one exercise.' };
  }
  const invalidExercise = day.blocks.flatMap((block) => block.exercises).find((exercise) => {
    return !exercise.repsMin && !exercise.repsMax && !exercise.timeSeconds;
  });
  if (invalidExercise) {
    return { ok: false, reason: 'Each exercise needs reps or time to start a session.' };
  }
  return { ok: true };
};
