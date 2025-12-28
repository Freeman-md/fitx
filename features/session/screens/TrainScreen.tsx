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
    selectedDay,
    selectedDayId,
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
    setSelectedDayId,
    selectedPlanId,
    refreshSessionState,
  } = useTrainScreen({
    onSessionCompleted: () => {
      router.push('/session-summary');
    },
  });

  const startDisabledReason = selectedPlan
    ? selectedDay
      ? null
      : 'Select a day to start.'
    : 'Select a plan to start.';

  const handleSelectPlan = (planId: string) => {
    setSelectedPlanId(planId);
    setSelectedDayId(null);
  };

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
      selectedDayId={selectedDayId}
      onSelectPlan={handleSelectPlan}
      onSelectDay={setSelectedDayId}
      onStartSession={() => void startSessionForDay()}
      onCreatePlan={() => router.push({ pathname: '/(tabs)/plans', params: { create: '1' } })}
      onAddDays={() => {
        if (selectedPlanId) {
          router.push(`/plans/${selectedPlanId}`);
        }
      }}
      startDisabledReason={startDisabledReason}
      onRefresh={() => void refreshSessionState()}
    />
  );
}
