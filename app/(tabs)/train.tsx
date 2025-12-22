import { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, AppState, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';

import { SessionStatus } from '@/data/models';
import type { Session, SessionBlock, SessionExercise, SessionSet, WorkoutPlan } from '@/data/models';
import { startSession } from '@/data/session';
import {
  clearRestState,
  loadActiveSession,
  loadRestState,
  loadWorkoutPlans,
  saveLastCompletedSessionId,
  saveRestState,
  saveSession,
} from '@/data/storage';

type SessionPosition = {
  blockIndex: number;
  exerciseIndex: number;
  setIndex: number;
};

function isSetResolved(set: SessionSet): boolean {
  return set.completed || Boolean(set.completedAt);
}

function findNextIncompleteSet(session: Session): SessionPosition | null {
  for (let blockIndex = 0; blockIndex < session.blocks.length; blockIndex += 1) {
    const block = session.blocks[blockIndex];
    for (let exerciseIndex = 0; exerciseIndex < block.exercises.length; exerciseIndex += 1) {
      const exercise = block.exercises[exerciseIndex];
      for (let setIndex = 0; setIndex < exercise.sets.length; setIndex += 1) {
        const set = exercise.sets[setIndex];
        if (!isSetResolved(set)) {
          return { blockIndex, exerciseIndex, setIndex };
        }
      }
    }
  }
  return null;
}

function isSessionComplete(session: Session): boolean {
  return findNextIncompleteSet(session) === null;
}

function updateSessionSet(
  session: Session,
  position: SessionPosition,
  updater: (set: SessionSet) => SessionSet
): Session {
  const blocks = session.blocks.map((block, blockIndex) => {
    if (blockIndex !== position.blockIndex) {
      return block;
    }
    const exercises = block.exercises.map((exercise, exerciseIndex) => {
      if (exerciseIndex !== position.exerciseIndex) {
        return exercise;
      }
      const sets = exercise.sets.map((set, setIndex) => {
        if (setIndex !== position.setIndex) {
          return set;
        }
        return updater(set);
      });
      return { ...exercise, sets };
    });
    return { ...block, exercises };
  });

  return { ...session, blocks };
}

function getSessionBlock(session: Session, position: SessionPosition): SessionBlock {
  return session.blocks[position.blockIndex];
}

function getSessionExercise(session: Session, position: SessionPosition): SessionExercise {
  return getSessionBlock(session, position).exercises[position.exerciseIndex];
}

export default function TrainScreen() {
  const router = useRouter();
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

  const currentExerciseInfo = useMemo(() => {
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

  const handleStartSession = async (plan: WorkoutPlan, dayId: string) => {
    const day = plan.days.find((item) => item.id === dayId);
    if (!day) {
      return;
    }

    const session = await startSession(plan, day);
    setActiveSession(session);

    // eslint-disable-next-line no-console
    console.log('session started', session);
  };

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
      router.push('/session-summary');
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

  const handleEndSession = () => {
    if (!activeSession) {
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
          const endedAt = new Date().toISOString();
          const nextSession: Session = {
            ...activeSession,
            status: SessionStatus.Abandoned,
            endedAt,
          };
          await saveSession(nextSession);
          await stopRestTimer();
          setActiveSession(null);
        },
      },
      {
        text: 'Complete',
        onPress: async () => {
          const endedAt = new Date().toISOString();
          const nextSession: Session = {
            ...activeSession,
            status: SessionStatus.Completed,
            endedAt,
          };
          await saveSession(nextSession);
          await saveLastCompletedSessionId(nextSession.id);
          await stopRestTimer();
          setActiveSession(null);
          router.push('/session-summary');
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text>Train</Text>
      {activeSession && activeSession.status === SessionStatus.Active ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active Session</Text>
          {currentExerciseInfo ? (
            <>
              {isResting ? (
                <View style={styles.restContainer}>
                  <Text style={styles.statusText}>Rest: {restSecondsRemaining}s</Text>
                  <Button title="Skip Rest" onPress={() => void stopRestTimer()} />
                </View>
              ) : (
                <>
                  <Text style={styles.statusText}>{currentExerciseInfo.name}</Text>
                  <Text style={styles.statusText}>
                    Set {activePosition ? activePosition.setIndex + 1 : 0} of{' '}
                    {currentExerciseInfo.totalSets}
                  </Text>
                  <Text style={styles.statusText}>Target: {currentExerciseInfo.target}</Text>
                  <View style={styles.inputRow}>
                    <TextInput
                      placeholder={currentExerciseInfo.usesTime ? 'Actual seconds' : 'Actual reps'}
                      value={currentExerciseInfo.usesTime ? actualTimeInput : actualRepsInput}
                      onChangeText={
                        currentExerciseInfo.usesTime ? setActualTimeInput : setActualRepsInput
                      }
                      keyboardType="number-pad"
                      style={styles.input}
                    />
                  </View>
                  <View style={styles.buttonRow}>
                    <Button title="Complete Set" onPress={() => handleSetAction(true)} />
                    <Button title="Skip Set" onPress={() => handleSetAction(false)} />
                  </View>
                </>
              )}
              <View style={styles.endSessionRow}>
                <Button title="End Session" onPress={handleEndSession} />
              </View>
            </>
          ) : (
            <Text style={styles.statusText}>Unable to load active session details.</Text>
          )}
        </View>
      ) : (
        <>
          <Text style={styles.statusText}>No active session</Text>
          {plans.length === 0 ? (
            <Text style={styles.statusText}>No plans available</Text>
          ) : (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Plans</Text>
              {plans.map((plan) => (
                <View key={plan.id} style={styles.row}>
                  <Text style={styles.rowText}>{plan.name}</Text>
                  <Button title="Select" onPress={() => setSelectedPlanId(plan.id)} />
                </View>
              ))}
            </View>
          )}
          {selectedPlan ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{selectedPlan.name} Days</Text>
              {selectedPlan.days.map((day) => (
                <View key={day.id} style={styles.row}>
                  <Text style={styles.rowText}>{day.name}</Text>
                  <Button
                    title="Start Session"
                    onPress={() => handleStartSession(selectedPlan, day.id)}
                  />
                </View>
              ))}
            </View>
          ) : null}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    gap: 16,
  },
  statusText: {
    textAlign: 'center',
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  rowText: {
    flex: 1,
  },
  inputRow: {
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  restContainer: {
    alignItems: 'center',
    gap: 12,
  },
  endSessionRow: {
    marginTop: 12,
  },
});
