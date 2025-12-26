import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';

import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Button } from '@/components/ui/button';
import { Spacing } from '@/components/ui/spacing';
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

  useEffect(() => {
    if (exerciseBeingEdited) {
      setEditMode(exerciseBeingEdited.timeSeconds ? 'time' : 'reps');
    }
  }, [exerciseBeingEdited]);

  const closeAddExerciseSheet = () => {
    setIsAddOpen(false);
    setCreateMode('reps');
    resetExerciseDraft();
  };

  const handleAddExercise = async () => {
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
          <View style={styles.footer}>
            <Button
              label="Save"
              onPress={() => void handleAddExercise()}
              style={styles.fullWidth}
            />
            <Button
              label="Cancel"
              variant="secondary"
              onPress={closeAddExerciseSheet}
              style={styles.fullWidth}
            />
          </View>
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
          onChangeName={(value) => setDraftField('name', value)}
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
          <View style={styles.footer}>
            <Button label="Save" onPress={() => void saveExerciseEdit()} style={styles.fullWidth} />
            <Button
              label="Cancel"
              variant="secondary"
              onPress={cancelExerciseEdit}
              style={styles.fullWidth}
            />
          </View>
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
            onChangeName={(value) => setEditingField('name', value)}
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

const styles = StyleSheet.create({
  footer: {
    gap: Spacing.sm,
  },
  fullWidth: {
    width: '100%',
  },
});
