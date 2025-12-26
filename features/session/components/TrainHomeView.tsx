import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { WorkoutPlan } from '@/data/models';
import { Button } from '@/components/ui/button';
import { PageTitle, SecondaryText, SectionTitle } from '@/components/ui/text';
import { Spacing } from '@/components/ui/spacing';
import { PlanCard } from '@/features/session/components/PlanCard';
import { DayChip } from '@/features/session/components/DayChip';
import { TrainHomeEmptyState } from '@/features/session/components/TrainHomeEmptyState';

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
}: TrainHomeViewProps) {
  const hasPlans = plans.length > 0;
  const hasSelectedPlan = Boolean(selectedPlan);
  const hasSelectedDay = Boolean(selectedDayId);
  const startDisabled = !hasSelectedPlan || !hasSelectedDay;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container} alwaysBounceVertical={false}>
        <View style={styles.header}>
          <PageTitle>Train</PageTitle>
          <SecondaryText style={styles.subtitle}>Pick a plan and day to start.</SecondaryText>
        </View>

        {!hasPlans ? (
          <TrainHomeEmptyState
            title="No plans yet"
            description="Create a plan to start training."
            actionLabel="Create your first plan"
            onAction={onCreatePlan}
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
                <SecondaryText>Select a plan to see available days.</SecondaryText>
              ) : selectedPlan.days.length === 0 ? (
                <TrainHomeEmptyState
                  title="No days in this plan"
                  description="Add at least one day to start a session."
                  actionLabel="Add days to this plan"
                  onAction={onAddDays}
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
  },
  subtitle: {
    textAlign: 'center',
  },
  section: {
    gap: Spacing.sm,
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
