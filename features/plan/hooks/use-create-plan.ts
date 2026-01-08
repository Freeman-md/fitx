import { useState } from 'react';

import { resolveOwnerId } from '@/data/identity';
import { loadWorkoutPlans, saveWorkoutPlans } from '@/data/storage';
import { buildNewPlan } from '@/features/plan/utils/plan-builders';
import { generateId } from '@/lib/id';

export function useCreatePlan() {
  const [nameInput, setNameInput] = useState('');
  const [gymTypeInput, setGymTypeInput] = useState('');

  const savePlan = async () => {
    if (nameInput.trim().length < 2) {
      return false;
    }

    const now = new Date().toISOString();
    const ownerId = await resolveOwnerId();
    const newPlan = buildNewPlan({
      id: generateId('plan'),
      ownerId,
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
