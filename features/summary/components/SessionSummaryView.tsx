import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { SummaryViewModel } from '@/features/summary/utils/summary-view';
import { PageTitle, PrimaryText, SectionTitle } from '@/components/ui/text';
import { Spacing } from '@/components/ui/spacing';

type SessionSummaryViewProps = {
  summary: SummaryViewModel | null;
};

export function SessionSummaryView({ summary }: SessionSummaryViewProps) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container} alwaysBounceVertical={false}>
        <PageTitle>Session Summary</PageTitle>
        {summary ? (
          <View style={styles.section}>
            <PrimaryText>Plan: {summary.planName}</PrimaryText>
            <PrimaryText>Day: {summary.dayName}</PrimaryText>
            <PrimaryText>Started: {summary.startedAt}</PrimaryText>
            <PrimaryText>Ended: {summary.endedAt}</PrimaryText>
            <SectionTitle style={styles.sectionTitle}>Exercises Completed</SectionTitle>
            {summary.exerciseNames.map((name) => (
              <PrimaryText key={name}>{name}</PrimaryText>
            ))}
          </View>
        ) : (
          <PrimaryText>No completed session found.</PrimaryText>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.md,
    gap: Spacing.md,
  },
  safeArea: {
    flex: 1,
  },
  section: {
    gap: Spacing.sm,
  },
  sectionTitle: {
    marginTop: Spacing.sm,
  },
});
