import { useEffect, useMemo, useRef, useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';

import { SessionStatus } from '@/data/models';
import type { Session, SessionBlock, SessionExercise, SessionSet, WorkoutPlan } from '@/data/models';
import { startSession } from '@/data/session';
import { loadActiveSession, loadWorkoutPlans, saveSession } from '@/data/storage';

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
  const [plans, setPlans] = useState<WorkoutPlan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const [actualRepsInput, setActualRepsInput] = useState('');
  const [actualTimeInput, setActualTimeInput] = useState('');
  const [isResting, setIsResting] = useState(false);
  const [restSecondsRemaining, setRestSecondsRemaining] = useState(0);
  const restIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

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

  const stopRestTimer = () => {
    if (restIntervalRef.current) {
      clearInterval(restIntervalRef.current);
      restIntervalRef.current = null;
    }
    setIsResting(false);
    setRestSecondsRemaining(0);
  };

  const startRestTimer = (seconds: number) => {
    if (!seconds || seconds <= 0) {
      return;
    }

    stopRestTimer();
    setIsResting(true);
    setRestSecondsRemaining(seconds);

    restIntervalRef.current = setInterval(() => {
      setRestSecondsRemaining((previous) => {
        if (previous <= 1) {
          stopRestTimer();
          return 0;
        }
        return previous - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (restIntervalRef.current) {
        clearInterval(restIntervalRef.current);
      }
    };
  }, []);

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
    setActiveSession(nextSession.status === SessionStatus.Active ? nextSession : null);
    setActualRepsInput('');
    setActualTimeInput('');

    // eslint-disable-next-line no-console
    console.log('session progress saved', nextSession);

    if (nextSession.status === SessionStatus.Active) {
      const restSeconds = currentExerciseInfo?.restSeconds ?? 0;
      startRestTimer(restSeconds);
    }
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
                  <Button title="Skip Rest" onPress={stopRestTimer} />
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
});
