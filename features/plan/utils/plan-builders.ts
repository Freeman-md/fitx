import type { WorkoutPlan } from '@/data/models';

type BuildPlanInput = {
  id: string;
  ownerId: string;
  name: string;
  gymType?: string;
  timestamp: string;
};

export const buildNewPlan = ({
  id,
  ownerId,
  name,
  gymType,
  timestamp,
}: BuildPlanInput): WorkoutPlan => {
  return {
    id,
    ownerId,
    name,
    gymType: gymType || undefined,
    createdAt: timestamp,
    updatedAt: timestamp,
    days: [],
  };
};
