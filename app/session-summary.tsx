import { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { Session, WorkoutDay, WorkoutPlan } from '@/data/models';
import { RowText, SectionTitle } from '@/components/ui/text';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { loadLastCompletedSessionId, loadSessions, loadWorkoutPlans } from '@/data/storage';

type SummaryData = {
  session: Session;
  plan: WorkoutPlan | null;
  day: WorkoutDay | null;
  completedExerciseNames: string[];
};

function buildSummaryData(
  session: Session,
  plan: WorkoutPlan | null,
  day: WorkoutDay | null
): SummaryData {
  const exerciseNameById = new Map<string, string>();
  if (day) {
    for (const block of day.blocks) {
      for (const exercise of block.exercises) {
        exerciseNameById.set(exercise.id, exercise.name);
      }
    }
  }

  const completedExerciseIds = new Set<string>();
  for (const block of session.blocks) {
    for (const exercise of block.exercises) {
      if (exercise.sets.some((set) => set.completed)) {
        completedExerciseIds.add(exercise.exerciseId);
      }
    }
  }

  const completedExerciseNames = Array.from(completedExerciseIds)
    .map((id) => exerciseNameById.get(id))
    .filter((name): name is string => Boolean(name));

  return {
    session,
    plan,
    day,
    completedExerciseNames,
  };
}

export default function SessionSummaryScreen() {
  const colorScheme = useColorScheme();
  const [summary, setSummary] = useState<SummaryData | null>(null);

  useEffect(() => {
    const loadSummary = async () => {
      const sessionId = await loadLastCompletedSessionId();
      if (!sessionId) {
        return;
      }

      const [sessions, plans] = await Promise.all([loadSessions(), loadWorkoutPlans()]);
      const session = sessions.find((item) => item.id === sessionId);
      if (!session) {
        return;
      }

      const plan = plans.find((item) => item.id === session.workoutPlanId) ?? null;
      const day = plan?.days.find((item) => item.id === session.workoutDayId) ?? null;
      setSummary(buildSummaryData(session, plan, day));
    };

    void loadSummary();
  }, []);

  const exerciseList = useMemo(() => {
    if (!summary) {
      return [];
    }
    return summary.completedExerciseNames.length > 0
      ? summary.completedExerciseNames
      : ['No completed exercises'];
  }, [summary]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container} alwaysBounceVertical={false}>
        <Text style={[styles.pageTitle, colorScheme === 'dark' ? styles.pageTitleDark : null]}>
          Session Summary
        </Text>
      {summary ? (
        <View style={styles.section}>
          <RowText>Plan: {summary.plan?.name ?? 'Unknown'}</RowText>
          <RowText>Day: {summary.day?.name ?? 'Unknown'}</RowText>
          <RowText>Started: {summary.session.startedAt}</RowText>
          <RowText>Ended: {summary.session.endedAt ?? 'In progress'}</RowText>
          <SectionTitle style={styles.sectionTitle}>Exercises Completed</SectionTitle>
          {exerciseList.map((name) => (
            <RowText key={name}>{name}</RowText>
          ))}
        </View>
      ) : (
        <RowText>No completed session found.</RowText>
      )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  safeArea: {
    flex: 1,
  },
  pageTitle: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    opacity: 0.7,
  },
  pageTitleDark: {
    color: '#ECEDEE',
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    marginTop: 8,
  },
});
