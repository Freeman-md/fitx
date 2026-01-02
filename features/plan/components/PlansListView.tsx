import { Pressable, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';

import type { WorkoutPlan } from '@/data/models';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Fab } from '@/components/ui/fab';
import { PageTitle, PrimaryText, SecondaryText } from '@/components/ui/text';
import { Spacing } from '@/components/ui/spacing';

type PlansListViewProps = {
  plans: WorkoutPlan[];
  onCreatePlan: () => void;
  onSelectPlan: (planId: string) => void;
  onDeletePlan: (plan: WorkoutPlan) => void;
  onRefresh: () => void;
  onOpenAccount: () => void;
};

export function PlansListView({
  plans,
  onCreatePlan,
  onSelectPlan,
  onDeletePlan,
  onRefresh,
  onOpenAccount,
}: PlansListViewProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.resolve(onRefresh());
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <View style={styles.screen}>
        <ScrollView
          contentContainerStyle={styles.container}
          alwaysBounceVertical
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={() => void handleRefresh()} />
          }>
          <View style={styles.headerRow}>
            <PageTitle>Plans</PageTitle>
            <Button
              label="Account"
              variant="secondary"
              size="compact"
              onPress={onOpenAccount}
            />
          </View>
          {plans.length === 0 ? (
            <EmptyState
              title="No plans yet"
              description="Build your first training plan to see it here."
              actionLabel="Create your first plan"
              onAction={onCreatePlan}
              size="screen"
            />
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
        {plans.length > 0 ? (
          <Fab accessibilityLabel="Add plan" label="New Plan" onPress={onCreatePlan} />
        ) : null}
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
    flexGrow: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
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
});
