import { useMemo, useState } from 'react';
import { Alert, Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';

import type { Exercise } from '@/data/models';
import { ExerciseCard } from '@/features/plan/components/ExerciseCard';
import { ExerciseForm } from '@/features/plan/components/ExerciseForm';
import {
  applyDraftToExercise,
  buildExerciseFromDraft,
  type ExerciseDraft,
  draftFromExercise,
  emptyDraft,
} from '@/features/plan/utils/exercise-helpers';
import { useBlockExercises } from '@/features/plan/hooks/use-block-exercises';
type EditingExercise = ExerciseDraft & {
  id: string;
};
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
    addExercise,
    editExercise,
    deleteExercise,
    moveExercise,
  } = useBlockExercises(planId, dayId, blockId);
  const [draft, setDraft] = useState<ExerciseDraft>(emptyDraft);
  const [editingExercise, setEditingExercise] = useState<EditingExercise | null>(null);

  const nextOrder = useMemo(() => {
    return orderedExercises.length > 0 ? orderedExercises[orderedExercises.length - 1].order + 1 : 1;
  }, [orderedExercises]);

  const hasPerformanceTarget = (draft: ExerciseDraft) => {
    return Boolean(draft.repsMin || draft.repsMax || draft.timeSeconds);
  };

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

  const handleStartEdit = (exercise: Exercise) => {
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

  if (!currentPlan || !currentDay || !currentBlock) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.container}>
          <Text>Block not found.</Text>
          <Button title="Back" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container} alwaysBounceVertical={false}>
        <Text style={styles.title}>{currentBlock.title}</Text>
        <Text style={styles.subtitle}>
          {currentDay.name} · {currentPlan.name}
        </Text>
        <ExerciseForm
          name={draft.name}
          sets={draft.sets}
          repsMin={draft.repsMin}
          repsMax={draft.repsMax}
          timeSeconds={draft.timeSeconds}
          restSeconds={draft.restSeconds}
          notes={draft.notes}
          onChangeName={(value) => setDraft((current) => ({ ...current, name: value }))}
          onChangeSets={(value) => setDraft((current) => ({ ...current, sets: value }))}
          onChangeRepsMin={(value) => setDraft((current) => ({ ...current, repsMin: value }))}
          onChangeRepsMax={(value) => setDraft((current) => ({ ...current, repsMax: value }))}
          onChangeTimeSeconds={(value) =>
            setDraft((current) => ({ ...current, timeSeconds: value }))
          }
          onChangeRestSeconds={(value) =>
            setDraft((current) => ({ ...current, restSeconds: value }))
          }
          onChangeNotes={(value) => setDraft((current) => ({ ...current, notes: value }))}
          onSubmit={() => void handleAddExercise()}
          submitLabel="Add Exercise"
        />
        <View style={styles.section}>
          {orderedExercises.length === 0 ? (
            <Text>No exercises yet.</Text>
          ) : (
            orderedExercises.map((exercise) =>
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
                  onChangeName={(value) =>
                    setEditingExercise((current) =>
                      current ? { ...current, name: value } : current
                    )
                  }
                  onChangeSets={(value) =>
                    setEditingExercise((current) =>
                      current ? { ...current, sets: value } : current
                    )
                  }
                  onChangeRepsMin={(value) =>
                    setEditingExercise((current) =>
                      current ? { ...current, repsMin: value } : current
                    )
                  }
                  onChangeRepsMax={(value) =>
                    setEditingExercise((current) =>
                      current ? { ...current, repsMax: value } : current
                    )
                  }
                  onChangeTimeSeconds={(value) =>
                    setEditingExercise((current) =>
                      current ? { ...current, timeSeconds: value } : current
                    )
                  }
                  onChangeRestSeconds={(value) =>
                    setEditingExercise((current) =>
                      current ? { ...current, restSeconds: value } : current
                    )
                  }
                  onChangeNotes={(value) =>
                    setEditingExercise((current) =>
                      current ? { ...current, notes: value } : current
                    )
                  }
                  onSubmit={() => void handleSaveEdit()}
                  submitLabel="Save"
                  onCancel={() => setEditingExercise(null)}
                />
              ) : (
                <ExerciseCard
                  key={exercise.id}
                  exercise={exercise}
                  onMoveUp={() => void moveExercise(exercise.id, 'up')}
                  onMoveDown={() => void moveExercise(exercise.id, 'down')}
                  onEdit={() => handleStartEdit(exercise)}
                  onDelete={() => void deleteExercise(exercise.id)}
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
