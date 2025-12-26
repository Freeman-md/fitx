import type { RefObject } from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { PageTitle, PrimaryText, SecondaryText, SectionTitle } from '@/components/ui/text';
import { Spacing } from '@/components/ui/spacing';
import type { CurrentExerciseInfo } from '@/features/session/utils/session-info';

type TrainActiveSessionViewProps = {
  inputRef: RefObject<TextInput | null>;
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
  inputPlaceholderColor: string;
  inputBorderColor?: string;
  inputBackgroundColor?: string;
  inputTextColor?: string;
};

export function TrainActiveSessionView({
  inputRef,
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
  inputPlaceholderColor,
  inputBorderColor,
  inputBackgroundColor,
  inputTextColor,
}: TrainActiveSessionViewProps) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        alwaysBounceVertical={false}>
        <PageTitle>Train</PageTitle>
        <View style={styles.section}>
          <SectionTitle>Active Session</SectionTitle>
          {currentExerciseInfo ? (
            <>
              {isResting ? (
                <View style={styles.restContainer}>
                  <PrimaryText>Rest: {restSecondsRemaining}s</PrimaryText>
                  <Button label="Skip Rest" onPress={onSkipRest} variant="secondary" />
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
                      placeholder={
                        currentExerciseInfo.usesTime ? 'Actual seconds' : 'Actual reps'
                      }
                      placeholderTextColor={inputPlaceholderColor}
                      value={currentExerciseInfo.usesTime ? actualTimeInput : actualRepsInput}
                      onChangeText={
                        currentExerciseInfo.usesTime ? onChangeActualTime : onChangeActualReps
                      }
                      keyboardType="number-pad"
                      style={[
                        styles.input,
                        inputBorderColor ? { borderColor: inputBorderColor } : null,
                        inputBackgroundColor ? { backgroundColor: inputBackgroundColor } : null,
                        inputTextColor ? { color: inputTextColor } : null,
                      ]}
                    />
                  </View>
                  <View style={styles.buttonStack}>
                    <Button label="Complete Set" onPress={onCompleteSet} variant="primary" />
                    <Button label="Skip Set" onPress={onSkipSet} variant="secondary" />
                  </View>
                </>
              )}
              <View style={styles.endSessionRow}>
                <Button label="End Session" onPress={onEndSession} variant="destructive" />
              </View>
            </>
          ) : (
            <SecondaryText style={styles.centeredText}>
              Unable to load active session details.
            </SecondaryText>
          )}
        </View>
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
  centeredText: {
    textAlign: 'center',
  },
});
