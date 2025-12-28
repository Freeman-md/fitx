import type { RefObject } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { PrimaryText, SecondaryText } from '@/components/ui/text';
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
  inputPlaceholderColor,
  inputBorderColor,
  inputBackgroundColor,
  inputTextColor,
}: TrainActiveSessionViewProps) {
  if (isResting) {
    return (
      <View style={styles.content}>
        <PrimaryText style={styles.restCountdown}>{restSecondsRemaining}</PrimaryText>
        <SecondaryText style={styles.restLabel}>Rest</SecondaryText>
        <Button label="Skip Rest" onPress={onSkipRest} variant="secondary" size="compact" />
      </View>
    );
  }

  if (!currentExerciseInfo) {
    return (
      <View style={styles.content}>
        <SecondaryText style={styles.centeredText}>
          Unable to load active session details.
        </SecondaryText>
      </View>
    );
  }

  return (
    <View style={styles.content}>
      <PrimaryText style={styles.exerciseName}>{currentExerciseInfo.name}</PrimaryText>
      <PrimaryText style={styles.setCount}>
        Set {setNumber} of {currentExerciseInfo.totalSets}
      </PrimaryText>
      <SecondaryText style={styles.targetText}>Target: {currentExerciseInfo.target}</SecondaryText>
      <View style={styles.inputRow}>
        <TextInput
          ref={inputRef}
          placeholder={currentExerciseInfo.usesTime ? 'Actual seconds' : 'Actual reps'}
          placeholderTextColor={inputPlaceholderColor}
          value={currentExerciseInfo.usesTime ? actualTimeInput : actualRepsInput}
          onChangeText={currentExerciseInfo.usesTime ? onChangeActualTime : onChangeActualReps}
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
        <Button
          label="Complete Set"
          onPress={onCompleteSet}
          variant="primary"
          style={styles.fullWidth}
        />
        <Button
          label="Skip Set"
          onPress={onSkipSet}
          variant="secondary"
          style={styles.fullWidth}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
  },
  inputRow: {
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: 22,
    textAlign: 'center',
  },
  buttonStack: {
    gap: Spacing.md,
    width: '100%',
  },
  centeredText: {
    textAlign: 'center',
  },
  exerciseName: {
    fontSize: 22,
    textAlign: 'center',
    fontWeight: '600',
  },
  setCount: {
    fontSize: 24,
    textAlign: 'center',
  },
  targetText: {
    textAlign: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  restCountdown: {
    fontSize: 40,
    textAlign: 'center',
  },
  restLabel: {
    fontSize: 14,
    textAlign: 'center',
  },
});
