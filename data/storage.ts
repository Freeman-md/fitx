import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Session, WorkoutPlan } from './models';

const WORKOUT_PLANS_KEY = 'fitx:workout-plans';
const SESSIONS_KEY = 'fitx:sessions';

export async function saveWorkoutPlans(plans: WorkoutPlan[]): Promise<void> {
  await AsyncStorage.setItem(WORKOUT_PLANS_KEY, JSON.stringify(plans));
}

export async function loadWorkoutPlans(): Promise<WorkoutPlan[]> {
  const stored = await AsyncStorage.getItem(WORKOUT_PLANS_KEY);
  if (!stored) {
    return [];
  }
  return JSON.parse(stored) as WorkoutPlan[];
}

export async function saveSession(session: Session): Promise<void> {
  const sessions = await loadSessions();
  const next = sessions.filter((item) => item.id !== session.id);
  next.push(session);
  await AsyncStorage.setItem(SESSIONS_KEY, JSON.stringify(next));
}

export async function loadSessions(): Promise<Session[]> {
  const stored = await AsyncStorage.getItem(SESSIONS_KEY);
  if (!stored) {
    return [];
  }
  return JSON.parse(stored) as Session[];
}

export async function loadActiveSession(): Promise<Session | null> {
  const sessions = await loadSessions();
  return sessions.find((item) => item.status === 'active') ?? null;
}

export async function resetStorage(): Promise<void> {
  await AsyncStorage.multiRemove([WORKOUT_PLANS_KEY, SESSIONS_KEY]);
}
