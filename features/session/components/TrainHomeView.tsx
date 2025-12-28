import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';

import type { WorkoutPlan } from '@/data/models';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { SecondaryText, SectionTitle } from '@/components/ui/text';
import { Spacing } from '@/components/ui/spacing';
import { PlanCard } from '@/features/session/components/PlanCard';
import { DayChip } from '@/features/session/components/DayChip';

type TrainHomeViewProps = {
  plans: WorkoutPlan[];
  selectedPlan: WorkoutPlan | null;
  selectedDayId: string | null;
  onSelectPlan: (planId: string) => void;
  onSelectDay: (dayId: string) => void;
  onStartSession: () => void;
  onCreatePlan: () => void;
  onAddDays: () => void;
  startDisabledReason: string | null;
  onRefresh: () => void;
};

export function TrainHomeView({
  plans,
  selectedPlan,
  selectedDayId,
  onSelectPlan,
  onSelectDay,
  onStartSession,
  onCreatePlan,
  onAddDays,
  startDisabledReason,
  onRefresh,
}: TrainHomeViewProps) {
  const hasPlans = plans.length > 0;
  const hasSelectedPlan = Boolean(selectedPlan);
  const hasSelectedDay = Boolean(selectedDayId);
  const startDisabled = !hasSelectedPlan || !hasSelectedDay;
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
      <ScrollView
        contentContainerStyle={styles.container}
        alwaysBounceVertical
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={() => void handleRefresh()} />
        }>
        {hasPlans ? (
          <View style={styles.header}>
            <SecondaryText style={styles.subtitle}>Pick a plan and day to start.</SecondaryText>
          </View>
        ) : null}

        {!hasPlans ? (
          <EmptyState
            title="No plans yet"
            description="Create a plan to start training."
            actionLabel="Create your first plan"
            onAction={onCreatePlan}
            size="screen"
          />
        ) : (
          <>
            <View style={styles.section}>
              <SectionTitle>Plans</SectionTitle>
              {plans.map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  isSelected={selectedPlan?.id === plan.id}
                  onPress={() => onSelectPlan(plan.id)}
                />
              ))}
            </View>

            <View style={styles.section}>
              <SectionTitle>Days</SectionTitle>
              {!selectedPlan ? (
                <View style={styles.centeredHelper}>
                  <SecondaryText style={styles.centeredText}>
                    Select a plan to see available days.
                  </SecondaryText>
                </View>
              ) : selectedPlan.days.length === 0 ? (
                <EmptyState
                  title="No days in this plan"
                  description="Add at least one day to start a session."
                  actionLabel="Add days to this plan"
                  onAction={onAddDays}
                  size="section"
                />
              ) : (
                <View style={styles.dayList}>
                  {selectedPlan.days.map((day) => (
                    <DayChip
                      key={day.id}
                      day={day}
                      isSelected={selectedDayId === day.id}
                      onPress={() => onSelectDay(day.id)}
                    />
                  ))}
                </View>
              )}
            </View>
          </>
        )}

        <View style={styles.ctaSection}>
          <Button label="Start Session" onPress={onStartSession} disabled={startDisabled} />
          {startDisabledReason ? (
            <SecondaryText style={styles.ctaHint}>{startDisabledReason}</SecondaryText>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    padding: Spacing.md,
    gap: Spacing.lg,
    flexGrow: 1,
  },
  header: {
    gap: Spacing.xs,
    alignItems: 'center',
  },
  subtitle: {
    textAlign: 'center',
  },
  section: {
    gap: Spacing.sm,
  },
  centeredHelper: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
    paddingHorizontal: Spacing.md,
  },
  centeredText: {
    textAlign: 'center',
  },
  dayList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  ctaSection: {
    marginTop: 'auto',
    gap: Spacing.xs,
  },
  ctaHint: {
    textAlign: 'center',
  },
});
