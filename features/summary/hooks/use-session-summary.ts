import { useEffect, useState } from 'react';

import { loadLastCompletedSessionId, loadSessions, loadWorkoutPlans } from '@/data/storage';
import { resolveSummarySources } from '@/features/summary/utils/summary-selectors';
import { buildSummaryViewModel, type SummaryViewModel } from '@/features/summary/utils/summary-view';

export function useSessionSummary() {
  const [summary, setSummary] = useState<SummaryViewModel | null>(null);

  useEffect(() => {
    const loadSummaryData = async () => {
      const sessionId = await loadLastCompletedSessionId();
      if (!sessionId) {
        return;
      }

      const [sessions, plans] = await Promise.all([loadSessions(), loadWorkoutPlans()]);
      const { session, plan, day } = resolveSummarySources(sessions, plans, sessionId);
      if (!session) {
        return;
      }
      setSummary(buildSummaryViewModel(session, plan, day));
    };

    void loadSummaryData();
  }, []);

  return { summary };
}
