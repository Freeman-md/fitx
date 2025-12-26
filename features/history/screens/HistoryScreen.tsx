import { HistoryScreenView } from '@/features/history/components/HistoryScreenView';
import { useHistoryScreen } from '@/features/history/hooks/use-history-screen';

export default function HistoryScreen() {
  const { sessionItems, selectedSession, selectSession, dividerColor } = useHistoryScreen();

  return (
    <HistoryScreenView
      sessionItems={sessionItems}
      selectedSession={selectedSession}
      dividerColor={dividerColor}
      onSelectSession={selectSession}
    />
  );
}
