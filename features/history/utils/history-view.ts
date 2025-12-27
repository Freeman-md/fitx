import { SessionStatus } from '@/data/models';
import type { Session, WorkoutDay, WorkoutPlan } from '@/data/models';

export type HistoryListItem = {
  id: string;
  dateLabel: string;
  durationLabel: string;
  planName: string;
  dayName: string;
};

export type HistoryExerciseDetail = {
  id: string;
  name: string;
  summary: string;
};

export type HistoryBlockDetail = {
  id: string;
  title: string;
  exercises: HistoryExerciseDetail[];
};

export type HistorySessionDetail = {
  dateLabel: string;
  timeRangeLabel: string;
  durationLabel: string;
  planName: string;
  dayName: string;
  blocks: HistoryBlockDetail[];
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
  return endedAt ? new Date(endedAt).toLocaleDateString() : 'Unknown date';
};

const formatTimeLabel = (timestamp?: string) => {
  if (!timestamp) {
    return 'Unknown time';
  }
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const formatTimeRange = (startedAt: string, endedAt?: string) => {
  const startLabel = formatTimeLabel(startedAt);
  const endLabel = endedAt ? formatTimeLabel(endedAt) : 'Unknown time';
  return `${startLabel} → ${endLabel}`;
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

const summarizeSets = (exercise: Session['blocks'][number]['exercises'][number]) => {
  const completedCount = exercise.sets.filter((set) => set.completed).length;
  const skippedCount = exercise.sets.length - completedCount;
  if (exercise.sets.length === 0) {
    return 'No sets logged';
  }
  const completedLabel = `${completedCount} completed`;
  const skippedLabel = skippedCount > 0 ? ` · ${skippedCount} skipped` : '';
  return `${completedLabel}${skippedLabel}`;
};

export const buildHistoryListItems = (sessions: Session[], plans: WorkoutPlan[]) => {
  const completedSessions = getCompletedSessions(sessions);
  return completedSessions.map((session) => {
    const plan = plans.find((item) => item.id === session.workoutPlanId) ?? null;
    const day = plan?.days.find((item) => item.id === session.workoutDayId) ?? null;
    return {
      id: session.id,
      dateLabel: formatSessionDate(session.endedAt),
      durationLabel: formatDuration(session.startedAt, session.endedAt),
      planName: plan?.name ?? 'Deleted plan',
      dayName: day?.name ?? 'Deleted day',
    };
  });
};

export const buildHistoryDetail = (
  sessions: Session[],
  plans: WorkoutPlan[],
  selectedSessionId: string | null
): HistorySessionDetail | null => {
  const completedSessions = getCompletedSessions(sessions);
  const selectedSession =
    completedSessions.find((session) => session.id === selectedSessionId) ?? null;
  if (!selectedSession) {
    return null;
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
      summary: summarizeSets(exercise),
    })),
  }));

  return {
    dateLabel: formatSessionDate(selectedSession.endedAt),
    timeRangeLabel: formatTimeRange(selectedSession.startedAt, selectedSession.endedAt),
    durationLabel: formatDuration(selectedSession.startedAt, selectedSession.endedAt),
    planName: plan?.name ?? 'Deleted plan',
    dayName: day?.name ?? 'Deleted day',
    blocks,
  };
};
