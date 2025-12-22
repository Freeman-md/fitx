import type { Session, WorkoutDay, WorkoutPlan } from './models';
import { loadSessions, saveSessions } from './storage';

function createSessionId(timestamp: number): string {
  const randomSuffix = Math.random().toString(36).slice(2, 8);
  return `session-${timestamp}-${randomSuffix}`;
}

function buildSession(plan: WorkoutPlan, day: WorkoutDay, startedAt: string): Session {
  return {
    id: createSessionId(Date.parse(startedAt)),
    workoutPlanId: plan.id,
    workoutDayId: day.id,
    startedAt,
    status: 'active',
    blocks: day.blocks.map((block) => ({
      blockId: block.id,
      startedAt,
      exercises: block.exercises.map((exercise) => ({
        exerciseId: exercise.id,
        sets: Array.from({ length: exercise.sets }, (_, index) => ({
          setNumber: index + 1,
          targetReps: exercise.repsMin ?? exercise.repsMax,
          targetTimeSeconds: exercise.timeSeconds,
          completed: false,
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
    if (session.status !== 'active' || session.id === nextSessionId) {
      return session;
    }

    return {
      ...session,
      status: 'abandoned',
      endedAt: session.endedAt ?? endedAt,
    };
  });
}

export async function startSession(plan: WorkoutPlan, day: WorkoutDay): Promise<Session> {
  const startedAt = new Date().toISOString();
  const session = buildSession(plan, day, startedAt);
  const existingSessions = await loadSessions();
  const updatedSessions = closeActiveSessions(existingSessions, startedAt, session.id);
  await saveSessions([...updatedSessions.filter((item) => item.id !== session.id), session]);
  return session;
}
