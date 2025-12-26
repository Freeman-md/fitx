import type { Session, WorkoutDay, WorkoutPlan } from '@/data/models';

export type SummarySources = {
  session: Session | null;
  plan: WorkoutPlan | null;
  day: WorkoutDay | null;
};

export const resolveSummarySources = (
  sessions: Session[],
  plans: WorkoutPlan[],
  sessionId: string
): SummarySources => {
  const session = sessions.find((item) => item.id === sessionId) ?? null;
  if (!session) {
    return { session: null, plan: null, day: null };
  }

  const plan = plans.find((item) => item.id === session.workoutPlanId) ?? null;
  const day = plan?.days.find((item) => item.id === session.workoutDayId) ?? null;

  return { session, plan, day };
};
