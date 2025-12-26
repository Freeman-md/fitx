import type { Session, WorkoutDay, WorkoutPlan } from '@/data/models';

export type SummaryViewModel = {
  planName: string;
  dayName: string;
  startedAt: string;
  endedAt: string;
  durationLabel: string;
  recapItems: SummaryRecapItem[];
};

export type SummaryRecapItem = {
  id: string;
  name: string;
  completedSets: number;
  skippedSets: number;
  totalSets: number;
};

const formatDuration = (startedAt: string, endedAt: string) => {
  const durationMs = Date.parse(endedAt) - Date.parse(startedAt);
  if (Number.isNaN(durationMs) || durationMs <= 0) {
    return 'Unknown duration';
  }
  const totalMinutes = Math.round(durationMs / 60000);
  return `${totalMinutes} min`;
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

  const recapByExercise = new Map<string, SummaryRecapItem>();
  const recapOrder: string[] = [];
  for (const block of session.blocks) {
    for (const exercise of block.exercises) {
      const completedSets = exercise.sets.filter((set) => set.completed).length;
      const skippedSets = exercise.sets.filter((set) => !set.completed).length;
      const totalSets = exercise.sets.length;
      const name = exerciseNameById.get(exercise.exerciseId) ?? 'Unknown exercise';
      const existing = recapByExercise.get(exercise.exerciseId);
      if (existing) {
        recapByExercise.set(exercise.exerciseId, {
          ...existing,
          completedSets: existing.completedSets + completedSets,
          skippedSets: existing.skippedSets + skippedSets,
          totalSets: existing.totalSets + totalSets,
        });
      } else {
        recapByExercise.set(exercise.exerciseId, {
          id: exercise.exerciseId,
          name,
          completedSets,
          skippedSets,
          totalSets,
        });
        recapOrder.push(exercise.exerciseId);
      }
    }
  }

  return {
    planName: plan?.name ?? 'Unknown',
    dayName: day?.name ?? 'Unknown',
    startedAt: session.startedAt,
    endedAt: session.endedAt ?? 'In progress',
    durationLabel:
      session.endedAt ? formatDuration(session.startedAt, session.endedAt) : 'In progress',
    recapItems: recapOrder
      .map((id) => recapByExercise.get(id))
      .filter(Boolean) as SummaryRecapItem[],
  };
};
