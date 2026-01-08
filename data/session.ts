import { SessionStatus } from './models';
import type { Session, WorkoutDay, WorkoutPlan } from './models';
import { loadSessions, saveSession, saveSessions } from './storage';
import { generateId } from '@/lib/id';

function buildSession(
  plan: WorkoutPlan,
  day: WorkoutDay,
  ownerId: string,
  startedAt: string
): Session {
  const updatedAt = startedAt;
  return {
    id: generateId('session'),
    ownerId,
    workoutPlanId: plan.id,
    workoutDayId: day.id,
    startedAt,
    updatedAt,
    status: SessionStatus.Active,
    blocks: day.blocks.map((block) => ({
      blockId: block.id,
      startedAt,
      updatedAt,
      exercises: block.exercises.map((exercise) => ({
        exerciseId: exercise.id,
        updatedAt,
        sets: Array.from({ length: exercise.sets }, (_, index) => ({
          setNumber: index + 1,
          targetReps: exercise.repsMin ?? exercise.repsMax,
          targetTimeSeconds: exercise.timeSeconds,
          completed: false,
          updatedAt,
        })),
      })),
    })),
  };
}

function closeActiveSessions(
  sessions: Session[],
  endedAt: string,
  nextSessionId: string
): Session[] {
  return sessions.map((session) => {
    if (session.status !== SessionStatus.Active || session.id === nextSessionId) {
      return session;
    }

    return {
      ...session,
      status: SessionStatus.Abandoned,
      endedAt: session.endedAt ?? endedAt,
      updatedAt: endedAt,
    };
  });
}

export async function startSession(
  plan: WorkoutPlan,
  day: WorkoutDay,
  ownerId: string
): Promise<Session> {
  const startedAt = new Date().toISOString();
  const session = buildSession(plan, day, ownerId, startedAt);
  const existingSessions = await loadSessions();
  const updatedSessions = closeActiveSessions(existingSessions, startedAt, session.id);
  await saveSessions(updatedSessions);
  await saveSession(session);
  return session;
}
