import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { Block, Exercise, WorkoutDay, WorkoutPlan } from '@/data/models';
import { ExerciseCard } from '@/features/plan/components/ExerciseCard';
import { ExerciseForm } from '@/features/plan/components/ExerciseForm';
import type { ExerciseDraft } from '@/features/plan/utils/exercise-helpers';
import { Button } from '@/components/ui/button';
import { PageTitle, SecondaryText } from '@/components/ui/text';
import { Spacing } from '@/components/ui/spacing';

type EditingExercise = ExerciseDraft & {
  id: string;
};

type BlockExercisesViewProps = {
  plan: WorkoutPlan | null;
  day: WorkoutDay | null;
  block: Block | null;
  exercises: Exercise[];
  draft: ExerciseDraft;
  editingExercise: EditingExercise | null;
  onChangeDraftField: (field: keyof ExerciseDraft, value: string) => void;
  onChangeEditingField: (field: keyof ExerciseDraft, value: string) => void;
  onAddExercise: () => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onStartEdit: (exercise: Exercise) => void;
  onDelete: (exerciseId: string) => void;
  onMoveUp: (exerciseId: string) => void;
  onMoveDown: (exerciseId: string) => void;
  onBack: () => void;
};

export function BlockExercisesView({
  plan,
  day,
  block,
  exercises,
  draft,
  editingExercise,
  onChangeDraftField,
  onChangeEditingField,
  onAddExercise,
  onSaveEdit,
  onCancelEdit,
  onStartEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  onBack,
}: BlockExercisesViewProps) {
  if (!plan || !day || !block) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.container}>
          <SecondaryText>Block not found.</SecondaryText>
          <Button label="Back" onPress={onBack} variant="secondary" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container} alwaysBounceVertical={false}>
        <PageTitle>{block.title}</PageTitle>
        <SecondaryText style={styles.subtitle}>
          {day.name} · {plan.name}
        </SecondaryText>
        <ExerciseForm
          name={draft.name}
          sets={draft.sets}
          repsMin={draft.repsMin}
          repsMax={draft.repsMax}
          timeSeconds={draft.timeSeconds}
          restSeconds={draft.restSeconds}
          notes={draft.notes}
          onChangeName={(value) => onChangeDraftField('name', value)}
          onChangeSets={(value) => onChangeDraftField('sets', value)}
          onChangeRepsMin={(value) => onChangeDraftField('repsMin', value)}
          onChangeRepsMax={(value) => onChangeDraftField('repsMax', value)}
          onChangeTimeSeconds={(value) => onChangeDraftField('timeSeconds', value)}
          onChangeRestSeconds={(value) => onChangeDraftField('restSeconds', value)}
          onChangeNotes={(value) => onChangeDraftField('notes', value)}
          onSubmit={onAddExercise}
          submitLabel="Add Exercise"
        />
        <View style={styles.section}>
          {exercises.length === 0 ? (
            <SecondaryText style={styles.centeredText}>No exercises yet.</SecondaryText>
          ) : (
            exercises.map((exercise) =>
              editingExercise?.id === exercise.id ? (
                <ExerciseForm
                  key={exercise.id}
                  name={editingExercise.name}
                  sets={editingExercise.sets}
                  repsMin={editingExercise.repsMin}
                  repsMax={editingExercise.repsMax}
                  timeSeconds={editingExercise.timeSeconds}
                  restSeconds={editingExercise.restSeconds}
                  notes={editingExercise.notes}
                  onChangeName={(value) => onChangeEditingField('name', value)}
                  onChangeSets={(value) => onChangeEditingField('sets', value)}
                  onChangeRepsMin={(value) => onChangeEditingField('repsMin', value)}
                  onChangeRepsMax={(value) => onChangeEditingField('repsMax', value)}
                  onChangeTimeSeconds={(value) => onChangeEditingField('timeSeconds', value)}
                  onChangeRestSeconds={(value) => onChangeEditingField('restSeconds', value)}
                  onChangeNotes={(value) => onChangeEditingField('notes', value)}
                  onSubmit={onSaveEdit}
                  submitLabel="Save"
                  onCancel={onCancelEdit}
                />
              ) : (
                <ExerciseCard
                  key={exercise.id}
                  exercise={exercise}
                  onMoveUp={() => onMoveUp(exercise.id)}
                  onMoveDown={() => onMoveDown(exercise.id)}
                  onEdit={() => onStartEdit(exercise)}
                  onDelete={() => onDelete(exercise.id)}
                />
              )
            )
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    padding: Spacing.md,
    gap: Spacing.md,
  },
  section: {
    gap: Spacing.sm,
  },
  subtitle: {
    textAlign: 'center',
  },
  centeredText: {
    textAlign: 'center',
  },
});
