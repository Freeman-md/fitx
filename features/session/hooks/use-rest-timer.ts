import { useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';

import { clearRestState, loadRestState, saveRestState } from '@/data/storage';
import { getRestSecondsRemaining } from '@/features/session/utils/rest-timer';

type UseRestTimerOptions = {
  sessionId: string | null;
};

export function useRestTimer({ sessionId }: UseRestTimerOptions) {
  const [isResting, setIsResting] = useState(false);
  const [restSecondsRemaining, setRestSecondsRemaining] = useState(0);
  const restIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const appStateRef = useRef(AppState.currentState);

  const updateRestRemaining = (endsAt: string) => {
    const remaining = getRestSecondsRemaining(endsAt);
    setRestSecondsRemaining(remaining);
    return remaining;
  };

  const stopRestTimer = async () => {
    if (restIntervalRef.current) {
      clearInterval(restIntervalRef.current);
      restIntervalRef.current = null;
    }
    setIsResting(false);
    setRestSecondsRemaining(0);
    await clearRestState();
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

  const startRestTimer = async (seconds: number) => {
    if (!seconds || seconds <= 0 || !sessionId) {
      return;
    }

    await stopRestTimer();
    const endsAt = new Date(Date.now() + seconds * 1000).toISOString();
    setIsResting(true);
    updateRestRemaining(endsAt);
    await saveRestState({ sessionId, endsAt });

    restIntervalRef.current = setInterval(() => {
      const remaining = updateRestRemaining(endsAt);
      if (remaining <= 0) {
        void stopRestTimer();
      }
    }, 1000);
  };

  useEffect(() => {
    const loadRestStateForSession = async () => {
      if (!sessionId) {
        return;
      }
      const storedRestState = await loadRestState();
      if (storedRestState?.sessionId === sessionId) {
        resumeRestTimer(storedRestState.endsAt);
      }
    };

    void loadRestStateForSession();
  }, [sessionId]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      const previous = appStateRef.current;
      appStateRef.current = nextState;

      if (previous.match(/inactive|background/) && nextState === 'active') {
        const refreshRestState = async () => {
          if (!sessionId) {
            return;
          }
          const storedRestState = await loadRestState();
          if (storedRestState?.sessionId === sessionId) {
            resumeRestTimer(storedRestState.endsAt);
          }
        };
        void refreshRestState();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    return () => {
      if (restIntervalRef.current) {
        clearInterval(restIntervalRef.current);
      }
    };
  }, []);

  return {
    isResting,
    restSecondsRemaining,
    startRestTimer,
    stopRestTimer,
  };
}
