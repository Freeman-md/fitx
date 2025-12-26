import { Stack, useLocalSearchParams, useRouter } from 'expo-router';

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
    exerciseBeingEdited,
    beginExerciseEdit,
    saveExerciseEdit,
    setEditingField,
    cancelExerciseEdit,
    deleteExercise,
    moveExercise,
  } = useBlockExercisesScreen(planId, dayId, blockId);

  return (
    <>
      <Stack.Screen
        options={{
          title: currentBlock?.title ? `Block: ${currentBlock.title}` : 'Block',
          headerBackTitle: 'Back',
          headerBackTitleVisible: true,
        }}
      />
      <BlockExercisesView
        plan={currentPlan}
        day={currentDay}
        block={currentBlock}
        exercises={orderedExercises}
        editingExercise={exerciseBeingEdited}
        onChangeEditingField={setEditingField}
        onAddExercise={() =>
          router.push(`/plans/${planId}/days/${dayId}/blocks/${blockId}/exercises/create`)
        }
        onSaveEdit={() => void saveExerciseEdit()}
        onCancelEdit={cancelExerciseEdit}
        onStartEdit={beginExerciseEdit}
        onDelete={(exerciseId) => void deleteExercise(exerciseId)}
        onMoveUp={(exerciseId) => void moveExercise(exerciseId, 'up')}
        onMoveDown={(exerciseId) => void moveExercise(exerciseId, 'down')}
        onBack={() => router.back()}
      />
    </>
  );
}
