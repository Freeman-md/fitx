import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { SessionStatus } from '@/data/models';
import type { Session, WorkoutDay, WorkoutPlan } from '@/data/models';
import { loadSessions, loadWorkoutPlans } from '@/data/storage';

export default function HistoryScreen() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [plans, setPlans] = useState<WorkoutPlan[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const [storedSessions, storedPlans] = await Promise.all([
        loadSessions(),
        loadWorkoutPlans(),
      ]);
      setSessions(storedSessions);
      setPlans(storedPlans);
    };

    void loadData();
  }, []);

  const completedSessions = useMemo(() => {
    return sessions
      .filter((session) => session.status === SessionStatus.Completed && session.endedAt)
      .sort((a, b) => Date.parse(b.endedAt ?? '') - Date.parse(a.endedAt ?? ''));
  }, [sessions]);

  const selectedSession = useMemo(
    () => completedSessions.find((session) => session.id === selectedSessionId) ?? null,
    [completedSessions, selectedSessionId]
  );

  const sessionPlan = useMemo(() => {
    if (!selectedSession) {
      return null;
    }
    return plans.find((plan) => plan.id === selectedSession.workoutPlanId) ?? null;
  }, [plans, selectedSession]);

  const sessionDay = useMemo(() => {
    if (!sessionPlan || !selectedSession) {
      return null;
    }
    return sessionPlan.days.find((day) => day.id === selectedSession.workoutDayId) ?? null;
  }, [sessionPlan, selectedSession]);

  const exerciseNameLookup = useMemo(() => {
    const names = new Map<string, string>();
    if (sessionDay) {
      for (const block of sessionDay.blocks) {
        for (const exercise of block.exercises) {
          names.set(exercise.id, exercise.name);
        }
      }
    }
    return names;
  }, [sessionDay]);

  const formatDuration = (startedAt: string, endedAt?: string) => {
    if (!endedAt) {
      return 'In progress';
    }
    const durationMs = Date.parse(endedAt) - Date.parse(startedAt);
    if (Number.isNaN(durationMs) || durationMs <= 0) {
      return 'Unknown duration';
    }
    const totalMinutes = Math.round(durationMs / 60000);
    return `${totalMinutes} min`;
  };

  const formatSets = (
    exercise: Session['blocks'][number]['exercises'][number],
    day: WorkoutDay | null
  ) => {
    const planExercise = day
      ? day.blocks.flatMap((block) => block.exercises).find((item) => item.id === exercise.exerciseId)
      : null;
    const usesTime = Boolean(planExercise?.timeSeconds);
    return exercise.sets.map((set) => {
      const target = usesTime
        ? planExercise?.timeSeconds
          ? `${planExercise.timeSeconds}s`
          : 'n/a'
        : set.targetReps
          ? `${set.targetReps} reps`
          : 'n/a';
      const actual = usesTime
        ? set.actualTimeSeconds
          ? `${set.actualTimeSeconds}s`
          : 'n/a'
        : set.actualReps
          ? `${set.actualReps} reps`
          : 'n/a';
      return `Set ${set.setNumber}: target ${target}, actual ${actual}, ${
        set.completed ? 'completed' : 'skipped'
      }`;
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>History</Text>
      {completedSessions.length === 0 ? (
        <Text style={styles.statusText}>No completed sessions yet.</Text>
      ) : (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Completed Sessions</Text>
          {completedSessions.map((session) => (
            <TouchableOpacity
              key={session.id}
              style={styles.row}
              onPress={() => setSelectedSessionId(session.id)}>
              <Text style={styles.rowText}>
                {session.endedAt ? new Date(session.endedAt).toLocaleString() : 'Unknown date'}
              </Text>
              <Text style={styles.rowText}>{formatDuration(session.startedAt, session.endedAt)}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      {selectedSession ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Session Details</Text>
          <Text style={styles.rowText}>Started: {selectedSession.startedAt}</Text>
          <Text style={styles.rowText}>Ended: {selectedSession.endedAt}</Text>
          <Text style={styles.rowText}>Plan: {sessionPlan?.name ?? 'Unknown'}</Text>
          <Text style={styles.rowText}>Day: {sessionDay?.name ?? 'Unknown'}</Text>
          {selectedSession.blocks.map((block) => (
            <View key={block.blockId} style={styles.section}>
              <Text style={styles.sectionSubtitle}>Block {block.blockId}</Text>
              {block.exercises.map((exercise) => (
                <View key={exercise.exerciseId} style={styles.section}>
                  <Text style={styles.rowText}>
                    {exerciseNameLookup.get(exercise.exerciseId) ?? exercise.exerciseId}
                  </Text>
                  {formatSets(exercise, sessionDay).map((line) => (
                    <Text key={line} style={styles.detailText}>
                      {line}
                    </Text>
                  ))}
                </View>
              ))}
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  title: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
  },
  statusText: {
    textAlign: 'center',
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontWeight: '600',
  },
  sectionSubtitle: {
    fontWeight: '600',
  },
  row: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  rowText: {
    fontSize: 14,
  },
  detailText: {
    fontSize: 12,
    color: '#555',
  },
});
