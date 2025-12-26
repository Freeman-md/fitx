import { HistoryScreenView } from '@/features/history/components/HistoryScreenView';
import { useHistoryScreen } from '@/features/history/hooks/use-history-screen';

export default function HistoryScreen() {
  const { listItems, selectedSession, selectSession, isDark, dividerColor } = useHistoryScreen();

  return (
    <HistoryScreenView
      listItems={listItems}
      selectedSession={selectedSession}
      isDark={isDark}
      dividerColor={dividerColor}
      onSelectSession={selectSession}
    />
  );
}
