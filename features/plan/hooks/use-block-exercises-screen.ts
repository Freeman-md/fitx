import { useMemo, useState } from 'react';
import { Alert } from 'react-native';

import type { Exercise } from '@/data/models';
import { useBlockExercises } from '@/features/plan/hooks/use-block-exercises';
import {
  applyDraftToExercise,
  buildExerciseFromDraft,
  type ExerciseDraft,
  draftFromExercise,
  emptyDraft,
  hasPerformanceTarget,
} from '@/features/plan/utils/exercise-helpers';
import { getNextOrder } from '@/features/plan/utils/order';

type EditingExercise = ExerciseDraft & {
  id: string;
};

export function useBlockExercisesScreen(
  planId: string | undefined,
  dayId: string | undefined,
  blockId: string | undefined
) {
  const {
    currentPlan,
    currentDay,
    currentBlock,
    orderedExercises,
    addExercise,
    editExercise,
    deleteExercise,
    moveExercise,
  } = useBlockExercises(planId, dayId, blockId);
  const [exerciseDraft, setExerciseDraft] = useState<ExerciseDraft>(emptyDraft);
  const [exerciseBeingEdited, setExerciseBeingEdited] = useState<EditingExercise | null>(null);

  const nextExerciseOrder = useMemo(() => getNextOrder(orderedExercises), [orderedExercises]);

  const addExerciseWithValidation = async () => {
    if (!currentBlock) {
      return false;
    }
    if (!hasPerformanceTarget(exerciseDraft)) {
      Alert.alert('Exercise needs reps or time', 'Add reps or time to save this exercise.');
      return false;
    }
    const nextExercise = buildExerciseFromDraft(exerciseDraft, nextExerciseOrder);
    await addExercise(nextExercise);
    setExerciseDraft(emptyDraft);
    return true;
  };

  const beginExerciseEdit = (exercise: Exercise) => {
    setExerciseBeingEdited({ id: exercise.id, ...draftFromExercise(exercise) });
  };

  const saveExerciseEdit = async () => {
    if (!exerciseBeingEdited) {
      return;
    }
    if (!hasPerformanceTarget(exerciseBeingEdited)) {
      Alert.alert('Exercise needs reps or time', 'Add reps or time to save this exercise.');
      return;
    }
    await editExercise(exerciseBeingEdited.id, (exercise) =>
      applyDraftToExercise(exercise, exerciseBeingEdited)
    );
    setExerciseBeingEdited(null);
  };

  const setDraftField = (field: keyof ExerciseDraft, value: string) => {
    setExerciseDraft((current) => ({ ...current, [field]: value }));
  };

  const setEditingField = (field: keyof ExerciseDraft, value: string) => {
    setExerciseBeingEdited((current) => (current ? { ...current, [field]: value } : current));
  };

  return {
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
    resetExerciseDraft: () => setExerciseDraft(emptyDraft),
    cancelExerciseEdit: () => setExerciseBeingEdited(null),
    deleteExercise,
    moveExercise,
  };
}
