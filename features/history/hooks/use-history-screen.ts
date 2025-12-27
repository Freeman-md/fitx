import { useCallback, useEffect, useMemo, useState } from 'react';

import type { Session, WorkoutPlan } from '@/data/models';
import { loadSessions, loadWorkoutPlans } from '@/data/storage';
import { buildHistoryListItems } from '@/features/history/utils/history-view';

export function useHistoryScreen() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [plans, setPlans] = useState<WorkoutPlan[]>([]);

  const refreshHistory = useCallback(async () => {
    const [storedSessions, storedPlans] = await Promise.all([
      loadSessions(),
      loadWorkoutPlans(),
    ]);
    setSessions(storedSessions);
    setPlans(storedPlans);
  }, []);

  useEffect(() => {
    void refreshHistory();
  }, [refreshHistory]);

  const listItems = useMemo(() => buildHistoryListItems(sessions, plans), [sessions, plans]);

  return {
    sessionItems: listItems,
    refreshHistory,
  };
}
