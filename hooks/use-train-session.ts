import { useEffect, useMemo, useState } from 'react';

import type { Session, SessionStatus as SessionStatusType, WorkoutPlan } from '@/data/models';
import { SessionStatus } from '@/data/models';
import { getCurrentExerciseInfo, type CurrentExerciseInfo } from '@/data/session-info';
import { startSession } from '@/data/session';
import { useRestTimer } from '@/hooks/use-rest-timer';
import {
  findNextIncompleteSet,
  isSessionComplete,
  updateSessionSet,
} from '@/data/session-runner';
import {
  loadActiveSession,
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

  useEffect(() => {
    const loadData = async () => {
      const storedPlans = await loadWorkoutPlans();
      const storedActiveSession = await loadActiveSession();
      setPlans(storedPlans);
      setActiveSession(storedActiveSession);

      // eslint-disable-next-line no-console
      console.log('active session check', storedActiveSession);
    };

    void loadData();
  }, []);

  const selectedPlan = useMemo(
    () => plans.find((plan) => plan.id === selectedPlanId) ?? null,
    [plans, selectedPlanId]
  );

  const activePlan = useMemo(() => {
    if (!activeSession) {
      return null;
    }
    return plans.find((plan) => plan.id === activeSession.workoutPlanId) ?? null;
  }, [activeSession, plans]);

  const activeDay = useMemo(() => {
    if (!activePlan || !activeSession) {
      return null;
    }
    return activePlan.days.find((day) => day.id === activeSession.workoutDayId) ?? null;
  }, [activePlan, activeSession]);

  const activePosition = useMemo(() => {
    if (!activeSession || activeSession.status !== SessionStatus.Active) {
      return null;
    }
    return findNextIncompleteSet(activeSession);
  }, [activeSession]);

  const currentExerciseInfo = useMemo<CurrentExerciseInfo | null>(() => {
    if (!activeSession || !activeDay || !activePosition) {
      return null;
    }
    return getCurrentExerciseInfo(activeSession, activeDay, activePosition);
  }, [activeDay, activePosition, activeSession]);

  const startSessionForDay = async (planId: string, dayId: string) => {
    const plan = plans.find((item) => item.id === planId);
    const day = plan?.days.find((item) => item.id === dayId);
    if (!plan || !day) {
      return;
    }

    const session = await startSession(plan, day);
    setActiveSession(session);

    // eslint-disable-next-line no-console
    console.log('session started', session);
  };

  const handleSetAction = async (markCompleted: boolean) => {
    if (!activeSession || !activePosition || isResting) {
      return;
    }

    const completedAt = new Date().toISOString();
    const actualRepsValue = actualRepsInput ? Number(actualRepsInput) : undefined;
    const actualTimeValue = actualTimeInput ? Number(actualTimeInput) : undefined;
    const updatedSession = updateSessionSet(activeSession, activePosition, (set) => ({
      ...set,
      completed: markCompleted,
      completedAt,
      actualReps: markCompleted ? actualRepsValue ?? set.targetReps : undefined,
      actualTimeSeconds: markCompleted ? actualTimeValue ?? set.targetTimeSeconds : undefined,
    }));

    const nextSession = isSessionComplete(updatedSession)
      ? { ...updatedSession, status: SessionStatus.Completed, endedAt: completedAt }
      : updatedSession;

    await saveSession(nextSession);
    if (nextSession.status === SessionStatus.Completed) {
      await saveLastCompletedSessionId(nextSession.id);
      await stopRestTimer();
      setActiveSession(null);
      onSessionCompleted?.(nextSession);
    } else {
      setActiveSession(nextSession);
    }
    setActualRepsInput('');
    setActualTimeInput('');

    // eslint-disable-next-line no-console
    console.log('session progress saved', nextSession);

    if (nextSession.status === SessionStatus.Active) {
      const restSeconds = currentExerciseInfo?.restSeconds ?? 0;
      await startRestTimer(restSeconds);
    }
  };

  const completeSet = async () => {
    await handleSetAction(true);
  };

  const skipSet = async () => {
    await handleSetAction(false);
  };

  const endSession = async (status: SessionStatusType) => {
    if (!activeSession) {
      return;
    }

    const endedAt = new Date().toISOString();
    const nextSession: Session = {
      ...activeSession,
      status,
      endedAt,
    };
    await saveSession(nextSession);
    if (status === SessionStatus.Completed) {
      await saveLastCompletedSessionId(nextSession.id);
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
  };
}
