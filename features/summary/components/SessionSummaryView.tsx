import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { SummaryViewModel } from '@/features/summary/utils/summary-view';
import { RowText, SectionTitle } from '@/components/ui/text';

type SessionSummaryViewProps = {
  summary: SummaryViewModel | null;
  isDark: boolean;
};

export function SessionSummaryView({ summary, isDark }: SessionSummaryViewProps) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container} alwaysBounceVertical={false}>
        <Text style={[styles.pageTitle, isDark ? styles.pageTitleDark : null]}>
          Session Summary
        </Text>
        {summary ? (
          <View style={styles.section}>
            <RowText>Plan: {summary.planName}</RowText>
            <RowText>Day: {summary.dayName}</RowText>
            <RowText>Started: {summary.startedAt}</RowText>
            <RowText>Ended: {summary.endedAt}</RowText>
            <SectionTitle style={styles.sectionTitle}>Exercises Completed</SectionTitle>
            {summary.exerciseNames.map((name) => (
              <RowText key={name}>{name}</RowText>
            ))}
          </View>
        ) : (
          <RowText>No completed session found.</RowText>
        )}
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
  sectionTitle: {
    marginTop: 8,
  },
});
