import type { RefObject } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { FullScreenFocus } from '@/components/ui/focus-layout';
import { PageTitle, PrimaryText, SecondaryText } from '@/components/ui/text';
import { Spacing } from '@/components/ui/spacing';
import type { CurrentExerciseInfo } from '@/features/session/utils/session-info';
import { RestView } from '@/features/session/components/RestView';

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
  if (isResting) {
    return (
      <RestView secondsRemaining={restSecondsRemaining} onSkipRest={onSkipRest} />
    );
  }

  if (!currentExerciseInfo) {
    return (
      <FullScreenFocus>
        <SecondaryText style={styles.centeredText}>
          Unable to load active session details.
        </SecondaryText>
      </FullScreenFocus>
    );
  }

  return (
    <FullScreenFocus>
      <PageTitle style={styles.exerciseName}>{currentExerciseInfo.name}</PageTitle>
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
      <Button
        label="End Session"
        onPress={onEndSession}
        variant="destructive"
        size="compact"
      />
    </FullScreenFocus>
  );
}

const styles = StyleSheet.create({
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
    fontSize: 32,
    textAlign: 'center',
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
});
