import { SessionStatus } from '@/data/models';
import type { Session, SessionStatus as SessionStatusType } from '@/data/models';
import { isSessionComplete, updateSessionSet } from '@/data/session-runner';
import type { SessionPosition } from '@/data/session-runner';

type SetActionInput = {
  session: Session;
  position: SessionPosition;
  markCompleted: boolean;
  completedAt: string;
  actualReps?: number;
  actualTimeSeconds?: number;
};

export const buildSessionAfterSetAction = ({
  session,
  position,
  markCompleted,
  completedAt,
  actualReps,
  actualTimeSeconds,
}: SetActionInput): Session => {
  const updatedSession = updateSessionSet(session, position, (set) => ({
    ...set,
    completed: markCompleted,
    completedAt,
    actualReps: markCompleted ? actualReps ?? set.targetReps : undefined,
    actualTimeSeconds: markCompleted ? actualTimeSeconds ?? set.targetTimeSeconds : undefined,
  }));

  if (isSessionComplete(updatedSession)) {
    return { ...updatedSession, status: SessionStatus.Completed, endedAt: completedAt };
  }

  return updatedSession;
};

export const buildEndedSession = (
  session: Session,
  status: SessionStatusType,
  endedAt: string
): Session => {
  return {
    ...session,
    status,
    endedAt,
  };
};
