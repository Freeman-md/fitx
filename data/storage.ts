import AsyncStorage from '@react-native-async-storage/async-storage';

import { SessionStatus } from './models';
import type { Session, WorkoutPlan } from './models';

const WORKOUT_PLANS_KEY = 'fitx:workout-plans';
const SESSIONS_KEY = 'fitx:sessions';
const REST_STATE_KEY = 'fitx:rest-state';
const LAST_COMPLETED_SESSION_KEY = 'fitx:last-completed-session';

type RestState = {
  sessionId: string;
  endsAt: string;
};

export async function saveWorkoutPlans(
  plans: WorkoutPlan[],
  options: { allowEmpty: boolean } = { allowEmpty: true }
): Promise<void> {
  if (!Array.isArray(plans)) {
    throw new Error('Workout plans must be saved as an array.');
  }

  if (!options.allowEmpty && plans.length === 0) {
    throw new Error('Refusing to save an empty workout plan list.');
  }

  // Write a detached copy to prevent shared references leaking into storage.
  const safeCopy = JSON.stringify(JSON.parse(JSON.stringify(plans)));

  await AsyncStorage.setItem(WORKOUT_PLANS_KEY, safeCopy);
}

export async function loadWorkoutPlans(): Promise<WorkoutPlan[]> {
  const stored = await AsyncStorage.getItem(WORKOUT_PLANS_KEY);
  if (!stored) {
    return [];
  }
  try {
    const parsed = JSON.parse(stored) as unknown;
    return Array.isArray(parsed) ? (parsed as WorkoutPlan[]) : [];
  } catch (error) {
    return [];
  }
}

export async function saveSession(session: Session): Promise<void> {
  const sessions = await loadSessions();
  const next = sessions.filter((item) => item.id !== session.id);
  next.push(session);
  await saveSessions(next);
}

export async function loadSessions(): Promise<Session[]> {
  const stored = await AsyncStorage.getItem(SESSIONS_KEY);
  if (!stored) {
    return [];
  }
  return JSON.parse(stored) as Session[];
}

export async function saveSessions(sessions: Session[]): Promise<void> {
  await AsyncStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
}

export async function loadActiveSession(): Promise<Session | null> {
  const sessions = await loadSessions();
  return sessions.find((item) => item.status === SessionStatus.Active) ?? null;
}

export async function resetStorage(): Promise<void> {
  await AsyncStorage.multiRemove([
    WORKOUT_PLANS_KEY,
    SESSIONS_KEY,
    REST_STATE_KEY,
    LAST_COMPLETED_SESSION_KEY,
  ]);
}

export async function saveRestState(state: RestState): Promise<void> {
  await AsyncStorage.setItem(REST_STATE_KEY, JSON.stringify(state));
}

export async function loadRestState(): Promise<RestState | null> {
  const stored = await AsyncStorage.getItem(REST_STATE_KEY);
  if (!stored) {
    return null;
  }
  return JSON.parse(stored) as RestState;
}

export async function clearRestState(): Promise<void> {
  await AsyncStorage.removeItem(REST_STATE_KEY);
}

export async function saveLastCompletedSessionId(sessionId: string): Promise<void> {
  await AsyncStorage.setItem(LAST_COMPLETED_SESSION_KEY, sessionId);
}

export async function loadLastCompletedSessionId(): Promise<string | null> {
  return AsyncStorage.getItem(LAST_COMPLETED_SESSION_KEY);
}
