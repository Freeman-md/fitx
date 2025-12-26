import type { RefObject } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { WorkoutPlan } from '@/data/models';
import { RowText, SectionTitle, StatusText } from '@/components/ui/text';
import type { CurrentExerciseInfo } from '@/features/session/utils/session-info';
import type { TrainColors } from '@/features/session/utils/train-theme';
import { ActionButton } from '@/features/session/components/ActionButton';

type TrainScreenViewProps = {
  colors: TrainColors;
  isDark: boolean;
  inputRef: RefObject<TextInput | null>;
  hasActiveSession: boolean;
  currentExerciseInfo: CurrentExerciseInfo | null;
  setNumber: number;
  actualRepsInput: string;
  actualTimeInput: string;
  onChangeActualReps: (value: string) => void;
  onChangeActualTime: (value: string) => void;
  isResting: boolean;
  restSecondsRemaining: number;
  onCompleteSet: () => void;
  onSkipSet: () => void;
  onSkipRest: () => void;
  onEndSession: () => void;
  plans: WorkoutPlan[];
  selectedPlan: WorkoutPlan | null;
  onSelectPlan: (planId: string) => void;
  onStartSession: (dayId: string) => void;
};

export function TrainScreenView({
  colors,
  isDark,
  inputRef,
  hasActiveSession,
  currentExerciseInfo,
  setNumber,
  actualRepsInput,
  actualTimeInput,
  onChangeActualReps,
  onChangeActualTime,
  isResting,
  restSecondsRemaining,
  onCompleteSet,
  onSkipSet,
  onSkipRest,
  onEndSession,
  plans,
  selectedPlan,
  onSelectPlan,
  onStartSession,
}: TrainScreenViewProps) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        alwaysBounceVertical={false}>
        <Text style={[styles.pageTitle, isDark ? styles.pageTitleDark : null]}>Train</Text>
        {hasActiveSession ? (
          <View style={styles.section}>
            <SectionTitle>Active Session</SectionTitle>
            {currentExerciseInfo ? (
              <>
                {isResting ? (
                  <View style={styles.restContainer}>
                    <StatusText>Rest: {restSecondsRemaining}s</StatusText>
                    <ActionButton
                      label="Skip Rest"
                      onPress={onSkipRest}
                      variant="secondary"
                      colors={colors}
                    />
                  </View>
                ) : (
                  <>
                    <StatusText>{currentExerciseInfo.name}</StatusText>
                    <StatusText>
                      Set {setNumber} of {currentExerciseInfo.totalSets}
                    </StatusText>
                    <StatusText>Target: {currentExerciseInfo.target}</StatusText>
                    <View style={styles.inputRow}>
                      <TextInput
                        ref={inputRef}
                        placeholder={currentExerciseInfo.usesTime ? 'Actual seconds' : 'Actual reps'}
                        placeholderTextColor={colors.inputPlaceholder}
                        value={currentExerciseInfo.usesTime ? actualTimeInput : actualRepsInput}
                        onChangeText={
                          currentExerciseInfo.usesTime ? onChangeActualTime : onChangeActualReps
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
                      <ActionButton
                        label="Complete Set"
                        onPress={onCompleteSet}
                        variant="primary"
                        colors={colors}
                      />
                      <ActionButton
                        label="Skip Set"
                        onPress={onSkipSet}
                        variant="secondary"
                        colors={colors}
                      />
                    </View>
                  </>
                )}
                <View style={styles.endSessionRow}>
                  <ActionButton
                    label="End Session"
                    onPress={onEndSession}
                    variant="destructive"
                    colors={colors}
                  />
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
                    style={[styles.itemCard, isDark ? { borderColor: colors.border } : null]}>
                    <RowText>{plan.name}</RowText>
                    <ActionButton
                      label="Select"
                      onPress={() => onSelectPlan(plan.id)}
                      variant="secondary"
                      colors={colors}
                    />
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
                      style={[styles.itemCard, isDark ? { borderColor: colors.border } : null]}>
                      <RowText>{day.name}</RowText>
                      <ActionButton
                        label="Start Session"
                        onPress={() => onStartSession(day.id)}
                        variant="primary"
                        colors={colors}
                      />
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
});
