import { Button, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { WorkoutPlan } from '@/data/models';

type PlansListViewProps = {
  plans: WorkoutPlan[];
  onCreatePlan: () => void;
  onSelectPlan: (planId: string) => void;
  onDeletePlan: (plan: WorkoutPlan) => void;
};

export function PlansListView({
  plans,
  onCreatePlan,
  onSelectPlan,
  onDeletePlan,
}: PlansListViewProps) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container} alwaysBounceVertical={false}>
        <Text style={styles.title}>Plans</Text>
        <Button title="New Plan" onPress={onCreatePlan} />
        {plans.length === 0 ? (
          <Text>No plans available.</Text>
        ) : (
          <View style={styles.section}>
            {plans.map((plan) => (
              <View key={plan.id} style={styles.row}>
                <Pressable style={styles.rowText} onPress={() => onSelectPlan(plan.id)}>
                  <Text style={styles.planName}>{plan.name}</Text>
                  {plan.gymType ? <Text style={styles.planMeta}>{plan.gymType}</Text> : null}
                </Pressable>
                <Button title="Delete" onPress={() => onDeletePlan(plan)} />
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
