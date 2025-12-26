import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { Block, Exercise, WorkoutDay, WorkoutPlan } from '@/data/models';
import { ExerciseCard } from '@/features/plan/components/ExerciseCard';
import { Button } from '@/components/ui/button';
import { Fab } from '@/components/ui/fab';
import { PageTitle, SecondaryText, SectionTitle } from '@/components/ui/text';
import { Spacing } from '@/components/ui/spacing';

type BlockExercisesViewProps = {
  plan: WorkoutPlan | null;
  day: WorkoutDay | null;
  block: Block | null;
  exercises: Exercise[];
  onAddExercise: () => void;
  onEditExercise: (exercise: Exercise) => void;
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
  onAddExercise,
  onEditExercise,
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
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <View style={styles.screen}>
        <ScrollView contentContainerStyle={styles.container} alwaysBounceVertical={false}>
          <View style={styles.context}>
            <PageTitle style={styles.blockName}>{block.title}</PageTitle>
            <SecondaryText style={styles.subtitle}>
              {plan.gymType ? `${day.name} · ${plan.name} · ${plan.gymType}` : `${day.name} · ${plan.name}`}
            </SecondaryText>
          </View>
          <View style={styles.section}>
            <SectionTitle>Exercises</SectionTitle>
            <SecondaryText>Tap an exercise to edit details.</SecondaryText>
          </View>
          <View style={styles.section}>
            {exercises.length === 0 ? (
              <SecondaryText style={styles.centeredText}>No exercises yet.</SecondaryText>
            ) : (
              exercises.map((exercise) => (
                <ExerciseCard
                  key={exercise.id}
                  exercise={exercise}
                  onMoveUp={() => onMoveUp(exercise.id)}
                  onMoveDown={() => onMoveDown(exercise.id)}
                  onEdit={() => onEditExercise(exercise)}
                  onDelete={() => onDelete(exercise.id)}
                />
              ))
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
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xxl,
    gap: Spacing.md,
  },
  context: {
    gap: Spacing.xs,
  },
  blockName: {
    textAlign: 'left',
    opacity: 1,
    fontSize: 18,
    fontWeight: '700',
  },
  section: {
    gap: Spacing.sm,
  },
  subtitle: {
    opacity: 0.75,
  },
  centeredText: {
    textAlign: 'center',
  },
});
