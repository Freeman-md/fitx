import type { RefObject } from 'react';
import type { TextInput } from 'react-native';

import type { WorkoutPlan } from '@/data/models';
import type { CurrentExerciseInfo } from '@/features/session/utils/session-info';
import type { TrainColors } from '@/features/session/utils/train-theme';
import { TrainActiveSessionView } from '@/features/session/components/TrainActiveSessionView';
import { TrainHomeView } from '@/features/session/components/TrainHomeView';

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
  selectedDayId: string | null;
  onSelectPlan: (planId: string) => void;
  onSelectDay: (dayId: string) => void;
  onStartSession: () => void;
  onCreatePlan: () => void;
  onAddDays: () => void;
  startDisabledReason: string | null;
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
  selectedDayId,
  onSelectPlan,
  onSelectDay,
  onStartSession,
  onCreatePlan,
  onAddDays,
  startDisabledReason,
}: TrainScreenViewProps) {
  if (hasActiveSession) {
    return (
      <TrainActiveSessionView
        inputRef={inputRef}
        currentExerciseInfo={currentExerciseInfo}
        setNumber={setNumber}
        actualRepsInput={actualRepsInput}
        actualTimeInput={actualTimeInput}
        onChangeActualReps={onChangeActualReps}
        onChangeActualTime={onChangeActualTime}
        isResting={isResting}
        restSecondsRemaining={restSecondsRemaining}
        onCompleteSet={onCompleteSet}
        onSkipSet={onSkipSet}
        onSkipRest={onSkipRest}
        onEndSession={onEndSession}
        inputPlaceholderColor={colors.inputPlaceholder ?? '#9ca3af'}
        inputBorderColor={colors.inputBorder}
        inputBackgroundColor={colors.inputBackground}
        inputTextColor={colors.inputText}
      />
    );
  }

  return (
    <TrainHomeView
      plans={plans}
      selectedPlan={selectedPlan}
      selectedDayId={selectedDayId}
      onSelectPlan={onSelectPlan}
      onSelectDay={onSelectDay}
      onStartSession={onStartSession}
      onCreatePlan={onCreatePlan}
      onAddDays={onAddDays}
      startDisabledReason={startDisabledReason}
    />
  );
}
