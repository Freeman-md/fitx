import { useEffect, useMemo, useState } from 'react';

import type { Session, WorkoutPlan } from '@/data/models';
import { loadSessions, loadWorkoutPlans } from '@/data/storage';
import { buildHistoryViewModel } from '@/features/history/utils/history-view';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function useHistoryScreen() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [plans, setPlans] = useState<WorkoutPlan[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const dividerColor = isDark ? '#374151' : '#ddd';

  useEffect(() => {
    const loadData = async () => {
      const [storedSessions, storedPlans] = await Promise.all([
        loadSessions(),
        loadWorkoutPlans(),
      ]);
      setSessions(storedSessions);
      setPlans(storedPlans);
    };

    void loadData();
  }, []);

  const viewModel = useMemo(
    () => buildHistoryViewModel(sessions, plans, selectedSessionId),
    [sessions, plans, selectedSessionId]
  );

  return {
    listItems: viewModel.listItems,
    selectedSession: viewModel.selectedDetail,
    selectSession: setSelectedSessionId,
    isDark,
    dividerColor,
  };
}
