import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { HistorySessionDetail } from '@/features/history/utils/history-view';
import { PrimaryText, SecondaryText, SectionTitle } from '@/components/ui/text';
import { Spacing } from '@/components/ui/spacing';

type HistoryDetailViewProps = {
  detail: HistorySessionDetail | null;
};

export function HistoryDetailView({ detail }: HistoryDetailViewProps) {
  if (!detail) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.container}>
          <SecondaryText>Session not found.</SecondaryText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.container} alwaysBounceVertical={false}>
        <View style={styles.section}>
          <SectionTitle>Session</SectionTitle>
          <View style={styles.metaRow}>
            <SecondaryText>Date</SecondaryText>
            <PrimaryText>{detail.dateLabel}</PrimaryText>
          </View>
          <View style={styles.metaRow}>
            <SecondaryText>Time</SecondaryText>
            <PrimaryText>{detail.timeRangeLabel}</PrimaryText>
          </View>
          <View style={styles.metaRow}>
            <SecondaryText>Duration</SecondaryText>
            <PrimaryText>{detail.durationLabel}</PrimaryText>
          </View>
          <View style={styles.metaRow}>
            <SecondaryText>Plan</SecondaryText>
            <PrimaryText>{detail.planName}</PrimaryText>
          </View>
          <View style={styles.metaRow}>
            <SecondaryText>Day</SecondaryText>
            <PrimaryText>{detail.dayName}</PrimaryText>
          </View>
        </View>
        <View style={styles.section}>
          <SectionTitle>Workout</SectionTitle>
          {detail.blocks.map((block) => (
            <View key={block.id} style={styles.blockSection}>
              <PrimaryText style={styles.blockTitle}>{block.title}</PrimaryText>
              {block.exercises.map((exercise) => (
                <View key={exercise.id} style={styles.exerciseRow}>
                  <PrimaryText>{exercise.name}</PrimaryText>
                  <SecondaryText>{exercise.summary}</SecondaryText>
                </View>
              ))}
            </View>
          ))}
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
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xxl,
    gap: Spacing.md,
  },
  section: {
    gap: Spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  blockSection: {
    gap: Spacing.sm,
  },
  blockTitle: {
    fontWeight: '600',
  },
  exerciseRow: {
    gap: Spacing.xs,
  },
});
