import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { session, workoutPlan } from '@/data/sample-data';
import {
  loadActiveSession,
  loadSessions,
  loadWorkoutPlans,
  saveSession,
  saveWorkoutPlans,
} from '@/data/storage';

export default function PlansScreen() {
  useEffect(() => {
    const validateStorage = async () => {
      await saveWorkoutPlans([workoutPlan]);
      await saveSession(session);

      const storedPlans = await loadWorkoutPlans();
      const storedSessions = await loadSessions();
      const activeSession = await loadActiveSession();

      // eslint-disable-next-line no-console
      console.log('storage check', { storedPlans, storedSessions, activeSession });
    };

    void validateStorage();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Plans</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
