import { useRouter } from 'expo-router';

import { TrainScreenView } from '@/features/session/components/TrainScreenView';
import { useTrainScreen } from '@/features/session/hooks/use-train-screen';

export default function TrainScreen() {
  const router = useRouter();
  const {
    theme,
    inputRef,
    hasActiveSession,
    plans,
    selectedPlan,
    currentExerciseInfo,
    actualRepsInput,
    setActualRepsInput,
    actualTimeInput,
    setActualTimeInput,
    isResting,
    restSecondsRemaining,
    setNumber,
    startSessionForDay,
    completeSet,
    skipSet,
    skipRest,
    endSessionPrompt,
    setSelectedPlanId,
  } = useTrainScreen({
    onSessionCompleted: () => {
      router.push('/session-summary');
    },
  });

  return (
    <TrainScreenView
      colors={theme.colors}
      inputRef={inputRef}
      hasActiveSession={hasActiveSession}
      currentExerciseInfo={currentExerciseInfo}
      setNumber={setNumber}
      actualRepsInput={actualRepsInput}
      actualTimeInput={actualTimeInput}
      onChangeActualReps={setActualRepsInput}
      onChangeActualTime={setActualTimeInput}
      isResting={isResting}
      restSecondsRemaining={restSecondsRemaining}
      onCompleteSet={() => void completeSet()}
      onSkipSet={() => void skipSet()}
      onSkipRest={() => void skipRest()}
      onEndSession={endSessionPrompt}
      plans={plans}
      selectedPlan={selectedPlan}
      onSelectPlan={setSelectedPlanId}
      onStartSession={startSessionForDay}
    />
  );
}
