import { Stack, useLocalSearchParams, useRouter } from 'expo-router';

import { PlanDaysView } from '@/features/plan/components/PlanDaysView';
import { usePlanDaysScreen } from '@/features/plan/hooks/use-plan-days-screen';

export default function PlanDaysScreen() {
  const router = useRouter();
  const { planId } = useLocalSearchParams<{ planId: string }>();
  const {
    plan,
    orderedDays,
    editingDay,
    beginDayEdit,
    setEditingName,
    saveDayName,
    confirmDeleteDay,
    moveDay,
    cancelDayEdit,
  } = usePlanDaysScreen(planId);

  return (
    <>
      <Stack.Screen
        options={{
          title: plan?.name ? `Plan: ${plan.name}` : 'Plan',
          headerBackTitle: 'Back',
          headerBackTitleVisible: true,
        }}
      />
      <PlanDaysView
        planName={plan?.name}
        gymType={plan?.gymType}
        days={orderedDays}
        editingDay={editingDay}
        onAddDay={() => router.push(`/plans/${planId}/days/create`)}
        onChangeEditingName={setEditingName}
        onCancelEdit={cancelDayEdit}
        onSaveEdit={() => void saveDayName()}
        onMoveDayUp={(dayId) => void moveDay(dayId, 'up')}
        onMoveDayDown={(dayId) => void moveDay(dayId, 'down')}
        onOpenBlocks={(dayId) => router.push(`/plans/${planId}/days/${dayId}`)}
        onStartEdit={beginDayEdit}
        onDeleteDay={confirmDeleteDay}
        onBack={() => router.back()}
        isMissing={!plan}
      />
    </>
  );
}
