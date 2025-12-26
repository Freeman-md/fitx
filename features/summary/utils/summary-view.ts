import type { Session, WorkoutDay, WorkoutPlan } from '@/data/models';

export type SummaryViewModel = {
  planName: string;
  dayName: string;
  startedAt: string;
  endedAt: string;
  exerciseNames: string[];
};

export const buildSummaryViewModel = (
  session: Session,
  plan: WorkoutPlan | null,
  day: WorkoutDay | null
): SummaryViewModel => {
  const exerciseNameById = new Map<string, string>();
  if (day) {
    for (const block of day.blocks) {
      for (const exercise of block.exercises) {
        exerciseNameById.set(exercise.id, exercise.name);
      }
    }
  }

  const completedExerciseIds = new Set<string>();
  for (const block of session.blocks) {
    for (const exercise of block.exercises) {
      if (exercise.sets.some((set) => set.completed)) {
        completedExerciseIds.add(exercise.exerciseId);
      }
    }
  }

  const completedExerciseNames = Array.from(completedExerciseIds)
    .map((id) => exerciseNameById.get(id))
    .filter((name): name is string => Boolean(name));

  return {
    planName: plan?.name ?? 'Unknown',
    dayName: day?.name ?? 'Unknown',
    startedAt: session.startedAt,
    endedAt: session.endedAt ?? 'In progress',
    exerciseNames:
      completedExerciseNames.length > 0
        ? completedExerciseNames
        : ['No completed exercises'],
  };
};
