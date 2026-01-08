import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Session, WorkoutPlan } from '@/data/models';
import { writePlanSnapshot, writeSessionSummary } from '@/lib/firestore';

const PLAN_MIRROR_STATE_KEY = 'fitx:plan-mirror-state';
const SESSION_MIRROR_STATE_KEY = 'fitx:session-mirror-state';
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

type PlanMirrorState = Record<string, { dirty: boolean; lastUploadedAt?: string }>;
type SessionMirrorState = Record<string, { uploadedAt: string }>;

const loadPlanMirrorState = async (): Promise<PlanMirrorState> => {
  const stored = await AsyncStorage.getItem(PLAN_MIRROR_STATE_KEY);
  if (!stored) {
    return {};
  }
  try {
    const parsed = JSON.parse(stored) as PlanMirrorState;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch (error) {
    return {};
  }
};

const savePlanMirrorState = async (state: PlanMirrorState) => {
  await AsyncStorage.setItem(PLAN_MIRROR_STATE_KEY, JSON.stringify(state));
};

const loadSessionMirrorState = async (): Promise<SessionMirrorState> => {
  const stored = await AsyncStorage.getItem(SESSION_MIRROR_STATE_KEY);
  if (!stored) {
    return {};
  }
  try {
    const parsed = JSON.parse(stored) as SessionMirrorState;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch (error) {
    return {};
  }
};

const saveSessionMirrorState = async (state: SessionMirrorState) => {
  await AsyncStorage.setItem(SESSION_MIRROR_STATE_KEY, JSON.stringify(state));
};

const isPlanUploadDue = (state: PlanMirrorState, planId: string) => {
  const entry = state[planId];
  if (!entry?.dirty) {
    return false;
  }
  if (!entry.lastUploadedAt) {
    return true;
  }
  const last = Date.parse(entry.lastUploadedAt);
  if (Number.isNaN(last)) {
    return true;
  }
  return Date.now() - last >= ONE_DAY_MS;
};

export const markPlanDirty = async (planId: string) => {
  const state = await loadPlanMirrorState();
  state[planId] = {
    dirty: true,
    lastUploadedAt: state[planId]?.lastUploadedAt,
  };
  await savePlanMirrorState(state);
};

export const attemptPlanMirror = async (plan: WorkoutPlan) => {
  try {
    const state = await loadPlanMirrorState();
    if (!isPlanUploadDue(state, plan.id)) {
      return false;
    }
    const success = await writePlanSnapshot(plan);
    if (!success) {
      return false;
    }
    state[plan.id] = {
      dirty: false,
      lastUploadedAt: new Date().toISOString(),
    };
    await savePlanMirrorState(state);
    return true;
  } catch (error) {
    return false;
  }
};

export const mirrorCompletedSession = async (session: Session) => {
  if (session.status !== 'completed') {
    return false;
  }
  try {
    const state = await loadSessionMirrorState();
    if (state[session.id]) {
      return false;
    }
    const success = await writeSessionSummary(session);
    if (!success) {
      return false;
    }
    state[session.id] = { uploadedAt: new Date().toISOString() };
    await saveSessionMirrorState(state);
    return true;
  } catch (error) {
    return false;
  }
};

export const mirrorPendingSessions = async (sessions: Session[]) => {
  for (const session of sessions) {
    if (session.status === 'completed') {
      await mirrorCompletedSession(session);
    }
  }
};
