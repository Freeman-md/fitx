import { initializeApp, getApps } from 'firebase/app';
import { getAuth, getReactNativePersistence, initializeAuth } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

type FirebaseConfig = {
  apiKey: string;
  authDomain?: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId: string;
};

const resolveFirebaseConfig = (): FirebaseConfig | null => {
  const extra = Constants.expoConfig?.extra ?? {};
  const apiKey = extra.firebaseApiKey ?? process.env.EXPO_PUBLIC_FIREBASE_API_KEY;
  const authDomain = extra.firebaseAuthDomain ?? process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN;
  const projectId = extra.firebaseProjectId ?? process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID;
  const storageBucket =
    extra.firebaseStorageBucket ?? process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET;
  const messagingSenderId =
    extra.firebaseMessagingSenderId ?? process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
  const appId = extra.firebaseAppId ?? process.env.EXPO_PUBLIC_FIREBASE_APP_ID;

  if (!apiKey || !projectId || !appId) {
    return null;
  }

  return {
    apiKey,
    authDomain,
    projectId,
    storageBucket,
    messagingSenderId,
    appId,
  };
};

const firebaseConfig = resolveFirebaseConfig();

export const firebaseApp = firebaseConfig
  ? getApps().length
    ? getApps()[0]
    : initializeApp(firebaseConfig)
  : null;

const createAuth = () => {
  if (!firebaseApp) {
    return null;
  }
  try {
    return initializeAuth(firebaseApp, {
      persistence: getReactNativePersistence(ReactNativeAsyncStorage),
    });
  } catch (error) {
    return getAuth(firebaseApp);
  }
};

export const firebaseAuth = createAuth();
export const hasFirebaseConfig = Boolean(firebaseConfig);
