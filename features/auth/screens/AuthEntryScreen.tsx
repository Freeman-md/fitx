import { Stack, useRouter } from 'expo-router';

import { AuthEntryView } from '@/features/auth/components/AuthEntryView';

export default function AuthEntryScreen() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Account',
          headerBackTitle: 'Back',
          headerBackTitleVisible: true,
        }}
      />
      <AuthEntryView onContinue={() => router.back()} onSignIn={() => router.push('/auth/email')} />
    </>
  );
}
