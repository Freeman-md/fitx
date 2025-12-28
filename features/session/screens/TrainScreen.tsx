import { useRouter } from 'expo-router';

import { TrainScreenView } from '@/features/session/components/TrainScreenView';
import { useTrainScreen } from '@/features/session/hooks/use-train-screen';

export default function TrainScreen() {
  const router = useRouter();
  const {
    theme,
    inputRef,
    hasActiveSession,
    activeSession,
    activePlan,
    activeDay,
    activePosition,
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
    refreshSessionState,
  } = useTrainScreen({
    onSessionCompleted: () => {
      router.push('/session-summary');
    },
  });

  const startDisabledReason = selectedDay ? null : 'Select a workout to start.';

  const handleSelectPlan = (planId: string) => {
    setSelectedPlanId(planId);
    setSelectedDayId(null);
  };

  return (
    <TrainScreenView
      colors={theme.colors}
      inputRef={inputRef}
      hasActiveSession={hasActiveSession}
      activeSession={activeSession}
      activePlan={activePlan}
      activeDay={activeDay}
      activePosition={activePosition}
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
      onViewPlans={() => router.push('/(tabs)/plans')}
      startDisabledReason={startDisabledReason}
      onRefresh={() => void refreshSessionState()}
    />
  );
}
