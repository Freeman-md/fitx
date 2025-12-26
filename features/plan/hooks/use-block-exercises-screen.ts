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
  const [draft, setDraft] = useState<ExerciseDraft>(emptyDraft);
  const [editingExercise, setEditingExercise] = useState<EditingExercise | null>(null);

  const nextOrder = useMemo(() => getNextOrder(orderedExercises), [orderedExercises]);

  const handleAddExercise = async () => {
    if (!currentBlock) {
      return;
    }
    if (!hasPerformanceTarget(draft)) {
      Alert.alert('Exercise needs reps or time', 'Add reps or time to save this exercise.');
      return;
    }
    const nextExercise = buildExerciseFromDraft(draft, nextOrder);
    await addExercise(nextExercise);
    setDraft(emptyDraft);
  };

  const startEditingExercise = (exercise: Exercise) => {
    setEditingExercise({ id: exercise.id, ...draftFromExercise(exercise) });
  };

  const handleSaveEdit = async () => {
    if (!editingExercise) {
      return;
    }
    if (!hasPerformanceTarget(editingExercise)) {
      Alert.alert('Exercise needs reps or time', 'Add reps or time to save this exercise.');
      return;
    }
    await editExercise(editingExercise.id, (exercise) =>
      applyDraftToExercise(exercise, editingExercise)
    );
    setEditingExercise(null);
  };

  const updateDraftField = (field: keyof ExerciseDraft, value: string) => {
    setDraft((current) => ({ ...current, [field]: value }));
  };

  const updateEditingField = (field: keyof ExerciseDraft, value: string) => {
    setEditingExercise((current) => (current ? { ...current, [field]: value } : current));
  };

  return {
    currentPlan,
    currentDay,
    currentBlock,
    orderedExercises,
    draft,
    editingExercise,
    handleAddExercise,
    startEditingExercise,
    handleSaveEdit,
    updateDraftField,
    updateEditingField,
    cancelEdit: () => setEditingExercise(null),
    deleteExercise,
    moveExercise,
  };
}
