import { SessionStatus } from '@/data/models';
import type { Session, WorkoutDay, WorkoutPlan } from '@/data/models';

export type HistoryListItem = {
  id: string;
  dateLabel: string;
  durationLabel: string;
};

export type HistoryExerciseDetail = {
  id: string;
  name: string;
  setLines: string[];
};

export type HistoryBlockDetail = {
  id: string;
  title: string;
  exercises: HistoryExerciseDetail[];
};

export type HistorySessionDetail = {
  startedAt: string;
  endedAt?: string;
  planName: string;
  dayName: string;
  blocks: HistoryBlockDetail[];
};

export type HistoryViewModel = {
  listItems: HistoryListItem[];
  selectedDetail: HistorySessionDetail | null;
};

const formatDuration = (startedAt: string, endedAt?: string) => {
  if (!endedAt) {
    return 'In progress';
  }
  const durationMs = Date.parse(endedAt) - Date.parse(startedAt);
  if (Number.isNaN(durationMs) || durationMs <= 0) {
    return 'Unknown duration';
  }
  const totalMinutes = Math.round(durationMs / 60000);
  return `${totalMinutes} min`;
};

const formatSessionDate = (endedAt?: string) => {
  return endedAt ? new Date(endedAt).toLocaleString() : 'Unknown date';
};

const getCompletedSessions = (sessions: Session[]) => {
  return sessions
    .filter((session) => session.status === SessionStatus.Completed && session.endedAt)
    .sort((a, b) => Date.parse(b.endedAt ?? '') - Date.parse(a.endedAt ?? ''));
};

const buildBlockTitleLookup = (day: WorkoutDay | null) => {
  const titles = new Map<string, string>();
  if (day) {
    for (const block of day.blocks) {
      titles.set(block.id, block.title);
    }
  }
  return titles;
};

const buildExerciseNameLookup = (day: WorkoutDay | null) => {
  const names = new Map<string, string>();
  if (day) {
    for (const block of day.blocks) {
      for (const exercise of block.exercises) {
        names.set(exercise.id, exercise.name);
      }
    }
  }
  return names;
};

const formatSets = (
  exercise: Session['blocks'][number]['exercises'][number],
  day: WorkoutDay | null
) => {
  const planExercise = day
    ? day.blocks.flatMap((block) => block.exercises).find((item) => item.id === exercise.exerciseId)
    : null;
  const usesTime = Boolean(planExercise?.timeSeconds);
  return exercise.sets.map((set) => {
    const target = usesTime
      ? planExercise?.timeSeconds
        ? `${planExercise.timeSeconds}s`
        : 'n/a'
      : set.targetReps
        ? `${set.targetReps} reps`
        : 'n/a';
    const actual = usesTime
      ? set.actualTimeSeconds
        ? `${set.actualTimeSeconds}s`
        : 'n/a'
      : set.actualReps
        ? `${set.actualReps} reps`
        : 'n/a';
    return `Set ${set.setNumber}: target ${target}, actual ${actual}, ${
      set.completed ? 'completed' : 'skipped'
    }`;
  });
};

export const buildHistoryViewModel = (
  sessions: Session[],
  plans: WorkoutPlan[],
  selectedSessionId: string | null
): HistoryViewModel => {
  const completedSessions = getCompletedSessions(sessions);
  const listItems = completedSessions.map((session) => ({
    id: session.id,
    dateLabel: formatSessionDate(session.endedAt),
    durationLabel: formatDuration(session.startedAt, session.endedAt),
  }));

  const selectedSession =
    completedSessions.find((session) => session.id === selectedSessionId) ?? null;
  if (!selectedSession) {
    return { listItems, selectedDetail: null };
  }

  const plan = plans.find((item) => item.id === selectedSession.workoutPlanId) ?? null;
  const day = plan?.days.find((item) => item.id === selectedSession.workoutDayId) ?? null;
  const blockTitleLookup = buildBlockTitleLookup(day);
  const exerciseNameLookup = buildExerciseNameLookup(day);

  const blocks = selectedSession.blocks.map((block) => ({
    id: block.blockId,
    title: blockTitleLookup.get(block.blockId) ?? 'Deleted block',
    exercises: block.exercises.map((exercise) => ({
      id: exercise.exerciseId,
      name: exerciseNameLookup.get(exercise.exerciseId) ?? 'Unknown exercise',
      setLines: formatSets(exercise, day),
    })),
  }));

  return {
    listItems,
    selectedDetail: {
      startedAt: selectedSession.startedAt,
      endedAt: selectedSession.endedAt,
      planName: plan?.name ?? 'Deleted plan',
      dayName: day?.name ?? 'Deleted day',
      blocks,
    },
  };
};
