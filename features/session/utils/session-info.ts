import type { Session, WorkoutDay } from '@/data/models';
import { getSessionBlock, getSessionExercise, type SessionPosition } from '@/data/session-runner';

export type CurrentExerciseInfo = {
  name: string;
  totalSets: number;
  target: string;
  usesTime: boolean;
  restSeconds: number;
};

export function getCurrentExerciseInfo(
  session: Session,
  day: WorkoutDay,
  position: SessionPosition
): CurrentExerciseInfo | null {
  const sessionExercise = getSessionExercise(session, position);
  const sessionBlock = getSessionBlock(session, position);
  const planBlock = day.blocks.find((block) => block.id === sessionBlock.blockId);
  const planExercise = planBlock?.exercises.find(
    (exercise) => exercise.id === sessionExercise.exerciseId
  );

  if (!planExercise) {
    return null;
  }

  const usesTime = Boolean(planExercise.timeSeconds);
  const targetReps =
    planExercise.repsMin && planExercise.repsMax
      ? `${planExercise.repsMin}-${planExercise.repsMax} reps`
      : planExercise.repsMin
        ? `${planExercise.repsMin} reps`
        : planExercise.repsMax
          ? `${planExercise.repsMax} reps`
          : null;

  const targetTime = planExercise.timeSeconds ? `${planExercise.timeSeconds}s` : null;

  return {
    name: planExercise.name,
    totalSets: sessionExercise.sets.length,
    target: targetTime ?? targetReps ?? 'No target',
    usesTime,
    restSeconds: planExercise.restSeconds,
  };
}
