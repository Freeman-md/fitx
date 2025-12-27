import { useRouter } from 'expo-router';

import { HistoryScreenView } from '@/features/history/components/HistoryScreenView';
import { useHistoryScreen } from '@/features/history/hooks/use-history-screen';

export default function HistoryScreen() {
  const router = useRouter();
  const { sessionItems } = useHistoryScreen();

  return (
    <HistoryScreenView
      sessionItems={sessionItems}
      onSelectSession={(sessionId) => router.push(`/history/${sessionId}`)}
    />
  );
}
