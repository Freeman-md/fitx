import { SessionSummaryView } from '@/features/summary/components/SessionSummaryView';
import { useSessionSummary } from '@/features/summary/hooks/use-session-summary';

export default function SessionSummaryScreen() {
  const { summary, isDark } = useSessionSummary();

  return <SessionSummaryView summary={summary} isDark={isDark} />;
}
