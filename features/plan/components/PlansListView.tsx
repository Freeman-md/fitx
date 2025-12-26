import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { WorkoutPlan } from '@/data/models';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Fab } from '@/components/ui/fab';
import { PageTitle, PrimaryText, SecondaryText } from '@/components/ui/text';
import { Spacing } from '@/components/ui/spacing';

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
      <View style={styles.screen}>
        <ScrollView contentContainerStyle={styles.container} alwaysBounceVertical={false}>
          <PageTitle>Plans</PageTitle>
          {plans.length === 0 ? (
            <SecondaryText style={styles.centeredText}>No plans available.</SecondaryText>
          ) : (
            <View style={styles.section}>
              {plans.map((plan) => (
                <Card key={plan.id}>
                  <View style={styles.row}>
                    <Pressable style={styles.rowText} onPress={() => onSelectPlan(plan.id)}>
                      <PrimaryText style={styles.planName}>{plan.name}</PrimaryText>
                      {plan.gymType ? (
                        <SecondaryText style={styles.planMeta}>{plan.gymType}</SecondaryText>
                      ) : null}
                    </Pressable>
                    <Button
                      label="Delete"
                      variant="destructive"
                      size="compact"
                      onPress={() => onDeletePlan(plan)}
                    />
                  </View>
                </Card>
              ))}
            </View>
          )}
        </ScrollView>
        <Fab accessibilityLabel="Add plan" label="New Plan" onPress={onCreatePlan} />
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
  section: {
    gap: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  rowText: {
    flex: 1,
    gap: Spacing.xs,
  },
  planName: {
    fontWeight: '600',
  },
  centeredText: {
    textAlign: 'center',
  },
});
