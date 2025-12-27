import { useEffect, useMemo, useState } from 'react';

import type { Session, WorkoutPlan } from '@/data/models';
import { loadSessions, loadWorkoutPlans } from '@/data/storage';
import { buildHistoryDetail } from '@/features/history/utils/history-view';

export function useHistoryDetail(sessionId: string | undefined) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [plans, setPlans] = useState<WorkoutPlan[]>([]);

  useEffect(() => {
    const loadHistorySources = async () => {
      const [storedSessions, storedPlans] = await Promise.all([
        loadSessions(),
        loadWorkoutPlans(),
      ]);
      setSessions(storedSessions);
      setPlans(storedPlans);
    };

    void loadHistorySources();
  }, []);

  const detail = useMemo(
    () => buildHistoryDetail(sessions, plans, sessionId ?? null),
    [sessions, plans, sessionId]
  );

  return { detail };
}
