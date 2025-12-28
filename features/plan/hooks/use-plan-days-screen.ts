import { useState } from 'react';
import { Alert } from 'react-native';

import { usePlanDays, type DayEdit } from '@/features/plan/hooks/use-plan-days';
import type { Weekday } from '@/data/models';

export function usePlanDaysScreen(planId: string | undefined) {
  const { plan, orderedDays, addDay, updateDayDetails, deleteDay, moveDay } = usePlanDays(planId);
  const [newDayName, setNewDayName] = useState('');
  const [newDayWeekday, setNewDayWeekday] = useState<Weekday | null>(null);
  const [editingDay, setEditingDay] = useState<DayEdit | null>(null);

  const addDayWithValidation = async () => {
    if (!newDayName.trim() || !newDayWeekday) {
      return false;
    }
    const added = await addDay(newDayName.trim(), newDayWeekday);
    if (added.ok) {
      setNewDayName('');
      setNewDayWeekday(null);
    }
    return added.ok;
  };

  const saveDayName = async () => {
    if (!editingDay) {
      return;
    }
    if (!editingDay.name.trim() || !editingDay.weekday) {
      return;
    }
    const saved = await updateDayDetails({
      id: editingDay.id,
      name: editingDay.name.trim(),
      weekday: editingDay.weekday,
    });
    if (saved.ok) {
      setEditingDay(null);
    }
  };

  const confirmDeleteDay = (dayId: string, dayName: string) => {
    Alert.alert('Delete Day', `Delete "${dayName}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteDay(dayId);
        },
      },
    ]);
  };

  const beginDayEdit = (day: { id: string; name: string; weekday?: Weekday }) => {
    setEditingDay({ id: day.id, name: day.name, weekday: day.weekday ?? null });
  };

  const setEditingName = (value: string) => {
    if (!editingDay) {
      return;
    }
    setEditingDay({ id: editingDay.id, name: value, weekday: editingDay.weekday });
  };

  const setEditingWeekday = (weekday: Weekday) => {
    if (!editingDay) {
      return;
    }
    setEditingDay({ id: editingDay.id, name: editingDay.name, weekday });
  };

  return {
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
    addDayWithValidation,
    saveDayName,
    confirmDeleteDay,
    moveDay,
    cancelDayEdit: () => setEditingDay(null),
  };
}
