import { Stack, useRouter } from 'expo-router';

import { AccountView } from '@/features/auth/components/AccountView';
import { useAuth } from '@/features/auth/hooks/use-auth';

export default function AccountScreen() {
  const router = useRouter();
  const { localUserId, firebaseUserId, email, isSignedIn, signOutUser } = useAuth();

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
        localUserId={localUserId}
        firebaseUserId={firebaseUserId}
        firebaseEmail={email}
        isSignedIn={isSignedIn}
        onSignIn={() => router.push('/auth')}
        onSignOut={() => void signOutUser()}
      />
    </>
  );
}
