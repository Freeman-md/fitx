import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { WorkoutDay, WorkoutPlan } from '@/data/models';
import { Button } from '@/components/ui/button';
import { PrimaryText, SecondaryText, SectionTitle } from '@/components/ui/text';
import { Spacing } from '@/components/ui/spacing';
import { useColorScheme } from '@/hooks/use-color-scheme';

type TrainActiveSessionContextViewProps = {
  plan: WorkoutPlan | null;
  day: WorkoutDay | null;
  currentBlockId: string | null;
  currentExerciseId: string | null;
  showControls: boolean;
  onShowControls: () => void;
  onEndSession: () => void;
};

export function TrainActiveSessionContextView({
  plan,
  day,
  currentBlockId,
  currentExerciseId,
  showControls,
  onShowControls,
  onEndSession,
}: TrainActiveSessionContextViewProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const blockHighlight = isDark ? '#1f2937' : '#f8fafc';
  const exerciseHighlight = isDark ? '#111827' : '#ffffff';
  const borderColor = isDark ? '#334155' : '#e2e8f0';
  const accent = isDark ? '#60a5fa' : '#2563eb';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.screen}>
        <ScrollView contentContainerStyle={styles.container} alwaysBounceVertical>
          <SectionTitle>Plan</SectionTitle>
          <PrimaryText style={styles.planName}>
            {plan?.name ?? 'Current plan unavailable'}
          </PrimaryText>
          <View style={styles.section}>
            <SectionTitle>Day</SectionTitle>
            <PrimaryText style={styles.dayName}>
              {day?.name ?? 'Current day unavailable'}
            </PrimaryText>
          </View>
          {day ? (
            <View style={styles.section}>
              <SectionTitle>Blocks</SectionTitle>
              <View style={styles.blockList}>
                {day.blocks.map((block) => {
                  const isCurrentBlock = block.id === currentBlockId;
                  return (
                    <View
                      key={block.id}
                      style={[
                        styles.blockCard,
                        { borderColor },
                        isCurrentBlock ? { backgroundColor: blockHighlight } : null,
                      ]}>
                      <View style={styles.blockHeader}>
                        <PrimaryText style={styles.blockTitle}>{block.title}</PrimaryText>
                        {isCurrentBlock ? (
                          <SecondaryText style={[styles.currentTag, { color: accent }]}>
                            Current block
                          </SecondaryText>
                        ) : null}
                      </View>
                      <View style={styles.exerciseList}>
                        {block.exercises.map((exercise) => {
                          const isCurrentExercise = exercise.id === currentExerciseId;
                          return (
                            <View
                              key={exercise.id}
                              style={[
                                styles.exerciseRow,
                                { borderColor },
                                isCurrentExercise
                                  ? { backgroundColor: exerciseHighlight, borderColor: accent }
                                  : null,
                              ]}>
                              <PrimaryText style={styles.exerciseName}>{exercise.name}</PrimaryText>
                              <SecondaryText>
                                {exercise.timeSeconds
                                  ? `${exercise.timeSeconds}s`
                                  : exercise.repsMin && exercise.repsMax
                                    ? `${exercise.repsMin}-${exercise.repsMax} reps`
                                    : exercise.repsMin
                                      ? `${exercise.repsMin} reps`
                                      : exercise.repsMax
                                        ? `${exercise.repsMax} reps`
                                        : 'No target'}
                              </SecondaryText>
                            </View>
                          );
                        })}
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          ) : null}
        </ScrollView>
        <View style={[styles.footer, { borderTopColor: borderColor }]}>
          {!showControls ? (
            <Button label="Show Session Controls" onPress={onShowControls} variant="primary" />
          ) : null}
          <Button label="End Session" onPress={onEndSession} variant="secondary" size="compact" />
        </View>
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
  planName: {
    fontSize: 18,
    fontWeight: '600',
  },
  dayName: {
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    gap: Spacing.sm,
  },
  blockList: {
    gap: Spacing.sm,
  },
  blockCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  blockHeader: {
    gap: Spacing.xs,
  },
  blockTitle: {
    fontWeight: '600',
  },
  currentTag: {
    fontSize: 12,
  },
  exerciseList: {
    gap: Spacing.xs,
  },
  exerciseRow: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    gap: 2,
  },
  exerciseName: {
    fontWeight: '600',
  },
  footer: {
    borderTopWidth: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    gap: Spacing.xs,
  },
});
