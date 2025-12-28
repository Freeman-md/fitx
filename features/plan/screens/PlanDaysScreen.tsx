import { useEffect, useMemo, useState } from 'react';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';

import { BottomSheet } from '@/components/ui/bottom-sheet';
import { FormFooter } from '@/components/ui/form-footer';
import { DayForm } from '@/features/plan/components/DayForm';
import { PlanDaysView } from '@/features/plan/components/PlanDaysView';
import { usePlanDaysScreen } from '@/features/plan/hooks/use-plan-days-screen';
import type { Weekday } from '@/data/models';

export default function PlanDaysScreen() {
  const router = useRouter();
  const { planId } = useLocalSearchParams<{ planId: string }>();
  const {
    plan,
    orderedDays,
    newDayName,
    setNewDayName,
    newDayWeekday,
    setNewDayWeekday,
    editingDay,
    beginDayEdit,
    setEditingName,
    setEditingWeekday,
    saveDayName,
    confirmDeleteDay,
    moveDay,
    addDayWithValidation,
    cancelDayEdit,
  } = usePlanDaysScreen(planId);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newDayTouched, setNewDayTouched] = useState(false);
  const [newDayWeekdayTouched, setNewDayWeekdayTouched] = useState(false);
  const [editDayTouched, setEditDayTouched] = useState(false);
  const [editDayWeekdayTouched, setEditDayWeekdayTouched] = useState(false);

  useEffect(() => {
    if (editingDay) {
      setEditDayTouched(false);
      setEditDayWeekdayTouched(false);
    }
  }, [editingDay]);

  const trimmedNewDay = newDayName.trim();
  const newDayError =
    newDayTouched && trimmedNewDay.length === 0 ? 'Day name is required.' : '';
  const existingWeekdays = useMemo(
    () => orderedDays.map((day) => day.weekday).filter(Boolean) as Weekday[],
    [orderedDays]
  );
  const isNewWeekdayTaken = newDayWeekday
    ? existingWeekdays.includes(newDayWeekday)
    : false;
  const newDayWeekdayError =
    newDayWeekdayTouched && !newDayWeekday
      ? 'Select a day of the week.'
      : newDayWeekday && isNewWeekdayTaken
        ? 'That weekday is already assigned.'
        : '';
  const isAddDayValid =
    trimmedNewDay.length > 0 && Boolean(newDayWeekday) && !isNewWeekdayTaken;

  const trimmedEditDay = editingDay?.name.trim() ?? '';
  const editDayError =
    editDayTouched && trimmedEditDay.length === 0 ? 'Day name is required.' : '';
  const isEditWeekdayTaken =
    editingDay?.weekday && orderedDays.some(
      (day) => day.weekday === editingDay.weekday && day.id !== editingDay.id
    );
  const editDayWeekdayError =
    editDayWeekdayTouched && !editingDay?.weekday
      ? 'Select a day of the week.'
      : editingDay?.weekday && isEditWeekdayTaken
        ? 'That weekday is already assigned.'
        : '';
  const isEditDayValid =
    trimmedEditDay.length > 0 && Boolean(editingDay?.weekday) && !isEditWeekdayTaken;

  const closeAddDaySheet = () => {
    setIsAddOpen(false);
    setNewDayName('');
    setNewDayTouched(false);
    setNewDayWeekday(null);
    setNewDayWeekdayTouched(false);
  };

  const handleAddDay = async () => {
    if (!newDayTouched) {
      setNewDayTouched(true);
    }
    if (!newDayWeekdayTouched) {
      setNewDayWeekdayTouched(true);
    }
    if (!isAddDayValid) {
      return;
    }
    const added = await addDayWithValidation();
    if (added) {
      closeAddDaySheet();
    }
  };

  const handleSaveEditDay = async () => {
    if (!editDayTouched) {
      setEditDayTouched(true);
    }
    if (!editDayWeekdayTouched) {
      setEditDayWeekdayTouched(true);
    }
    if (!isEditDayValid) {
      return;
    }
    await saveDayName();
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
        onEditDay={(day) => beginDayEdit(day)}
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
          weekday={newDayWeekday}
          onChangeName={(value) => {
            setNewDayName(value);
            if (!newDayTouched) {
              setNewDayTouched(true);
            }
          }}
          onChangeWeekday={(weekday) => {
            setNewDayWeekday(weekday);
            if (!newDayWeekdayTouched) {
              setNewDayWeekdayTouched(true);
            }
          }}
          onBlurName={() => setNewDayTouched(true)}
          nameError={newDayError}
          weekdayError={newDayWeekdayError}
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
            onPrimary={() => void handleSaveEditDay()}
            onSecondary={cancelDayEdit}
            primaryDisabled={!isEditDayValid}
          />
        }>
        {editingDay ? (
          <DayForm
            name={editingDay.name}
            weekday={editingDay.weekday}
            onChangeName={(value) => {
              setEditingName(value);
              if (!editDayTouched) {
                setEditDayTouched(true);
              }
            }}
            onChangeWeekday={(weekday) => {
              setEditingWeekday(weekday);
              if (!editDayWeekdayTouched) {
                setEditDayWeekdayTouched(true);
              }
            }}
            onBlurName={() => setEditDayTouched(true)}
            nameError={editDayError}
            weekdayError={editDayWeekdayError}
          />
        ) : null}
      </BottomSheet>
    </>
  );
}
