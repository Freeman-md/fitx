import { Pressable, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';

import type { WorkoutPlan } from '@/data/models';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { PrimaryText, SecondaryText, SectionTitle } from '@/components/ui/text';
import { Spacing } from '@/components/ui/spacing';
import { Weekdays } from '@/data/models';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type TrainHomeViewProps = {
  plans: WorkoutPlan[];
  selectedPlan: WorkoutPlan | null;
  selectedDayId: string | null;
  onSelectPlan: (planId: string) => void;
  onSelectDay: (dayId: string) => void;
  onStartSession: () => void;
  onCreatePlan: () => void;
  onViewPlans: () => void;
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
  onViewPlans,
  startDisabledReason,
  onRefresh,
}: TrainHomeViewProps) {
  const hasPlans = plans.length > 0;
  const hasSelectedDay = Boolean(selectedDayId);
  const startDisabled = !hasSelectedDay;
  const [isRefreshing, setIsRefreshing] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const highlightColor = isDark ? Colors.dark.tint : Colors.light.tint;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.resolve(onRefresh());
    } finally {
      setIsRefreshing(false);
    }
  };

  const weekdayLabel = (() => {
    const today = new Date().getDay();
    if (today === 0) {
      return 'Sunday';
    }
    return Weekdays[today - 1] ?? 'Monday';
  })();

  const plansForToday = plans
    .map((plan) => ({
      plan,
      days: plan.days.filter((day) => day.weekday === weekdayLabel),
    }))
    .filter((item) => item.days.length > 0);

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.container}
        alwaysBounceVertical
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={() => void handleRefresh()} />
        }>
        <View style={styles.header}>
          <PrimaryText style={styles.weekday}>{weekdayLabel}</PrimaryText>
          <SecondaryText style={styles.subtitle}>What are you training today?</SecondaryText>
        </View>

        {!hasPlans ? (
          <EmptyState
            title="No plans yet"
            description="Create a plan to start training."
            actionLabel="Create your first plan"
            onAction={onCreatePlan}
            size="screen"
          />
        ) : plansForToday.length === 0 ? (
          <EmptyState
            title="No workouts scheduled for today"
            description="Check your plans to schedule a workout."
            actionLabel="View all plans"
            onAction={onViewPlans}
            actionVariant="secondary"
            size="screen"
          />
        ) : (
          <>
            {plansForToday.map(({ plan, days }) => (
              <View key={plan.id} style={styles.section}>
                <SectionTitle>{plan.name}</SectionTitle>
                <View style={styles.dayList}>
                  {days.map((day) => {
                    const isSelected =
                      selectedPlan?.id === plan.id && selectedDayId === day.id;
                    return (
                      <Pressable
                        key={day.id}
                        accessibilityRole="button"
                        onPress={() => {
                          onSelectPlan(plan.id);
                          onSelectDay(day.id);
                        }}
                        style={({ pressed }) => [
                          styles.dayPressable,
                          pressed && styles.dayPressed,
                        ]}>
                        <Card
                          style={[
                            styles.dayCard,
                            isSelected ? { borderColor: highlightColor } : null,
                          ]}>
                          <PrimaryText style={styles.dayTitle}>{day.name}</PrimaryText>
                          <SecondaryText style={styles.dayMeta}>{plan.name}</SecondaryText>
                        </Card>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            ))}
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
  weekday: {
    fontSize: 20,
    fontWeight: '700',
  },
  subtitle: {
    textAlign: 'center',
  },
  section: {
    gap: Spacing.sm,
  },
  dayList: {
    gap: Spacing.sm,
  },
  dayPressable: {
    borderRadius: 14,
  },
  dayPressed: {
    opacity: 0.9,
  },
  dayCard: {
    borderWidth: 2,
  },
  dayTitle: {
    fontWeight: '600',
  },
  dayMeta: {
    opacity: 0.75,
  },
  ctaSection: {
    marginTop: 'auto',
    gap: Spacing.xs,
  },
  ctaHint: {
    textAlign: 'center',
  },
});
