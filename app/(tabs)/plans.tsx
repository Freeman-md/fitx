import { useCallback, useState } from 'react';
import { Alert, Button, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useRouter } from 'expo-router';

import type { WorkoutPlan } from '@/data/models';
import { loadWorkoutPlans, saveWorkoutPlans } from '@/data/storage';

export default function PlansScreen() {
  const router = useRouter();
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

  const confirmDelete = (plan: WorkoutPlan) => {
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

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container} alwaysBounceVertical={false}>
        <Text style={styles.title}>Plans</Text>
        <Button title="New Plan" onPress={() => router.push('/plans/create')} />
        {plans.length === 0 ? (
          <Text>No plans available.</Text>
        ) : (
          <View style={styles.section}>
            {plans.map((plan) => (
              <View key={plan.id} style={styles.row}>
                <Pressable
                  style={styles.rowText}
                  onPress={() => router.push(`/plans/${plan.id}`)}>
                  <Text style={styles.planName}>{plan.name}</Text>
                  {plan.gymType ? <Text style={styles.planMeta}>{plan.gymType}</Text> : null}
                </Pressable>
                <Button title="Delete" onPress={() => confirmDelete(plan)} />
              </View>
            ))}
          </View>
        )}
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
  section: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  rowText: {
    flex: 1,
    gap: 4,
  },
  planName: {
    fontSize: 16,
    fontWeight: '600',
  },
  planMeta: {
    fontSize: 13,
    opacity: 0.7,
  },
});
