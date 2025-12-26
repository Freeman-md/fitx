import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { HistoryListItem, HistorySessionDetail } from '@/features/history/utils/history-view';
import { PageTitle, PrimaryText, SecondaryText, SectionTitle } from '@/components/ui/text';
import { Spacing } from '@/components/ui/spacing';

type HistoryScreenViewProps = {
  sessionItems: HistoryListItem[];
  selectedSession: HistorySessionDetail | null;
  dividerColor: string;
  onSelectSession: (sessionId: string) => void;
};

export function HistoryScreenView({
  sessionItems,
  selectedSession,
  dividerColor,
  onSelectSession,
}: HistoryScreenViewProps) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container} alwaysBounceVertical={false}>
        <PageTitle>History</PageTitle>
        {sessionItems.length === 0 ? (
          <SecondaryText style={styles.centeredText}>No completed sessions yet.</SecondaryText>
        ) : (
          <View style={styles.section}>
            <SectionTitle>Completed Sessions</SectionTitle>
            {sessionItems.map((session) => (
              <TouchableOpacity
                key={session.id}
                style={[styles.row, { borderBottomColor: dividerColor }]}
                onPress={() => onSelectSession(session.id)}>
                <PrimaryText>{session.dateLabel}</PrimaryText>
                <PrimaryText>{session.durationLabel}</PrimaryText>
              </TouchableOpacity>
            ))}
          </View>
        )}
        {selectedSession ? (
          <View style={styles.section}>
            <PrimaryText>Started: {selectedSession.startedAt}</PrimaryText>
            <PrimaryText>Ended: {selectedSession.endedAt}</PrimaryText>
            <PrimaryText>Plan: {selectedSession.planName}</PrimaryText>
            <PrimaryText>Day: {selectedSession.dayName}</PrimaryText>
            {selectedSession.blocks.map((block) => (
              <View key={block.id} style={styles.section}>
                <SectionTitle>{block.title}</SectionTitle>
                {block.exercises.map((exercise) => (
                  <View key={exercise.id} style={styles.section}>
                    <PrimaryText>{exercise.name}</PrimaryText>
                    {exercise.setLines.map((line) => (
                      <SecondaryText key={line}>{line}</SecondaryText>
                    ))}
                  </View>
                ))}
              </View>
            ))}
          </View>
        ) : null}
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
  centeredText: {
    textAlign: 'center',
  },
  section: {
    gap: Spacing.sm,
  },
  row: {
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
  },
});
