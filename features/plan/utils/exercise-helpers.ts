import type { Exercise } from '@/data/models';

export type ExerciseDraft = {
  name: string;
  sets: string;
  repsMin: string;
  repsMax: string;
  timeSeconds: string;
  restSeconds: string;
  notes: string;
};

export const emptyDraft: ExerciseDraft = {
  name: '',
  sets: '',
  repsMin: '',
  repsMax: '',
  timeSeconds: '',
  restSeconds: '',
  notes: '',
};

const parseOptionalNumber = (value: string): number | undefined => {
  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : undefined;
};

export const buildExerciseFromDraft = (draft: ExerciseDraft, order: number): Exercise => {
  return {
    id: `exercise-${Date.now()}`,
    name: draft.name.trim(),
    order,
    sets: parseOptionalNumber(draft.sets) ?? 0,
    repsMin: parseOptionalNumber(draft.repsMin),
    repsMax: parseOptionalNumber(draft.repsMax),
    timeSeconds: parseOptionalNumber(draft.timeSeconds),
    restSeconds: parseOptionalNumber(draft.restSeconds) ?? 0,
    notes: draft.notes.trim() || undefined,
  };
};

export const draftFromExercise = (exercise: Exercise): ExerciseDraft => {
  return {
    name: exercise.name,
    sets: String(exercise.sets),
    repsMin: exercise.repsMin?.toString() ?? '',
    repsMax: exercise.repsMax?.toString() ?? '',
    timeSeconds: exercise.timeSeconds?.toString() ?? '',
    restSeconds: exercise.restSeconds.toString(),
    notes: exercise.notes ?? '',
  };
};

export const applyDraftToExercise = (exercise: Exercise, draft: ExerciseDraft): Exercise => {
  return {
    ...exercise,
    name: draft.name.trim(),
    sets: parseOptionalNumber(draft.sets) ?? 0,
    repsMin: parseOptionalNumber(draft.repsMin),
    repsMax: parseOptionalNumber(draft.repsMax),
    timeSeconds: parseOptionalNumber(draft.timeSeconds),
    restSeconds: parseOptionalNumber(draft.restSeconds) ?? 0,
    notes: draft.notes.trim() || undefined,
  };
};
