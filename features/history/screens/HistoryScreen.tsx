import { HistoryScreenView } from '@/features/history/components/HistoryScreenView';
import { useHistoryScreen } from '@/features/history/hooks/use-history-screen';

export default function HistoryScreen() {
  const { sessionItems, selectedSession, selectSession, isDark, dividerColor } =
    useHistoryScreen();

  return (
    <HistoryScreenView
      sessionItems={sessionItems}
      selectedSession={selectedSession}
      isDark={isDark}
      dividerColor={dividerColor}
      onSelectSession={selectSession}
    />
  );
}
