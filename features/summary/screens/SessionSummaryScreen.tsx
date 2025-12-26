import { SessionSummaryView } from '@/features/summary/components/SessionSummaryView';
import { useSessionSummary } from '@/features/summary/hooks/use-session-summary';

export default function SessionSummaryScreen() {
  const { summary } = useSessionSummary();

  return <SessionSummaryView summary={summary} />;
}
