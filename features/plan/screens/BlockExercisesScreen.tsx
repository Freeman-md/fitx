import { useLocalSearchParams, useRouter } from 'expo-router';

import { BlockExercisesView } from '@/features/plan/components/BlockExercisesView';
import { useBlockExercisesScreen } from '@/features/plan/hooks/use-block-exercises-screen';

export default function BlockExercisesScreen() {
  const router = useRouter();
  const { planId, dayId, blockId } = useLocalSearchParams<{
    planId: string;
    dayId: string;
    blockId: string;
  }>();
  const {
    currentPlan,
    currentDay,
    currentBlock,
    orderedExercises,
    exerciseDraft,
    exerciseBeingEdited,
    addExerciseWithValidation,
    beginExerciseEdit,
    saveExerciseEdit,
    setDraftField,
    setEditingField,
    cancelExerciseEdit,
    deleteExercise,
    moveExercise,
  } = useBlockExercisesScreen(planId, dayId, blockId);

  return (
    <BlockExercisesView
      plan={currentPlan}
      day={currentDay}
      block={currentBlock}
      exercises={orderedExercises}
      draft={exerciseDraft}
      editingExercise={exerciseBeingEdited}
      onChangeDraftField={setDraftField}
      onChangeEditingField={setEditingField}
      onAddExercise={() => void addExerciseWithValidation()}
      onSaveEdit={() => void saveExerciseEdit()}
      onCancelEdit={cancelExerciseEdit}
      onStartEdit={beginExerciseEdit}
      onDelete={(exerciseId) => void deleteExercise(exerciseId)}
      onMoveUp={(exerciseId) => void moveExercise(exerciseId, 'up')}
      onMoveDown={(exerciseId) => void moveExercise(exerciseId, 'down')}
      onBack={() => router.back()}
    />
  );
}
