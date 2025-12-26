import { useEffect, useState } from 'react';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';

import { BottomSheet } from '@/components/ui/bottom-sheet';
import { FormFooter } from '@/components/ui/form-footer';
import { DayForm } from '@/features/plan/components/DayForm';
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
    saveDayName,
    confirmDeleteDay,
    moveDay,
    addDayWithValidation,
    cancelDayEdit,
  } = usePlanDaysScreen(planId);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newDayTouched, setNewDayTouched] = useState(false);
  const [editDayTouched, setEditDayTouched] = useState(false);

  useEffect(() => {
    if (editingDay) {
      setEditDayTouched(false);
    }
  }, [editingDay]);

  const trimmedNewDay = newDayName.trim();
  const newDayError =
    newDayTouched && trimmedNewDay.length === 0 ? 'Day name is required.' : '';
  const isAddDayValid = trimmedNewDay.length > 0;

  const trimmedEditDay = editingDay?.name.trim() ?? '';
  const editDayError =
    editDayTouched && trimmedEditDay.length === 0 ? 'Day name is required.' : '';
  const isEditDayValid = trimmedEditDay.length > 0;

  const closeAddDaySheet = () => {
    setIsAddOpen(false);
    setNewDayName('');
    setNewDayTouched(false);
  };

  const handleAddDay = async () => {
    if (!isAddDayValid) {
      return;
    }
    const added = await addDayWithValidation();
    if (added) {
      closeAddDaySheet();
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Plan Details',
          headerBackTitle: 'Back',
          headerBackTitleVisible: true,
        }}
      />
      <PlanDaysView
        planName={plan?.name}
        gymType={plan?.gymType}
        days={orderedDays}
        onAddDay={() => setIsAddOpen(true)}
        onMoveDayUp={(dayId) => void moveDay(dayId, 'up')}
        onMoveDayDown={(dayId) => void moveDay(dayId, 'down')}
        onOpenBlocks={(dayId) => router.push(`/plans/${planId}/days/${dayId}`)}
        onEditDay={beginDayEdit}
        onDeleteDay={confirmDeleteDay}
        onBack={() => router.back()}
        isMissing={!plan}
      />
      <BottomSheet
        visible={isAddOpen}
        title="Add Day"
        onDismiss={closeAddDaySheet}
        footer={
          <FormFooter
            primaryLabel="Save"
            secondaryLabel="Cancel"
            onPrimary={() => void handleAddDay()}
            onSecondary={closeAddDaySheet}
            primaryDisabled={!isAddDayValid}
          />
        }>
        <DayForm
          name={newDayName}
          onChangeName={(value) => {
            setNewDayName(value);
            if (!newDayTouched) {
              setNewDayTouched(true);
            }
          }}
          onBlurName={() => setNewDayTouched(true)}
          error={newDayError}
        />
      </BottomSheet>
      <BottomSheet
        visible={Boolean(editingDay)}
        title="Edit Day"
        onDismiss={cancelDayEdit}
        footer={
          <FormFooter
            primaryLabel="Save"
            secondaryLabel="Cancel"
            onPrimary={() => void saveDayName()}
            onSecondary={cancelDayEdit}
            primaryDisabled={!isEditDayValid}
          />
        }>
        {editingDay ? (
          <DayForm
            name={editingDay.name}
            onChangeName={(value) => {
              setEditingName(value);
              if (!editDayTouched) {
                setEditDayTouched(true);
              }
            }}
            onBlurName={() => setEditDayTouched(true)}
            error={editDayError}
          />
        ) : null}
      </BottomSheet>
    </>
  );
}
