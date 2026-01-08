import { Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';

import { AuthEntryView } from '@/features/auth/components/AuthEntryView';
import { useAuth } from '@/features/auth/hooks/use-auth';

export default function AuthEntryScreen() {
  const router = useRouter();
  const { isSignedIn, isReady } = useAuth();

  useEffect(() => {
    if (!isReady || !isSignedIn) {
      return;
    }
    router.replace('/account');
  }, [isReady, isSignedIn, router]);

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Account',
          headerBackTitle: 'Back',
          headerBackTitleVisible: true,
        }}
      />
      <AuthEntryView
        onContinue={() => router.back()}
        onSignIn={() => router.push('/auth/sign-in')}
      />
    </>
  );
}
