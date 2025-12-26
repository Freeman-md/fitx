import { useEffect, useState } from 'react';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';

import { BottomSheet } from '@/components/ui/bottom-sheet';
import { FormFooter } from '@/components/ui/form-footer';
import { BlockExercisesView } from '@/features/plan/components/BlockExercisesView';
import { ExerciseForm } from '@/features/plan/components/ExerciseForm';
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
    beginExerciseEdit,
    saveExerciseEdit,
    addExerciseWithValidation,
    setEditingField,
    setDraftField,
    cancelExerciseEdit,
    resetExerciseDraft,
    deleteExercise,
    moveExercise,
  } = useBlockExercisesScreen(planId, dayId, blockId);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [createMode, setCreateMode] = useState<'reps' | 'time'>('reps');
  const [editMode, setEditMode] = useState<'reps' | 'time'>('reps');
  const [nameTouched, setNameTouched] = useState(false);
  const [editNameTouched, setEditNameTouched] = useState(false);

  useEffect(() => {
    if (exerciseBeingEdited) {
      setEditMode(exerciseBeingEdited.timeSeconds ? 'time' : 'reps');
      setEditNameTouched(false);
    }
  }, [exerciseBeingEdited]);

  useEffect(() => {
    if (isAddOpen) {
      if (!exerciseDraft.sets.trim()) {
        setDraftField('sets', '1');
      }
      if (!exerciseDraft.restSeconds.trim()) {
        setDraftField('restSeconds', '0');
      }
      if (createMode === 'reps') {
        if (!exerciseDraft.repsMin.trim()) {
          setDraftField('repsMin', '1');
        }
        if (!exerciseDraft.repsMax.trim()) {
          setDraftField('repsMax', '1');
        }
      }
    }
  }, [
    isAddOpen,
    createMode,
    exerciseDraft.sets,
    exerciseDraft.restSeconds,
    exerciseDraft.repsMin,
    exerciseDraft.repsMax,
    setDraftField,
  ]);

  const parseNumber = (value: string) => {
    if (!value.trim()) {
      return null;
    }
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  };

  const nameError =
    nameTouched && exerciseDraft.name.trim().length === 0 ? 'Exercise name is required.' : '';
  const setsValue = parseNumber(exerciseDraft.sets);
  const setsError = !setsValue ? 'Sets are required.' : '';
  const restValue = parseNumber(exerciseDraft.restSeconds);
  const restError = restValue === null ? 'Rest seconds are required.' : '';

  const repsMinValue = parseNumber(exerciseDraft.repsMin);
  const repsMaxValue = parseNumber(exerciseDraft.repsMax);
  const repsRangeMissing = repsMinValue === null || repsMaxValue === null;
  const repsRangeInvalid =
    repsMinValue !== null && repsMaxValue !== null && repsMaxValue < repsMinValue;
  const repsMinError = createMode === 'reps' && repsRangeMissing ? 'Reps min is required.' : '';
  const repsMaxError =
    createMode === 'reps'
      ? repsRangeMissing
        ? 'Reps max is required.'
        : repsRangeInvalid
          ? 'Max reps must be at least min reps.'
          : ''
      : '';

  const timeError =
    createMode === 'time' && exerciseDraft.timeSeconds.trim().length === 0
      ? 'Time is required.'
      : '';

  const isAddValid =
    exerciseDraft.name.trim().length > 0 &&
    Boolean(setsValue) &&
    restValue !== null &&
    (createMode === 'time'
      ? exerciseDraft.timeSeconds.trim().length > 0
      : !repsRangeMissing && !repsRangeInvalid);

  const editNameError =
    editNameTouched && exerciseBeingEdited?.name.trim().length === 0
      ? 'Exercise name is required.'
      : '';
  const editSetsValue = parseNumber(exerciseBeingEdited?.sets ?? '');
  const editSetsError = editSetsValue ? '' : 'Sets are required.';
  const editRestValue = parseNumber(exerciseBeingEdited?.restSeconds ?? '');
  const editRestError = editRestValue === null ? 'Rest seconds are required.' : '';
  const editRepsMinValue = parseNumber(exerciseBeingEdited?.repsMin ?? '');
  const editRepsMaxValue = parseNumber(exerciseBeingEdited?.repsMax ?? '');
  const editRepsRangeMissing = editRepsMinValue === null || editRepsMaxValue === null;
  const editRepsRangeInvalid =
    editRepsMinValue !== null &&
    editRepsMaxValue !== null &&
    editRepsMaxValue < editRepsMinValue;
  const editRepsMinError =
    editMode === 'reps' && editRepsRangeMissing ? 'Reps min is required.' : '';
  const editRepsMaxError =
    editMode === 'reps'
      ? editRepsRangeMissing
        ? 'Reps max is required.'
        : editRepsRangeInvalid
          ? 'Max reps must be at least min reps.'
          : ''
      : '';
  const editTimeError =
    editMode === 'time' && (exerciseBeingEdited?.timeSeconds.trim().length ?? 0) === 0
      ? 'Time is required.'
      : '';
  const isEditValid =
    Boolean(exerciseBeingEdited?.name.trim()) &&
    Boolean(editSetsValue) &&
    editRestValue !== null &&
    (editMode === 'time'
      ? Boolean(exerciseBeingEdited?.timeSeconds.trim())
      : !editRepsRangeMissing && !editRepsRangeInvalid);

  const closeAddExerciseSheet = () => {
    setIsAddOpen(false);
    setCreateMode('reps');
    resetExerciseDraft();
    setNameTouched(false);
  };

  const handleAddExercise = async () => {
    if (!isAddValid) {
      return;
    }
    const added = await addExerciseWithValidation();
    if (added) {
      closeAddExerciseSheet();
    }
  };

  const handleCreateModeChange = (mode: 'reps' | 'time') => {
    setCreateMode(mode);
    if (mode === 'time') {
      setDraftField('repsMin', '');
      setDraftField('repsMax', '');
    } else {
      setDraftField('timeSeconds', '');
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Block Details',
          headerBackTitle: 'Back',
          headerBackTitleVisible: true,
        }}
      />
      <BlockExercisesView
        plan={currentPlan}
        day={currentDay}
        block={currentBlock}
        exercises={orderedExercises}
        onAddExercise={() => setIsAddOpen(true)}
        onEditExercise={beginExerciseEdit}
        onDelete={(exerciseId) => void deleteExercise(exerciseId)}
        onMoveUp={(exerciseId) => void moveExercise(exerciseId, 'up')}
        onMoveDown={(exerciseId) => void moveExercise(exerciseId, 'down')}
        onBack={() => router.back()}
      />
      <BottomSheet
        visible={isAddOpen}
        title="Add Exercise"
        onDismiss={closeAddExerciseSheet}
        footer={
          <FormFooter
            primaryLabel="Save"
            secondaryLabel="Cancel"
            onPrimary={() => void handleAddExercise()}
            onSecondary={closeAddExerciseSheet}
            primaryDisabled={!isAddValid}
          />
        }>
        <ExerciseForm
          name={exerciseDraft.name}
          sets={exerciseDraft.sets}
          repsMin={exerciseDraft.repsMin}
          repsMax={exerciseDraft.repsMax}
          timeSeconds={exerciseDraft.timeSeconds}
          restSeconds={exerciseDraft.restSeconds}
          notes={exerciseDraft.notes}
          mode={createMode}
          onChangeMode={handleCreateModeChange}
          onChangeName={(value) => {
            setDraftField('name', value);
            if (!nameTouched) {
              setNameTouched(true);
            }
          }}
          onBlurName={() => setNameTouched(true)}
          nameError={nameError}
          setsError={setsError}
          repsMinError={repsMinError}
          repsMaxError={repsMaxError}
          timeError={timeError}
          restError={restError}
          onChangeSets={(value) => setDraftField('sets', value)}
          onChangeRepsMin={(value) => setDraftField('repsMin', value)}
          onChangeRepsMax={(value) => setDraftField('repsMax', value)}
          onChangeTimeSeconds={(value) => setDraftField('timeSeconds', value)}
          onChangeRestSeconds={(value) => setDraftField('restSeconds', value)}
          onChangeNotes={(value) => setDraftField('notes', value)}
        />
      </BottomSheet>
      <BottomSheet
        visible={Boolean(exerciseBeingEdited)}
        title="Edit Exercise"
        onDismiss={cancelExerciseEdit}
        footer={
          <FormFooter
            primaryLabel="Save"
            secondaryLabel="Cancel"
            onPrimary={() => void saveExerciseEdit()}
            onSecondary={cancelExerciseEdit}
            primaryDisabled={!isEditValid}
          />
        }>
        {exerciseBeingEdited ? (
          <ExerciseForm
            name={exerciseBeingEdited.name}
            sets={exerciseBeingEdited.sets}
            repsMin={exerciseBeingEdited.repsMin}
            repsMax={exerciseBeingEdited.repsMax}
            timeSeconds={exerciseBeingEdited.timeSeconds}
            restSeconds={exerciseBeingEdited.restSeconds}
            notes={exerciseBeingEdited.notes}
            mode={editMode}
            onChangeMode={(mode) => {
              setEditMode(mode);
              if (mode === 'time') {
                setEditingField('repsMin', '');
                setEditingField('repsMax', '');
              } else {
                setEditingField('timeSeconds', '');
              }
            }}
            onChangeName={(value) => {
              setEditingField('name', value);
              if (!editNameTouched) {
                setEditNameTouched(true);
              }
            }}
            onBlurName={() => setEditNameTouched(true)}
            nameError={editNameError}
            setsError={editSetsError}
            repsMinError={editRepsMinError}
            repsMaxError={editRepsMaxError}
            timeError={editTimeError}
            restError={editRestError}
            onChangeSets={(value) => setEditingField('sets', value)}
            onChangeRepsMin={(value) => setEditingField('repsMin', value)}
            onChangeRepsMax={(value) => setEditingField('repsMax', value)}
            onChangeTimeSeconds={(value) => setEditingField('timeSeconds', value)}
            onChangeRestSeconds={(value) => setEditingField('restSeconds', value)}
            onChangeNotes={(value) => setEditingField('notes', value)}
          />
        ) : null}
      </BottomSheet>
    </>
  );
}
