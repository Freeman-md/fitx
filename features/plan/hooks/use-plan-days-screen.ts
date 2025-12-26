import { useState } from 'react';
import { Alert } from 'react-native';

import { usePlanDays, type DayEdit } from '@/features/plan/hooks/use-plan-days';
import { getRequiredNameAlert } from '@/features/plan/utils/validation';

export function usePlanDaysScreen(planId: string | undefined) {
  const { plan, orderedDays, addDay, renameDay, deleteDay, moveDay } = usePlanDays(planId);
  const [newDayName, setNewDayName] = useState('');
  const [editingDay, setEditingDay] = useState<DayEdit | null>(null);

  const handleAddDay = async () => {
    const error = getRequiredNameAlert('Day name', newDayName);
    if (error) {
      Alert.alert(error.title, error.message);
      return;
    }
    const added = await addDay(newDayName.trim());
    if (added) {
      setNewDayName('');
    }
  };

  const handleRenameDay = async () => {
    if (!editingDay) {
      return;
    }
    const error = getRequiredNameAlert('Day name', editingDay.name);
    if (error) {
      Alert.alert(error.title, error.message);
      return;
    }
    await renameDay({ id: editingDay.id, name: editingDay.name.trim() });
    setEditingDay(null);
  };

  const handleDeleteDay = (dayId: string, dayName: string) => {
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

  const startEditingDay = (dayId: string, dayName: string) => {
    setEditingDay({ id: dayId, name: dayName });
  };

  const handleEditingNameChange = (value: string) => {
    if (!editingDay) {
      return;
    }
    setEditingDay({ id: editingDay.id, name: value });
  };

  return {
    plan,
    orderedDays,
    newDayName,
    setNewDayName,
    editingDay,
    startEditingDay,
    handleEditingNameChange,
    handleAddDay,
    handleRenameDay,
    handleDeleteDay,
    moveDay,
    cancelEdit: () => setEditingDay(null),
  };
}
