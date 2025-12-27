import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { HistoryListItem } from '@/features/history/utils/history-view';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { PageTitle, PrimaryText, SecondaryText } from '@/components/ui/text';
import { Spacing } from '@/components/ui/spacing';

type HistoryScreenViewProps = {
  sessionItems: HistoryListItem[];
  onSelectSession: (sessionId: string) => void;
};

export function HistoryScreenView({
  sessionItems,
  onSelectSession,
}: HistoryScreenViewProps) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container} alwaysBounceVertical={false}>
        <PageTitle>History</PageTitle>
        {sessionItems.length === 0 ? (
          <EmptyState
            title="No completed sessions yet"
            description="Finished workouts will appear here for easy review."
          />
        ) : (
          <View style={styles.section}>
            {sessionItems.map((session) => (
              <Pressable
                key={session.id}
                onPress={() => onSelectSession(session.id)}
                style={({ pressed }) => [styles.rowPressable, pressed && styles.rowPressed]}>
                <Card style={styles.rowCard}>
                  <View style={styles.row}>
                    <View style={styles.rowInfo}>
                      <PrimaryText>{session.dateLabel}</PrimaryText>
                      <SecondaryText>{`${session.planName} · ${session.dayName}`}</SecondaryText>
                    </View>
                    <PrimaryText>{session.durationLabel}</PrimaryText>
                  </View>
                </Card>
              </Pressable>
            ))}
          </View>
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
  rowPressable: {
    borderRadius: 12,
  },
  rowPressed: {
    opacity: 0.9,
  },
  rowCard: {
    borderWidth: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  rowInfo: {
    flex: 1,
    gap: Spacing.xs,
  },
});
