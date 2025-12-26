import { ScrollView, StyleSheet, View } from 'react-native';
import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { Block, Exercise, WorkoutDay, WorkoutPlan } from '@/data/models';
import { ExerciseCard } from '@/features/plan/components/ExerciseCard';
import { ExerciseForm } from '@/features/plan/components/ExerciseForm';
import { Button } from '@/components/ui/button';
import { Fab } from '@/components/ui/fab';
import { PageTitle, SecondaryText } from '@/components/ui/text';
import { Spacing } from '@/components/ui/spacing';

type EditingExercise = {
  id: string;
  name: string;
  sets: string;
  repsMin: string;
  repsMax: string;
  timeSeconds: string;
  restSeconds: string;
  notes: string;
};

type EditingField = Exclude<keyof EditingExercise, 'id'>;

type BlockExercisesViewProps = {
  plan: WorkoutPlan | null;
  day: WorkoutDay | null;
  block: Block | null;
  exercises: Exercise[];
  editingExercise: EditingExercise | null;
  onAddExercise: () => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onStartEdit: (exercise: Exercise) => void;
  onChangeEditingField: (field: EditingField, value: string) => void;
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
  editingExercise,
  onAddExercise,
  onSaveEdit,
  onCancelEdit,
  onStartEdit,
  onChangeEditingField,
  onDelete,
  onMoveUp,
  onMoveDown,
  onBack,
}: BlockExercisesViewProps) {
  const [editingMode, setEditingMode] = useState<'reps' | 'time'>('reps');

  useEffect(() => {
    if (editingExercise) {
      setEditingMode(editingExercise.timeSeconds ? 'time' : 'reps');
    }
  }, [editingExercise]);

  const handleEditingModeChange = (mode: 'reps' | 'time') => {
    setEditingMode(mode);
    if (mode === 'time') {
      onChangeEditingField('repsMin', '');
      onChangeEditingField('repsMax', '');
    } else {
      onChangeEditingField('timeSeconds', '');
    }
  };

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
      <View style={styles.screen}>
        <ScrollView contentContainerStyle={styles.container} alwaysBounceVertical={false}>
          <PageTitle>{block.title}</PageTitle>
          <SecondaryText style={styles.subtitle}>
            {day.name} · {plan.name}
          </SecondaryText>
          <View style={styles.section}>
            {exercises.length === 0 ? (
              <SecondaryText style={styles.centeredText}>No exercises yet.</SecondaryText>
            ) : (
              exercises.map((exercise) =>
                editingExercise?.id === exercise.id ? (
                  <View key={exercise.id} style={styles.editingCard}>
                    <ExerciseForm
                      name={editingExercise.name}
                      sets={editingExercise.sets}
                      repsMin={editingExercise.repsMin}
                      repsMax={editingExercise.repsMax}
                      timeSeconds={editingExercise.timeSeconds}
                      restSeconds={editingExercise.restSeconds}
                      notes={editingExercise.notes}
                      mode={editingMode}
                      onChangeMode={handleEditingModeChange}
                      onChangeName={(value) => onChangeEditingField('name', value)}
                      onChangeSets={(value) => onChangeEditingField('sets', value)}
                      onChangeRepsMin={(value) => onChangeEditingField('repsMin', value)}
                      onChangeRepsMax={(value) => onChangeEditingField('repsMax', value)}
                      onChangeTimeSeconds={(value) =>
                        onChangeEditingField('timeSeconds', value)
                      }
                      onChangeRestSeconds={(value) =>
                        onChangeEditingField('restSeconds', value)
                      }
                      onChangeNotes={(value) => onChangeEditingField('notes', value)}
                    />
                    <View style={styles.editActions}>
                      <Button label="Cancel" variant="secondary" onPress={onCancelEdit} />
                      <Button label="Save" onPress={onSaveEdit} />
                    </View>
                  </View>
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
        <Fab accessibilityLabel="Add exercise" label="New Exercise" onPress={onAddExercise} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  screen: {
    flex: 1,
  },
  container: {
    padding: Spacing.md,
    gap: Spacing.md,
    paddingBottom: Spacing.xxl,
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
  editActions: {
    gap: Spacing.sm,
  },
  editingCard: {
    gap: Spacing.sm,
  },
});
