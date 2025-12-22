import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { Session, WorkoutDay, WorkoutPlan } from '@/data/models';
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
    <View style={styles.container}>
      <Text style={styles.title}>Session Summary</Text>
      {summary ? (
        <View style={styles.section}>
          <Text style={styles.rowText}>Plan: {summary.plan?.name ?? 'Unknown'}</Text>
          <Text style={styles.rowText}>Day: {summary.day?.name ?? 'Unknown'}</Text>
          <Text style={styles.rowText}>Started: {summary.session.startedAt}</Text>
          <Text style={styles.rowText}>Ended: {summary.session.endedAt ?? 'In progress'}</Text>
          <Text style={styles.sectionTitle}>Exercises Completed</Text>
          {exerciseList.map((name) => (
            <Text key={name} style={styles.rowText}>
              {name}
            </Text>
          ))}
        </View>
      ) : (
        <Text style={styles.rowText}>No completed session found.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    gap: 16,
  },
  title: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    marginTop: 8,
    fontWeight: '600',
  },
  rowText: {
    fontSize: 14,
  },
});
