import { useEffect, useRef } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';

import { SessionStatus } from '@/data/models';
import { RowText, SectionTitle, StatusText } from '@/components/ui/text';
import { useTrainSession } from '@/hooks/use-train-session';

export default function TrainScreen() {
  const router = useRouter();
  const inputRef = useRef<TextInput>(null);
  const {
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
    skipRest,
    endSession,
  } = useTrainSession({
    onSessionCompleted: () => {
      router.push('/session-summary');
    },
  });

  useEffect(() => {
    if (activeSession && activeSession.status === SessionStatus.Active && !isResting) {
      inputRef.current?.focus();
    }
  }, [activeSession, isResting]);

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
          await endSession(SessionStatus.Abandoned);
        },
      },
      {
        text: 'Complete',
        onPress: async () => {
          await endSession(SessionStatus.Completed);
        },
      },
    ]);
  };

  const renderActionButton = (
    label: string,
    onPress: () => void | Promise<void>,
    variant: 'primary' | 'secondary' | 'destructive'
  ) => {
    const variantStyle =
      variant === 'primary'
        ? styles.buttonPrimary
        : variant === 'secondary'
          ? styles.buttonSecondary
          : styles.buttonDestructive;
    const variantTextStyle =
      variant === 'primary'
        ? styles.buttonTextPrimary
        : variant === 'secondary'
          ? styles.buttonTextSecondary
          : styles.buttonTextDestructive;
    return (
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        style={({ pressed }) => [
          styles.buttonBase,
          variantStyle,
          pressed && styles.buttonPressed,
        ]}>
        <Text style={[styles.buttonText, variantTextStyle]}>{label}</Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <Text>Train</Text>
      {activeSession && activeSession.status === SessionStatus.Active ? (
        <View style={styles.section}>
          <SectionTitle>Active Session</SectionTitle>
          {currentExerciseInfo ? (
            <>
              {isResting ? (
                <View style={styles.restContainer}>
                  <StatusText>Rest: {restSecondsRemaining}s</StatusText>
                  {renderActionButton('Skip Rest', () => void skipRest(), 'secondary')}
                </View>
              ) : (
                <>
                  <StatusText>{currentExerciseInfo.name}</StatusText>
                  <StatusText>
                    Set {activePosition ? activePosition.setIndex + 1 : 0} of{' '}
                    {currentExerciseInfo.totalSets}
                  </StatusText>
                  <StatusText>Target: {currentExerciseInfo.target}</StatusText>
                  <View style={styles.inputRow}>
                    <TextInput
                      ref={inputRef}
                      placeholder={currentExerciseInfo.usesTime ? 'Actual seconds' : 'Actual reps'}
                      value={currentExerciseInfo.usesTime ? actualTimeInput : actualRepsInput}
                      onChangeText={
                        currentExerciseInfo.usesTime ? setActualTimeInput : setActualRepsInput
                      }
                      keyboardType="number-pad"
                      style={styles.input}
                    />
                  </View>
                  <View style={styles.buttonStack}>
                    {renderActionButton('Complete Set', () => void completeSet(), 'primary')}
                    {renderActionButton('Skip Set', () => void skipSet(), 'secondary')}
                  </View>
                </>
              )}
              <View style={styles.endSessionRow}>
                {renderActionButton('End Session', handleEndSession, 'destructive')}
              </View>
            </>
          ) : (
            <StatusText>Unable to load active session details.</StatusText>
          )}
        </View>
      ) : (
        <>
          <StatusText>No active session</StatusText>
          {plans.length === 0 ? (
            <StatusText>No plans available</StatusText>
          ) : (
            <View style={styles.section}>
              <SectionTitle>Plans</SectionTitle>
              {plans.map((plan) => (
                <View key={plan.id} style={styles.itemCard}>
                  <RowText>{plan.name}</RowText>
                  {renderActionButton('Select', () => setSelectedPlanId(plan.id), 'secondary')}
                </View>
              ))}
            </View>
          )}
          {selectedPlan ? (
            <View style={styles.section}>
              <SectionTitle>{selectedPlan.name} Days</SectionTitle>
              {selectedPlan.days.map((day) => (
                <View key={day.id} style={styles.itemCard}>
                  <RowText>{day.name}</RowText>
                  {renderActionButton(
                    'Start Session',
                    () => void startSessionForDay(selectedPlan.id, day.id),
                    'primary'
                  )}
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
  section: {
    gap: 12,
  },
  itemCard: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    padding: 12,
    gap: 12,
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
  buttonStack: {
    gap: 12,
  },
  restContainer: {
    alignItems: 'center',
    gap: 12,
  },
  endSessionRow: {
    marginTop: 12,
  },
  buttonBase: {
    minHeight: 48,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonPrimary: {
    backgroundColor: '#111827',
  },
  buttonSecondary: {
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  buttonDestructive: {
    backgroundColor: '#dc2626',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextPrimary: {
    color: '#ffffff',
  },
  buttonTextSecondary: {
    color: '#111827',
  },
  buttonTextDestructive: {
    color: '#ffffff',
  },
});
