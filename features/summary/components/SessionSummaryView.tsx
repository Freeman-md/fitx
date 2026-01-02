import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { SummaryViewModel } from '@/features/summary/utils/summary-view';
import { Button } from '@/components/ui/button';
import { PageTitle, PrimaryText, SecondaryText, SectionTitle } from '@/components/ui/text';
import { Spacing } from '@/components/ui/spacing';

type SessionSummaryViewProps = {
  summary: SummaryViewModel | null;
  onBackToTrain: () => void;
  onViewHistory: () => void;
};

export function SessionSummaryView({
  summary,
  onBackToTrain,
  onViewHistory,
}: SessionSummaryViewProps) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.container} alwaysBounceVertical={false}>
        <PageTitle>Session Complete</PageTitle>
        {summary ? (
          <>
            <View style={styles.section}>
              <SectionTitle>Summary</SectionTitle>
              <PrimaryText>Plan: {summary.planName}</PrimaryText>
              <PrimaryText>Day: {summary.dayName}</PrimaryText>
              <PrimaryText>Duration: {summary.durationLabel}</PrimaryText>
            </View>
            <View style={styles.section}>
              <SectionTitle>Workout Recap</SectionTitle>
              {summary.recapItems.length === 0 ? (
                <SecondaryText>No exercises logged.</SecondaryText>
              ) : (
                summary.recapItems.map((item) => (
                  <View key={item.id} style={styles.recapRow}>
                    <PrimaryText>{item.name}</PrimaryText>
                    <SecondaryText>
                      {item.completedSets} completed · {item.skippedSets} skipped
                    </SecondaryText>
                  </View>
                ))
              )}
            </View>
          </>
        ) : (
          <SecondaryText>No completed session found.</SecondaryText>
        )}
        <View style={styles.actions}>
          <Button label="Back to Train" onPress={onBackToTrain} />
          <Button label="View History" onPress={onViewHistory} variant="secondary" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.md,
    gap: Spacing.lg,
    flexGrow: 1,
  },
  safeArea: {
    flex: 1,
  },
  section: {
    gap: Spacing.sm,
  },
  recapRow: {
    gap: Spacing.xs,
  },
  actions: {
    marginTop: 'auto',
    gap: Spacing.sm,
  },
});
