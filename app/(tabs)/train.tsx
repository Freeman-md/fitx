import { useEffect, useRef } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { SessionStatus } from '@/data/models';
import { RowText, SectionTitle, StatusText } from '@/components/ui/text';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useTrainSession } from '@/hooks/use-train-session';

export default function TrainScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
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

  const colors =
    colorScheme === 'dark'
      ? {
          border: '#374151',
          inputBorder: '#4b5563',
          inputBackground: '#111827',
          inputText: '#f9fafb',
          inputPlaceholder: '#9ca3af',
          buttonPrimaryBg: '#f3f4f6',
          buttonPrimaryText: '#111827',
          buttonSecondaryBg: '#1f2937',
          buttonSecondaryBorder: '#374151',
          buttonSecondaryText: '#e5e7eb',
          buttonDestructiveBg: '#b91c1c',
          buttonDestructiveText: '#ffffff',
        }
      : {
          border: '#e5e7eb',
          inputBorder: '#ccc',
          inputBackground: undefined,
          inputText: undefined,
          inputPlaceholder: undefined,
          buttonPrimaryBg: '#111827',
          buttonPrimaryText: '#ffffff',
          buttonSecondaryBg: '#f3f4f6',
          buttonSecondaryBorder: '#d1d5db',
          buttonSecondaryText: '#111827',
          buttonDestructiveBg: '#dc2626',
          buttonDestructiveText: '#ffffff',
        };

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

  const canStartSession = (dayId: string) => {
    if (!selectedPlan) {
      return { ok: false, reason: 'No plan selected.' };
    }
    const day = selectedPlan.days.find((item) => item.id === dayId);
    if (!day) {
      return { ok: false, reason: 'Selected day not found.' };
    }
    if (day.blocks.length === 0) {
      return { ok: false, reason: 'Add at least one block before starting a session.' };
    }
    const emptyBlock = day.blocks.find((block) => block.exercises.length === 0);
    if (emptyBlock) {
      return { ok: false, reason: 'Each block must have at least one exercise.' };
    }
    const invalidExercise = day.blocks.flatMap((block) => block.exercises).find((exercise) => {
      return !exercise.repsMin && !exercise.repsMax && !exercise.timeSeconds;
    });
    if (invalidExercise) {
      return { ok: false, reason: 'Each exercise needs reps or time to start a session.' };
    }
    return { ok: true };
  };

  const renderActionButton = (
    label: string,
    onPress: () => void | Promise<void>,
    variant: 'primary' | 'secondary' | 'destructive'
  ) => {
    const variantStyle =
      variant === 'primary'
        ? { backgroundColor: colors.buttonPrimaryBg }
        : variant === 'secondary'
          ? {
              backgroundColor: colors.buttonSecondaryBg,
              borderWidth: 1,
              borderColor: colors.buttonSecondaryBorder,
            }
          : { backgroundColor: colors.buttonDestructiveBg };
    const variantTextStyle =
      variant === 'primary'
        ? { color: colors.buttonPrimaryText }
        : variant === 'secondary'
          ? { color: colors.buttonSecondaryText }
          : { color: colors.buttonDestructiveText };
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
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        alwaysBounceVertical={false}>
      <Text style={[styles.pageTitle, colorScheme === 'dark' ? styles.pageTitleDark : null]}>
        Train
      </Text>
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
                      placeholderTextColor={colors.inputPlaceholder}
                      value={currentExerciseInfo.usesTime ? actualTimeInput : actualRepsInput}
                      onChangeText={
                        currentExerciseInfo.usesTime ? setActualTimeInput : setActualRepsInput
                      }
                      keyboardType="number-pad"
                      style={[
                        styles.input,
                        colors.inputBorder ? { borderColor: colors.inputBorder } : null,
                        colors.inputBackground ? { backgroundColor: colors.inputBackground } : null,
                        colors.inputText ? { color: colors.inputText } : null,
                      ]}
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
                <View
                  key={plan.id}
                  style={[
                    styles.itemCard,
                    colorScheme === 'dark' ? { borderColor: colors.border } : null,
                  ]}>
                  <RowText>{plan.name}</RowText>
                  {renderActionButton('Select', () => setSelectedPlanId(plan.id), 'secondary')}
                </View>
              ))}
            </View>
          )}
          {selectedPlan ? (
            <View style={styles.section}>
              <SectionTitle>{selectedPlan.name} Days</SectionTitle>
              {selectedPlan.days.length === 0 ? (
                <StatusText>Add at least one day to start a session.</StatusText>
              ) : (
                selectedPlan.days.map((day) => (
                  <View
                    key={day.id}
                    style={[
                      styles.itemCard,
                      colorScheme === 'dark' ? { borderColor: colors.border } : null,
                    ]}>
                    <RowText>{day.name}</RowText>
                    {renderActionButton(
                      'Start Session',
                      () => {
                        const check = canStartSession(day.id);
                        if (!check.ok) {
                          Alert.alert('Cannot start session', check.reason);
                          return;
                        }
                        void startSessionForDay(selectedPlan.id, day.id);
                      },
                      'primary'
                    )}
                  </View>
                ))
              )}
            </View>
          ) : null}
        </>
      )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
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
  pageTitle: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    opacity: 0.7,
  },
  pageTitleDark: {
    color: '#ECEDEE',
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
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
