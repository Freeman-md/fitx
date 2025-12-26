import { useLocalSearchParams, useRouter } from 'expo-router';

import { PlanDaysView } from '@/features/plan/components/PlanDaysView';
import { usePlanDaysScreen } from '@/features/plan/hooks/use-plan-days-screen';

export default function PlanDaysScreen() {
  const router = useRouter();
  const { planId } = useLocalSearchParams<{ planId: string }>();
  const {
    plan,
    orderedDays,
    newDayName,
    setNewDayName,
    editingDay,
    beginDayEdit,
    setEditingName,
    addDayWithValidation,
    saveDayName,
    confirmDeleteDay,
    moveDay,
    cancelDayEdit,
  } = usePlanDaysScreen(planId);

  return (
    <PlanDaysView
      planName={plan?.name}
      gymType={plan?.gymType}
      days={orderedDays}
      editingDay={editingDay}
      newDayName={newDayName}
      onChangeNewDayName={setNewDayName}
      onAddDay={() => void addDayWithValidation()}
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
  );
}
