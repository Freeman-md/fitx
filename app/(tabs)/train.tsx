import { useEffect, useMemo, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

import type { Session, WorkoutPlan } from '@/data/models';
import { startSession } from '@/data/session';
import { loadActiveSession, loadWorkoutPlans } from '@/data/storage';

export default function TrainScreen() {
  const [plans, setPlans] = useState<WorkoutPlan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [activeSession, setActiveSession] = useState<Session | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const storedPlans = await loadWorkoutPlans();
      const storedActiveSession = await loadActiveSession();
      setPlans(storedPlans);
      setActiveSession(storedActiveSession);

      // eslint-disable-next-line no-console
      console.log('active session check', storedActiveSession);
    };

    void loadData();
  }, []);

  const selectedPlan = useMemo(
    () => plans.find((plan) => plan.id === selectedPlanId) ?? null,
    [plans, selectedPlanId]
  );

  const handleStartSession = async (plan: WorkoutPlan, dayId: string) => {
    const day = plan.days.find((item) => item.id === dayId);
    if (!day) {
      return;
    }

    const session = await startSession(plan, day);
    setActiveSession(session);

    // eslint-disable-next-line no-console
    console.log('session started', session);
  };

  return (
    <View style={styles.container}>
      <Text>Train</Text>
      {activeSession ? (
        <Text style={styles.statusText}>Active session: {activeSession.id}</Text>
      ) : (
        <Text style={styles.statusText}>No active session</Text>
      )}
      {plans.length === 0 ? (
        <Text style={styles.statusText}>No plans available</Text>
      ) : (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Plans</Text>
          {plans.map((plan) => (
            <View key={plan.id} style={styles.row}>
              <Text style={styles.rowText}>{plan.name}</Text>
              <Button title="Select" onPress={() => setSelectedPlanId(plan.id)} />
            </View>
          ))}
        </View>
      )}
      {selectedPlan ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{selectedPlan.name} Days</Text>
          {selectedPlan.days.map((day) => (
            <View key={day.id} style={styles.row}>
              <Text style={styles.rowText}>{day.name}</Text>
              <Button title="Start Session" onPress={() => handleStartSession(selectedPlan, day.id)} />
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
    justifyContent: 'center',
    padding: 16,
    gap: 16,
  },
  statusText: {
    textAlign: 'center',
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  rowText: {
    flex: 1,
  },
});
