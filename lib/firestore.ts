import { collection, doc, getFirestore, setDoc } from 'firebase/firestore';

import type { Session, WorkoutPlan } from '@/data/models';

import { firebaseApp, hasFirebaseConfig } from '@/lib/firebase';

export const firestore = hasFirebaseConfig && firebaseApp ? getFirestore(firebaseApp) : null;

export const usersCollection = firestore ? collection(firestore, 'users') : null;
export const plansCollection = firestore ? collection(firestore, 'plans') : null;
export const sessionsCollection = firestore ? collection(firestore, 'sessions') : null;

export const userDocRef = (userId: string) =>
  firestore ? doc(firestore, 'users', userId) : null;

export const planDocRef = (planId: string) =>
  firestore ? doc(firestore, 'plans', planId) : null;

export const sessionDocRef = (sessionId: string) =>
  firestore ? doc(firestore, 'sessions', sessionId) : null;

export const writePlanSnapshot = async (plan: WorkoutPlan) => {
  if (!firestore) {
    return false;
  }
  const ref = planDocRef(plan.id);
  if (!ref) {
    return false;
  }
  await setDoc(ref, {
    ownerId: plan.ownerId,
    updatedAt: plan.updatedAt,
    snapshot: plan,
  });
  return true;
};

export const writeSessionSummary = async (session: Session) => {
  if (!firestore) {
    return false;
  }
  const ref = sessionDocRef(session.id);
  if (!ref) {
    return false;
  }
  await setDoc(ref, {
    ownerId: session.ownerId,
    completedAt: session.endedAt ?? session.updatedAt,
    summary: {
      id: session.id,
      workoutPlanId: session.workoutPlanId,
      workoutDayId: session.workoutDayId,
      startedAt: session.startedAt,
      endedAt: session.endedAt ?? null,
      status: session.status,
    },
  });
  return true;
};
