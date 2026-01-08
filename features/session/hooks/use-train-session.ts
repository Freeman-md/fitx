import { useCallback, useEffect, useMemo, useState } from 'react';

import type { Session, SessionStatus as SessionStatusType, WorkoutPlan } from '@/data/models';
import { SessionStatus } from '@/data/models';
import { getCurrentExerciseInfo, type CurrentExerciseInfo } from '@/features/session/utils/session-info';
import { resolveOwnerId } from '@/data/identity';
import { startSession } from '@/data/session';
import { mirrorCompletedSession, mirrorPendingSessions } from '@/data/mirror';
import { useRestTimer } from '@/features/session/hooks/use-rest-timer';
import { buildEndedSession, buildSessionAfterSetAction } from '@/features/session/utils/session-actions';
import {
  selectActiveDay,
  selectActivePlan,
  selectActivePosition,
  selectDayById,
  selectPlanById,
} from '@/features/session/utils/session-selectors';
import {
  loadActiveSession,
  loadSessions,
  loadWorkoutPlans,
  saveLastCompletedSessionId,
  saveSession,
} from '@/data/storage';

type UseTrainSessionOptions = {
  onSessionCompleted?: (session: Session) => void;
};

export function useTrainSession(options: UseTrainSessionOptions = {}) {
  const { onSessionCompleted } = options;
  const [plans, setPlans] = useState<WorkoutPlan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const [actualRepsInput, setActualRepsInput] = useState('');
  const [actualTimeInput, setActualTimeInput] = useState('');
  const { isResting, restSecondsRemaining, startRestTimer, stopRestTimer } = useRestTimer({
    sessionId: activeSession?.id ?? null,
  });

  const refreshSessionState = useCallback(async () => {
    const [storedPlans, storedActiveSession, storedSessions] = await Promise.all([
      loadWorkoutPlans(),
      loadActiveSession(),
      loadSessions(),
    ]);
    setPlans(storedPlans);
    setActiveSession(storedActiveSession);
    void mirrorPendingSessions(storedSessions);
  }, []);

  useEffect(() => {
    void refreshSessionState();
  }, [refreshSessionState]);

  const selectedPlan = useMemo(
    () => selectPlanById(plans, selectedPlanId),
    [plans, selectedPlanId]
  );

  const activePlan = useMemo(
    () => selectActivePlan(plans, activeSession),
    [plans, activeSession]
  );

  const activeDay = useMemo(
    () => selectActiveDay(activePlan, activeSession),
    [activePlan, activeSession]
  );

  const activePosition = useMemo(
    () => selectActivePosition(activeSession),
    [activeSession]
  );

  const currentExerciseInfo = useMemo<CurrentExerciseInfo | null>(() => {
    if (!activeSession || !activeDay || !activePosition) {
      return null;
    }
    return getCurrentExerciseInfo(activeSession, activeDay, activePosition);
  }, [activeDay, activePosition, activeSession]);

  const startSessionForDay = async (planId: string, dayId: string) => {
    const plan = selectPlanById(plans, planId);
    const day = selectDayById(plan, dayId);
    if (!plan || !day) {
      return;
    }

    const ownerId = await resolveOwnerId();
    const session = await startSession(plan, day, ownerId);
    setActiveSession(session);

  };

  const applySetResolution = async (markCompleted: boolean) => {
    if (!activeSession || !activePosition || isResting) {
      return;
    }

    const completedAt = new Date().toISOString();
    const actualRepsValue = actualRepsInput ? Number(actualRepsInput) : undefined;
    const actualTimeValue = actualTimeInput ? Number(actualTimeInput) : undefined;
    const nextSession = buildSessionAfterSetAction({
      session: activeSession,
      position: activePosition,
      markCompleted,
      completedAt,
      actualReps: actualRepsValue,
      actualTimeSeconds: actualTimeValue,
    });

    await saveSession(nextSession);
    if (nextSession.status === SessionStatus.Completed) {
      await saveLastCompletedSessionId(nextSession.id);
      void mirrorCompletedSession(nextSession);
      await stopRestTimer();
      setActiveSession(null);
      onSessionCompleted?.(nextSession);
    } else {
      setActiveSession(nextSession);
    }
    setActualRepsInput('');
    setActualTimeInput('');

    if (nextSession.status === SessionStatus.Active) {
      const restSeconds = currentExerciseInfo?.restSeconds ?? 0;
      await startRestTimer(restSeconds);
    }
  };

  const completeSet = async () => {
    await applySetResolution(true);
  };

  const skipSet = async () => {
    await applySetResolution(false);
  };

  const endSession = async (status: SessionStatusType) => {
    if (!activeSession) {
      return;
    }

    const endedAt = new Date().toISOString();
    const nextSession = buildEndedSession(activeSession, status, endedAt);
    await saveSession(nextSession);
    if (status === SessionStatus.Completed) {
      await saveLastCompletedSessionId(nextSession.id);
      void mirrorCompletedSession(nextSession);
    }
    await stopRestTimer();
    setActiveSession(null);
    if (status === SessionStatus.Completed) {
      onSessionCompleted?.(nextSession);
    }
  };

  return {
    plans,
    selectedPlanId,
    setSelectedPlanId,
    selectedPlan,
    activeSession,
    activePlan,
    activeDay,
    activePosition,
    currentExerciseInfo,
    actualRepsInput,
    setActualRepsInput,
    actualTimeInput,
    setActualTimeInput,
    isResting,
    restSecondsRemaining,
    startSessionForDay,
    completeSet,
    skipSet,
    skipRest: stopRestTimer,
    endSession,
    refreshSessionState,
  };
}
