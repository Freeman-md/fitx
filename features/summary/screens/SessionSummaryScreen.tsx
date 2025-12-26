import { useRouter } from 'expo-router';

import { SessionSummaryView } from '@/features/summary/components/SessionSummaryView';
import { useSessionSummary } from '@/features/summary/hooks/use-session-summary';

export default function SessionSummaryScreen() {
  const router = useRouter();
  const { summary } = useSessionSummary();

  return (
    <SessionSummaryView
      summary={summary}
      onBackToTrain={() => router.push('/(tabs)/train')}
      onViewHistory={() => router.push('/(tabs)/history')}
    />
  );
}
