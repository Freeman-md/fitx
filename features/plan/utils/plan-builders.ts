import type { WorkoutPlan } from '@/data/models';

type BuildPlanInput = {
  id: string;
  name: string;
  gymType?: string;
  timestamp: string;
};

export const buildNewPlan = ({ id, name, gymType, timestamp }: BuildPlanInput): WorkoutPlan => {
  return {
    id,
    name,
    gymType: gymType || undefined,
    createdAt: timestamp,
    updatedAt: timestamp,
    days: [],
  };
};
