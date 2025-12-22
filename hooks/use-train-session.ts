import { useEffect, useMemo, useRef, useState } from 'react';
import { AppState } from 'react-native';

import type { Session, WorkoutPlan } from '@/data/models';
import { SessionStatus } from '@/data/models';
import { startSession } from '@/data/session';
import {
  findNextIncompleteSet,
  getSessionBlock,
  getSessionExercise,
  isSessionComplete,
  updateSessionSet,
} from '@/data/session-runner';
import {
  clearRestState,
  loadActiveSession,
  loadRestState,
  loadWorkoutPlans,
  saveLastCompletedSessionId,
  saveRestState,
  saveSession,
} from '@/data/storage';

type CurrentExerciseInfo = {
  name: string;
  totalSets: number;
  target: string;
  usesTime: boolean;
  restSeconds: number;
};

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
  const [isResting, setIsResting] = useState(false);
  const [restSecondsRemaining, setRestSecondsRemaining] = useState(0);
  const [restEndsAt, setRestEndsAt] = useState<string | null>(null);
  const restIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const appStateRef = useRef(AppState.currentState);

  useEffect(() => {
    const loadData = async () => {
      const storedPlans = await loadWorkoutPlans();
      const storedActiveSession = await loadActiveSession();
      const storedRestState = await loadRestState();
      setPlans(storedPlans);
      setActiveSession(storedActiveSession);

      // eslint-disable-next-line no-console
      console.log('active session check', storedActiveSession);

      if (storedActiveSession && storedRestState?.sessionId === storedActiveSession.id) {
        resumeRestTimer(storedRestState.endsAt);
      }
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
    const sessionExercise = getSessionExercise(activeSession, activePosition);
    const sessionBlock = getSessionBlock(activeSession, activePosition);
    const planBlock = activeDay.blocks.find((block) => block.id === sessionBlock.blockId);
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
  }, [activeDay, activePosition, activeSession]);

  const stopRestTimer = async () => {
    if (restIntervalRef.current) {
      clearInterval(restIntervalRef.current);
      restIntervalRef.current = null;
    }
    setIsResting(false);
    setRestSecondsRemaining(0);
    setRestEndsAt(null);
    await clearRestState();
  };

  const updateRestRemaining = (endsAt: string) => {
    const remaining = Math.max(0, Math.ceil((Date.parse(endsAt) - Date.now()) / 1000));
    setRestSecondsRemaining(remaining);
    return remaining;
  };

  const startRestTimer = async (seconds: number, sessionId: string) => {
    if (!seconds || seconds <= 0) {
      return;
    }

    await stopRestTimer();
    const endsAt = new Date(Date.now() + seconds * 1000).toISOString();
    setIsResting(true);
    setRestEndsAt(endsAt);
    updateRestRemaining(endsAt);
    await saveRestState({ sessionId, endsAt });

    restIntervalRef.current = setInterval(() => {
      const remaining = updateRestRemaining(endsAt);
      if (remaining <= 0) {
        void stopRestTimer();
      }
    }, 1000);
  };

  const resumeRestTimer = (endsAt: string) => {
    if (!endsAt) {
      return;
    }

    if (restIntervalRef.current) {
      clearInterval(restIntervalRef.current);
      restIntervalRef.current = null;
    }

    setIsResting(true);
    setRestEndsAt(endsAt);
    const remaining = updateRestRemaining(endsAt);
    if (remaining <= 0) {
      void stopRestTimer();
      return;
    }

    restIntervalRef.current = setInterval(() => {
      const nextRemaining = updateRestRemaining(endsAt);
      if (nextRemaining <= 0) {
        void stopRestTimer();
      }
    }, 1000);
  };

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      const previous = appStateRef.current;
      appStateRef.current = nextState;

      if (previous.match(/inactive|background/) && nextState === 'active' && restEndsAt) {
        resumeRestTimer(restEndsAt);
      }
    });

    return () => {
      subscription.remove();
      if (restIntervalRef.current) {
        clearInterval(restIntervalRef.current);
      }
    };
  }, [restEndsAt]);

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
      await startRestTimer(restSeconds, nextSession.id);
    }
  };

  const completeSet = async () => {
    await handleSetAction(true);
  };

  const skipSet = async () => {
    await handleSetAction(false);
  };

  const endSession = async (status: SessionStatus.Completed | SessionStatus.Abandoned) => {
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
