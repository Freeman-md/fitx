import { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, TextInput } from 'react-native';

import { SessionStatus } from '@/data/models';
import { useTrainSession } from '@/features/session/hooks/use-train-session';
import { useTrainTheme } from '@/features/session/hooks/use-train-theme';
import { getSetNumber } from '@/features/session/utils/session-view';
import { isActiveSession } from '@/features/session/utils/session-selectors';
import { canStartSessionFromPlan } from '@/features/session/utils/session-validation';

export type UseTrainScreenOptions = Parameters<typeof useTrainSession>[0];

export function useTrainScreen(options: UseTrainScreenOptions = {}) {
  const sessionState = useTrainSession(options);
  const theme = useTrainTheme();
  const inputRef = useRef<TextInput>(null);

  const hasActiveSession = isActiveSession(sessionState.activeSession);
  const [selectedDayId, setSelectedDayId] = useState<string | null>(null);

  const selectedDay = useMemo(() => {
    if (!sessionState.selectedPlan || !selectedDayId) {
      return null;
    }
    return sessionState.selectedPlan.days.find((day) => day.id === selectedDayId) ?? null;
  }, [sessionState.selectedPlan, selectedDayId]);

  useEffect(() => {
    if (hasActiveSession && !sessionState.isResting) {
      inputRef.current?.focus();
    }
  }, [hasActiveSession, sessionState.isResting]);

  useEffect(() => {
    if (!sessionState.selectedPlan) {
      setSelectedDayId(null);
      return;
    }
    const stillValid = sessionState.selectedPlan.days.some((day) => day.id === selectedDayId);
    if (!stillValid) {
      setSelectedDayId(null);
    }
  }, [sessionState.selectedPlan, selectedDayId]);

  const startSessionIfValid = () => {
    if (!sessionState.selectedPlan || !selectedDay) {
      return;
    }
    const check = canStartSessionFromPlan(sessionState.selectedPlan, selectedDay.id);
    if (!check.ok) {
      Alert.alert('Cannot start session', check.reason);
      return;
    }
    void sessionState.startSessionForDay(sessionState.selectedPlan.id, selectedDay.id);
  };

  const confirmEndSession = () => {
    if (!sessionState.activeSession) {
      return;
    }

    Alert.alert('End Session', 'Do you want to complete or abandon this session?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Abandon',
        style: 'destructive',
        onPress: async () => {
          await sessionState.endSession(SessionStatus.Abandoned);
        },
      },
      {
        text: 'Complete',
        onPress: async () => {
          await sessionState.endSession(SessionStatus.Completed);
        },
      },
    ]);
  };

  return {
    ...sessionState,
    theme,
    inputRef,
    setNumber: getSetNumber(sessionState.activePosition),
    selectedDayId,
    setSelectedDayId,
    selectedDay,
    startSessionForDay: startSessionIfValid,
    endSessionPrompt: confirmEndSession,
    hasActiveSession,
    refreshSessionState: sessionState.refreshSessionState,
  };
}
