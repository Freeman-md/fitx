import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { useFocusEffect } from 'expo-router';

import type { WorkoutPlan } from '@/data/models';
import { loadWorkoutPlans, saveWorkoutPlans } from '@/data/storage';

export function usePlansList() {
  const [plans, setPlans] = useState<WorkoutPlan[]>([]);

  const loadPlans = useCallback(async () => {
    const storedPlans = await loadWorkoutPlans();
    setPlans(storedPlans);
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadPlans();
    }, [loadPlans])
  );

  const requestDeletePlan = (plan: WorkoutPlan) => {
    Alert.alert('Delete Plan', `Delete "${plan.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const nextPlans = plans.filter((item) => item.id !== plan.id);
          await saveWorkoutPlans(nextPlans);
          setPlans(nextPlans);
        },
      },
    ]);
  };

  return {
    plans,
    requestDeletePlan,
  };
}
