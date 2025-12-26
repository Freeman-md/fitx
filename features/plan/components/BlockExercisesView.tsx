import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { Block, Exercise, WorkoutDay, WorkoutPlan } from '@/data/models';
import { ExerciseCard } from '@/features/plan/components/ExerciseCard';
import { ExerciseForm } from '@/features/plan/components/ExerciseForm';
import type { ExerciseDraft } from '@/features/plan/utils/exercise-helpers';

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
          <Text>Block not found.</Text>
          <Button title="Back" onPress={onBack} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container} alwaysBounceVertical={false}>
        <Text style={styles.title}>{block.title}</Text>
        <Text style={styles.subtitle}>
          {day.name} · {plan.name}
        </Text>
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
            <Text>No exercises yet.</Text>
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
    padding: 16,
    gap: 16,
  },
  title: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    opacity: 0.7,
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 12,
    opacity: 0.7,
  },
  section: {
    gap: 12,
  },
});
