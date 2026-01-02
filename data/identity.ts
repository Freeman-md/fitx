import AsyncStorage from '@react-native-async-storage/async-storage';

const LOCAL_USER_ID_KEY = 'fitx:local-user-id';
const FIREBASE_USER_ID_KEY = 'fitx:firebase-user-id';

const generateLocalUserId = () => {
  const random = Math.random().toString(36).slice(2, 10);
  return `local-${Date.now()}-${random}`;
};

export async function ensureLocalUserId(): Promise<string> {
  const stored = await AsyncStorage.getItem(LOCAL_USER_ID_KEY);
  if (stored) {
    return stored;
  }
  const next = generateLocalUserId();
  await AsyncStorage.setItem(LOCAL_USER_ID_KEY, next);
  return next;
}

export async function loadLocalUserId(): Promise<string | null> {
  return AsyncStorage.getItem(LOCAL_USER_ID_KEY);
}

export async function saveFirebaseUserId(firebaseUserId: string): Promise<void> {
  await AsyncStorage.setItem(FIREBASE_USER_ID_KEY, firebaseUserId);
}

export async function loadFirebaseUserId(): Promise<string | null> {
  return AsyncStorage.getItem(FIREBASE_USER_ID_KEY);
}

export async function clearFirebaseUserId(): Promise<void> {
  await AsyncStorage.removeItem(FIREBASE_USER_ID_KEY);
}
