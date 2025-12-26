import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { HistoryListItem, HistorySessionDetail } from '@/features/history/utils/history-view';
import { DetailText, RowText, SectionTitle, StatusText } from '@/components/ui/text';

type HistoryScreenViewProps = {
  sessionItems: HistoryListItem[];
  selectedSession: HistorySessionDetail | null;
  isDark: boolean;
  dividerColor: string;
  onSelectSession: (sessionId: string) => void;
};

export function HistoryScreenView({
  sessionItems,
  selectedSession,
  isDark,
  dividerColor,
  onSelectSession,
}: HistoryScreenViewProps) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container} alwaysBounceVertical={false}>
        <Text style={[styles.pageTitle, isDark ? styles.pageTitleDark : null]}>
          History
        </Text>
        {sessionItems.length === 0 ? (
          <StatusText>No completed sessions yet.</StatusText>
        ) : (
          <View style={styles.section}>
            <SectionTitle>Completed Sessions</SectionTitle>
            {sessionItems.map((session) => (
              <TouchableOpacity
                key={session.id}
                style={[styles.row, { borderBottomColor: dividerColor }]}
                onPress={() => onSelectSession(session.id)}>
                <RowText>{session.dateLabel}</RowText>
                <RowText>{session.durationLabel}</RowText>
              </TouchableOpacity>
            ))}
          </View>
        )}
        {selectedSession ? (
          <View style={styles.section}>
            <RowText>Started: {selectedSession.startedAt}</RowText>
            <RowText>Ended: {selectedSession.endedAt}</RowText>
            <RowText>Plan: {selectedSession.planName}</RowText>
            <RowText>Day: {selectedSession.dayName}</RowText>
            {selectedSession.blocks.map((block) => (
              <View key={block.id} style={styles.section}>
                <SectionTitle>{block.title}</SectionTitle>
                {block.exercises.map((exercise) => (
                  <View key={exercise.id} style={styles.section}>
                    <RowText>{exercise.name}</RowText>
                    {exercise.setLines.map((line) => (
                      <DetailText key={line}>{line}</DetailText>
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
    padding: 16,
    gap: 16,
  },
  safeArea: {
    flex: 1,
  },
  pageTitle: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    opacity: 0.7,
  },
  pageTitleDark: {
    color: '#ECEDEE',
  },
  section: {
    gap: 8,
  },
  row: {
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
});
