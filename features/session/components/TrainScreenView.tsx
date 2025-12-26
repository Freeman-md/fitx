import type { RefObject } from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { WorkoutPlan } from '@/data/models';
import { PageTitle, PrimaryText, SecondaryText, SectionTitle } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Spacing } from '@/components/ui/spacing';
import type { CurrentExerciseInfo } from '@/features/session/utils/session-info';
import type { TrainColors } from '@/features/session/utils/train-theme';

type TrainScreenViewProps = {
  colors: TrainColors;
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
        <PageTitle>Train</PageTitle>
        {hasActiveSession ? (
          <View style={styles.section}>
            <SectionTitle>Active Session</SectionTitle>
            {currentExerciseInfo ? (
              <>
                {isResting ? (
                  <View style={styles.restContainer}>
                    <PrimaryText>Rest: {restSecondsRemaining}s</PrimaryText>
                    <Button
                      label="Skip Rest"
                      onPress={onSkipRest}
                      variant="secondary"
                    />
                  </View>
                ) : (
                  <>
                    <PrimaryText>{currentExerciseInfo.name}</PrimaryText>
                    <SecondaryText>
                      Set {setNumber} of {currentExerciseInfo.totalSets}
                    </SecondaryText>
                    <SecondaryText>Target: {currentExerciseInfo.target}</SecondaryText>
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
                      <Button
                        label="Complete Set"
                        onPress={onCompleteSet}
                        variant="primary"
                      />
                      <Button
                        label="Skip Set"
                        onPress={onSkipSet}
                        variant="secondary"
                      />
                    </View>
                  </>
                )}
                <View style={styles.endSessionRow}>
                  <Button
                    label="End Session"
                    onPress={onEndSession}
                    variant="destructive"
                  />
                </View>
              </>
            ) : (
              <SecondaryText style={styles.centeredText}>
                Unable to load active session details.
              </SecondaryText>
            )}
          </View>
        ) : (
          <>
            <SecondaryText style={styles.centeredText}>No active session</SecondaryText>
            {plans.length === 0 ? (
              <SecondaryText style={styles.centeredText}>No plans available</SecondaryText>
            ) : (
              <View style={styles.section}>
                <SectionTitle>Plans</SectionTitle>
                {plans.map((plan) => (
                  <Card key={plan.id} style={styles.itemCard}>
                    <PrimaryText>{plan.name}</PrimaryText>
                    <Button
                      label="Select"
                      onPress={() => onSelectPlan(plan.id)}
                      variant="secondary"
                      size="compact"
                    />
                  </Card>
                ))}
              </View>
            )}
            {selectedPlan ? (
              <View style={styles.section}>
                <SectionTitle>{selectedPlan.name} Days</SectionTitle>
                {selectedPlan.days.length === 0 ? (
                  <SecondaryText style={styles.centeredText}>
                    Add at least one day to start a session.
                  </SecondaryText>
                ) : (
                  selectedPlan.days.map((day) => (
                    <Card key={day.id} style={styles.itemCard}>
                      <PrimaryText>{day.name}</PrimaryText>
                      <Button
                        label="Start Session"
                        onPress={() => onStartSession(day.id)}
                        variant="primary"
                        size="compact"
                      />
                    </Card>
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
    padding: Spacing.md,
    gap: Spacing.md,
  },
  section: {
    gap: Spacing.sm,
  },
  inputRow: {
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  buttonStack: {
    gap: Spacing.sm,
  },
  restContainer: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  endSessionRow: {
    marginTop: Spacing.sm,
  },
  itemCard: {
    width: '100%',
  },
  centeredText: {
    textAlign: 'center',
  },
});
