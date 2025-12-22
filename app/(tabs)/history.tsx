import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { SessionStatus } from '@/data/models';
import type { Session, WorkoutDay, WorkoutPlan } from '@/data/models';
import { DetailText, RowText, SectionTitle, StatusText } from '@/components/ui/text';
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
        <StatusText>No completed sessions yet.</StatusText>
      ) : (
        <View style={styles.section}>
          <SectionTitle>Completed Sessions</SectionTitle>
          {completedSessions.map((session) => (
            <TouchableOpacity
              key={session.id}
              style={styles.row}
              onPress={() => setSelectedSessionId(session.id)}>
              <RowText>
                {session.endedAt ? new Date(session.endedAt).toLocaleString() : 'Unknown date'}
              </RowText>
              <RowText>{formatDuration(session.startedAt, session.endedAt)}</RowText>
            </TouchableOpacity>
          ))}
        </View>
      )}
      {selectedSession ? (
        <View style={styles.section}>
          <SectionTitle>Session Details</SectionTitle>
          <RowText>Started: {selectedSession.startedAt}</RowText>
          <RowText>Ended: {selectedSession.endedAt}</RowText>
          <RowText>Plan: {sessionPlan?.name ?? 'Unknown'}</RowText>
          <RowText>Day: {sessionDay?.name ?? 'Unknown'}</RowText>
          {selectedSession.blocks.map((block) => (
            <View key={block.blockId} style={styles.section}>
              <SectionTitle>Block {block.blockId}</SectionTitle>
              {block.exercises.map((exercise) => (
                <View key={exercise.exerciseId} style={styles.section}>
                  <RowText>
                    {exerciseNameLookup.get(exercise.exerciseId) ?? exercise.exerciseId}
                  </RowText>
                  {formatSets(exercise, sessionDay).map((line) => (
                    <DetailText key={line}>{line}</DetailText>
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
  section: {
    gap: 8,
  },
  row: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
});
