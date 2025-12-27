import { ScrollView, StyleSheet, Text, View } from 'react-native';
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

  const renderSetLine = (line: string) => {
    const [setSegment, targetSegment, actualSegment, statusSegment] = line.split(' · ');
    if (!setSegment || !targetSegment || !actualSegment || !statusSegment) {
      return (
        <PrimaryText style={styles.setLine}>
          <Text style={styles.setLineMuted}>{line}</Text>
        </PrimaryText>
      );
    }

    const [targetLabel, ...targetValueParts] = targetSegment.split(' ');
    const [actualLabel, ...actualValueParts] = actualSegment.split(' ');
    const targetValue = targetValueParts.join(' ');
    const actualValue = actualValueParts.join(' ');
    const statusStyle =
      statusSegment === 'Skipped' ? styles.setLineStatusSkipped : styles.setLineStatusCompleted;

    return (
      <PrimaryText style={styles.setLine}>
        <Text style={styles.setLineLabel}>{setSegment}</Text>
        <Text style={styles.setLineSeparator}> · </Text>
        <Text style={styles.setLineMuted}>{targetLabel} </Text>
        <Text style={styles.setLineValue}>{targetValue}</Text>
        <Text style={styles.setLineSeparator}> · </Text>
        <Text style={styles.setLineMuted}>{actualLabel} </Text>
        <Text style={styles.setLineValue}>{actualValue}</Text>
        <Text style={styles.setLineSeparator}> · </Text>
        <Text style={statusStyle}>{statusSegment}</Text>
      </PrimaryText>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.container} alwaysBounceVertical={false}>
        <View style={styles.section}>
          <SectionTitle style={styles.sectionTitle}>Session</SectionTitle>
          <View style={styles.metaRow}>
            <SecondaryText style={styles.metaLabel}>Date</SecondaryText>
            <PrimaryText style={styles.metaValue}>{detail.dateLabel}</PrimaryText>
          </View>
          <View style={styles.metaRow}>
            <SecondaryText style={styles.metaLabel}>Time</SecondaryText>
            <PrimaryText style={styles.metaValue}>{detail.timeRangeLabel}</PrimaryText>
          </View>
          <View style={styles.metaRow}>
            <SecondaryText style={styles.metaLabel}>Duration</SecondaryText>
            <PrimaryText style={[styles.metaValue, styles.metaValueStrong]}>
              {detail.durationLabel}
            </PrimaryText>
          </View>
          <View style={styles.metaRow}>
            <SecondaryText style={styles.metaLabel}>Plan</SecondaryText>
            <PrimaryText style={styles.metaValue}>{detail.planName}</PrimaryText>
          </View>
          <View style={styles.metaRow}>
            <SecondaryText style={styles.metaLabel}>Day</SecondaryText>
            <PrimaryText style={styles.metaValue}>{detail.dayName}</PrimaryText>
          </View>
        </View>
        <View style={styles.section}>
          <SectionTitle style={styles.sectionTitle}>Workout</SectionTitle>
          {detail.blocks.map((block, index) => (
            <View
              key={block.id}
              style={[styles.blockSection, index > 0 ? styles.blockSpacing : null]}>
              <PrimaryText style={styles.blockTitle}>{block.title}</PrimaryText>
              {block.exercises.map((exercise) => (
                <View key={exercise.id} style={styles.exerciseSection}>
                  <View style={styles.exerciseHeader}>
                    <PrimaryText style={styles.exerciseName}>{exercise.name}</PrimaryText>
                    <SecondaryText style={styles.exerciseType}>{exercise.typeLabel}</SecondaryText>
                  </View>
                  {exercise.setLines.map((line) => (
                    <View key={line} style={styles.setLineRow}>
                      {renderSetLine(line)}
                    </View>
                  ))}
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
  sectionTitle: {
    fontSize: 15,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  metaLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  metaValue: {
    fontSize: 15,
    fontWeight: '500',
  },
  metaValueStrong: {
    fontSize: 16,
    fontWeight: '700',
  },
  blockSection: {
    gap: Spacing.sm,
  },
  blockSpacing: {
    paddingTop: Spacing.md,
  },
  blockTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  exerciseSection: {
    gap: Spacing.xs,
  },
  exerciseHeader: {
    gap: 2,
  },
  exerciseName: {
    fontSize: 15,
    fontWeight: '600',
  },
  exerciseType: {
    fontSize: 12,
    opacity: 0.7,
  },
  setLineRow: {
    paddingVertical: Spacing.xs,
  },
  setLine: {
    fontSize: 14,
    lineHeight: 20,
  },
  setLineLabel: {
    fontWeight: '600',
  },
  setLineValue: {
    fontWeight: '600',
  },
  setLineMuted: {
    opacity: 0.7,
  },
  setLineSeparator: {
    opacity: 0.5,
  },
  setLineStatusCompleted: {
    fontWeight: '600',
  },
  setLineStatusSkipped: {
    opacity: 0.6,
  },
});
