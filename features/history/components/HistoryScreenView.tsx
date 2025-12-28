import { Pressable, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';

import type { HistoryListItem } from '@/features/history/utils/history-view';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { PageTitle, PrimaryText, SecondaryText } from '@/components/ui/text';
import { Spacing } from '@/components/ui/spacing';
import { useColorScheme } from '@/hooks/use-color-scheme';

type HistoryScreenViewProps = {
  sessionItems: HistoryListItem[];
  onSelectSession: (sessionId: string) => void;
  onRefresh: () => void;
};

export function HistoryScreenView({
  sessionItems,
  onSelectSession,
  onRefresh,
}: HistoryScreenViewProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.resolve(onRefresh());
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.container}
        alwaysBounceVertical
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={() => void handleRefresh()} />
        }>
        <View style={[styles.titleBadge, isDark ? styles.titleBadgeDark : styles.titleBadgeLight]}>
          <PageTitle style={styles.titleText}>History</PageTitle>
        </View>
        {sessionItems.length === 0 ? (
          <EmptyState
            title="No completed sessions yet"
            description="Finished workouts will appear here for easy review."
            size="screen"
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
    flexGrow: 1,
  },
  safeArea: {
    flex: 1,
  },
  titleBadge: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xs,
    borderRadius: 999,
    alignSelf: 'center',
  },
  titleBadgeLight: {
    backgroundColor: '#f1f5f9',
  },
  titleBadgeDark: {
    backgroundColor: '#1f2937',
  },
  titleText: {
    fontSize: 20,
    fontWeight: '700',
    opacity: 1,
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
