import { Stack, useRouter } from 'expo-router';

import { AccountView } from '@/features/auth/components/AccountView';
import { useAuth } from '@/features/auth/hooks/use-auth';

export default function AccountScreen() {
  const router = useRouter();
  const { email, isSignedIn, signOutUser } = useAuth();

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Account',
          headerBackTitle: 'Back',
          headerBackTitleVisible: true,
        }}
      />
      <AccountView
        firebaseEmail={email}
        isSignedIn={isSignedIn}
        onSignIn={() => router.push('/auth/sign-in')}
        onSignOut={() => void signOutUser()}
      />
    </>
  );
}
