import { Stack, useLocalSearchParams } from 'expo-router';

import { HistoryDetailView } from '@/features/history/components/HistoryDetailView';
import { useHistoryDetail } from '@/features/history/hooks/use-history-detail';

export default function HistoryDetailScreen() {
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  const { detail } = useHistoryDetail(sessionId);

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Session Details',
          headerBackTitle: 'Back',
          headerBackTitleVisible: true,
        }}
      />
      <HistoryDetailView detail={detail} />
    </>
  );
}
