import { useRouter } from 'expo-router';

import { PlansListView } from '@/features/plan/components/PlansListView';
import { usePlansList } from '@/features/plan/hooks/use-plans-list';

export default function PlansListScreen() {
  const router = useRouter();
  const { plans, requestDeletePlan } = usePlansList();

  return (
    <PlansListView
      plans={plans}
      onCreatePlan={() => router.push('/plans/create')}
      onSelectPlan={(planId) => router.push(`/plans/${planId}`)}
      onDeletePlan={requestDeletePlan}
    />
  );
}
