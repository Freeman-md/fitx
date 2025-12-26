import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { WorkoutDay } from '@/data/models';
import { DayCard } from '@/features/plan/components/DayCard';
import { Button } from '@/components/ui/button';
import { Fab } from '@/components/ui/fab';
import { PageTitle, SecondaryText, SectionTitle } from '@/components/ui/text';
import { Spacing } from '@/components/ui/spacing';

type PlanDaysViewProps = {
  planName?: string;
  gymType?: string;
  days: WorkoutDay[];
  onAddDay: () => void;
  onMoveDayUp: (dayId: string) => void;
  onMoveDayDown: (dayId: string) => void;
  onOpenBlocks: (dayId: string) => void;
  onEditDay: (dayId: string, dayName: string) => void;
  onBack: () => void;
  isMissing: boolean;
};

export function PlanDaysView({
  planName,
  gymType,
  days,
  onAddDay,
  onMoveDayUp,
  onMoveDayDown,
  onOpenBlocks,
  onEditDay,
  onBack,
  isMissing,
}: PlanDaysViewProps) {
  if (isMissing) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.container}>
          <SecondaryText>Plan not found.</SecondaryText>
          <Button label="Back to Plans" onPress={onBack} variant="secondary" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.screen}>
        <ScrollView contentContainerStyle={styles.container} alwaysBounceVertical={false}>
          <View style={styles.context}>
            <PageTitle style={styles.planName}>{planName}</PageTitle>
            {gymType ? <SecondaryText style={styles.subtitle}>{gymType}</SecondaryText> : null}
          </View>
          <View style={styles.section}>
            <SectionTitle>Days</SectionTitle>
            <SecondaryText>Tap a day to edit its blocks.</SecondaryText>
          </View>
          <View style={styles.section}>
            {days.length === 0 ? (
              <SecondaryText style={styles.centeredText}>No days yet.</SecondaryText>
            ) : (
              days.map((day) => (
                <DayCard
                  key={day.id}
                  day={day}
                  onMoveUp={() => onMoveDayUp(day.id)}
                  onMoveDown={() => onMoveDayDown(day.id)}
                  onOpenBlocks={() => onOpenBlocks(day.id)}
                  onEdit={() => onEditDay(day.id, day.name)}
                />
              ))
            )}
          </View>
        </ScrollView>
        <Fab accessibilityLabel="Add day" label="New Day" onPress={onAddDay} />
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
  context: {
    gap: Spacing.xs,
  },
  planName: {
    textAlign: 'left',
    opacity: 1,
  },
  section: {
    gap: Spacing.sm,
  },
  subtitle: {
    opacity: 0.75,
  },
  centeredText: {
    textAlign: 'center',
  },
});
