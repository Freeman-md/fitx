import { useEffect, useRef } from 'react';
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

  useEffect(() => {
    if (hasActiveSession && !sessionState.isResting) {
      inputRef.current?.focus();
    }
  }, [hasActiveSession, sessionState.isResting]);

  const handleStartSessionForDay = (dayId: string) => {
    const check = canStartSessionFromPlan(sessionState.selectedPlan, dayId);
    if (!check.ok) {
      Alert.alert('Cannot start session', check.reason);
      return;
    }
    if (!sessionState.selectedPlan) {
      return;
    }
    void sessionState.startSessionForDay(sessionState.selectedPlan.id, dayId);
  };

  const handleEndSessionPrompt = () => {
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
    startSessionForDay: handleStartSessionForDay,
    endSessionPrompt: handleEndSessionPrompt,
    hasActiveSession,
  };
}
