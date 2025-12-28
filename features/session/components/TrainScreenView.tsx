import { useEffect, useState, type RefObject } from 'react';
import type { TextInput } from 'react-native';

import type { Session, WorkoutDay, WorkoutPlan } from '@/data/models';
import type { CurrentExerciseInfo } from '@/features/session/utils/session-info';
import type { TrainColors } from '@/features/session/utils/train-theme';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { TrainActiveSessionView } from '@/features/session/components/TrainActiveSessionView';
import { TrainActiveSessionContextView } from '@/features/session/components/TrainActiveSessionContextView';
import { TrainHomeView } from '@/features/session/components/TrainHomeView';
import type { SessionPosition } from '@/data/session-runner';

type TrainScreenViewProps = {
  colors: TrainColors;
  inputRef: RefObject<TextInput | null>;
  hasActiveSession: boolean;
  activeSession: Session | null;
  activePlan: WorkoutPlan | null;
  activeDay: WorkoutDay | null;
  activePosition: SessionPosition | null;
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
  onViewPlans: () => void;
  startDisabledReason: string | null;
  onRefresh: () => void;
};

export function TrainScreenView({
  colors,
  inputRef,
  hasActiveSession,
  activeSession,
  activePlan,
  activeDay,
  activePosition,
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
  onViewPlans,
  startDisabledReason,
  onRefresh,
}: TrainScreenViewProps) {
  const [isSessionSheetOpen, setIsSessionSheetOpen] = useState(false);

  useEffect(() => {
    if (hasActiveSession) {
      setIsSessionSheetOpen(true);
    }
  }, [hasActiveSession, activeSession?.id]);

  if (hasActiveSession) {
    const currentBlockId =
      activeSession && activePosition
        ? activeSession.blocks[activePosition.blockIndex]?.blockId ?? null
        : null;
    const currentExerciseId =
      activeSession && activePosition
        ? activeSession.blocks[activePosition.blockIndex]?.exercises[activePosition.exerciseIndex]
            ?.exerciseId ?? null
        : null;

    return (
      <>
        <TrainActiveSessionContextView
          plan={activePlan}
          day={activeDay}
          currentBlockId={currentBlockId}
          currentExerciseId={currentExerciseId}
          showControls={isSessionSheetOpen}
          onShowControls={() => setIsSessionSheetOpen(true)}
          onEndSession={onEndSession}
        />
        <BottomSheet
          visible={isSessionSheetOpen}
          title="Active Session"
          onDismiss={() => setIsSessionSheetOpen(false)}>
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
            inputPlaceholderColor={colors.inputPlaceholder ?? '#9ca3af'}
            inputBorderColor={colors.inputBorder}
            inputBackgroundColor={colors.inputBackground}
            inputTextColor={colors.inputText}
          />
        </BottomSheet>
      </>
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
      onViewPlans={onViewPlans}
      startDisabledReason={startDisabledReason}
      onRefresh={onRefresh}
    />
  );
}
