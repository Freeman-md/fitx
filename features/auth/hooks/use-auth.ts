import { useEffect, useState } from 'react';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from 'firebase/auth';

import { firebaseAuth, hasFirebaseConfig } from '@/lib/firebase';
import {
  clearFirebaseUserId,
  ensureLocalUserId,
  loadFirebaseUserId,
  loadLocalUserId,
  saveFirebaseUserId,
} from '@/data/identity';

export function useAuth() {
  const [localUserId, setLocalUserId] = useState<string | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [firebaseUserId, setFirebaseUserId] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initLocal = async () => {
      const existing = await loadLocalUserId();
      if (existing) {
        setLocalUserId(existing);
        return;
      }
      const next = await ensureLocalUserId();
      setLocalUserId(next);
    };
    void initLocal();
  }, []);

  useEffect(() => {
    if (!hasFirebaseConfig || !firebaseAuth) {
      setIsReady(true);
      return;
    }

    const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        await saveFirebaseUserId(user.uid);
        setFirebaseUserId(user.uid);
      } else {
        await clearFirebaseUserId();
        setFirebaseUserId(null);
      }
      setIsReady(true);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!hasFirebaseConfig || !firebaseAuth) {
      return;
    }
    const loadStored = async () => {
      const storedId = await loadFirebaseUserId();
      if (storedId) {
        setFirebaseUserId(storedId);
      }
    };
    void loadStored();
  }, []);

  const isSignedIn = Boolean(firebaseUser);
  const email = firebaseUser?.email ?? null;

  const signInWithEmail = async (emailInput: string, passwordInput: string) => {
    if (!firebaseAuth) {
      return { ok: false, message: 'Firebase is not configured yet.', code: 'config-missing' };
    }
    try {
      await signInWithEmailAndPassword(firebaseAuth, emailInput, passwordInput);
      return { ok: true };
    } catch (error: any) {
      const code = error?.code as string | undefined;
      if (code === 'auth/invalid-credential' || code === 'auth/wrong-password') {
        return { ok: false, message: 'Incorrect email or password.', code };
      }
      return { ok: false, message: 'Unable to sign in. Try again.', code };
    }
  };

  const createAccountWithEmail = async (emailInput: string, passwordInput: string) => {
    if (!firebaseAuth) {
      return { ok: false, message: 'Firebase is not configured yet.', code: 'config-missing' };
    }
    try {
      await createUserWithEmailAndPassword(firebaseAuth, emailInput, passwordInput);
      return { ok: true };
    } catch (error: any) {
      const code = error?.code as string | undefined;
      if (code === 'auth/email-already-in-use') {
        return { ok: false, message: 'Account already exists. Sign in instead.', code };
      }
      if (code === 'auth/weak-password') {
        return {
          ok: false,
          message: typeof error?.message === 'string' ? error.message : 'Password is too weak.',
          code,
        };
      }
      return { ok: false, message: 'Unable to create account. Try again.', code };
    }
  };

  const signOutUser = async () => {
    if (!firebaseAuth) {
      return;
    }
    await signOut(firebaseAuth);
  };

  return {
    localUserId,
    firebaseUserId,
    email,
    isSignedIn,
    isReady,
    hasFirebaseConfig,
    signInWithEmail,
    createAccountWithEmail,
    signOutUser,
  };
}
