import { useState } from 'react';
import { Alert } from 'react-native';

import { loadWorkoutPlans, saveWorkoutPlans } from '@/data/storage';
import { buildNewPlan } from '@/features/plan/utils/plan-builders';
import { getRequiredNameAlert } from '@/features/plan/utils/validation';

export function useCreatePlan() {
  const [nameInput, setNameInput] = useState('');
  const [gymTypeInput, setGymTypeInput] = useState('');

  const savePlan = async () => {
    const nameError = getRequiredNameAlert('Plan name', nameInput);
    if (nameError) {
      Alert.alert(nameError.title, nameError.message);
      return false;
    }

    const now = new Date().toISOString();
    const newPlan = buildNewPlan({
      id: `plan-${Date.now()}`,
      name: nameInput.trim(),
      gymType: gymTypeInput.trim(),
      timestamp: now,
    });

    const existingPlans = await loadWorkoutPlans();
    const nextPlans = [...existingPlans, newPlan];
    await saveWorkoutPlans(nextPlans);
    return true;
  };

  return {
    nameInput,
    setNameInput,
    gymTypeInput,
    setGymTypeInput,
    savePlan,
  };
}
