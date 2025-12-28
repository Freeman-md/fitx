import { useEffect, useState } from 'react';
import { Stack, useRootNavigationState, useRouter } from 'expo-router';

import { loadHasCompletedOnboarding } from '@/data/storage';
import { SplashView } from '@/features/onboarding/components/SplashView';

export default function Index() {
  const router = useRouter();
  const navigationState = useRootNavigationState();
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean | null>(null);
  const [isSplashComplete, setIsSplashComplete] = useState(false);
  const isNavReady = Boolean(navigationState?.key);

  useEffect(() => {
    let isMounted = true;
    const loadFlag = async () => {
      const completed = await loadHasCompletedOnboarding();
      if (isMounted) {
        setHasCompletedOnboarding(completed);
      }
    };
    void loadFlag();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSplashComplete(true);
    }, 700);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isNavReady || !isSplashComplete || hasCompletedOnboarding === null) {
      return;
    }
    router.replace(hasCompletedOnboarding ? '/(tabs)/train' : '/onboarding');
  }, [hasCompletedOnboarding, isNavReady, isSplashComplete, router]);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SplashView />
    </>
  );
}
