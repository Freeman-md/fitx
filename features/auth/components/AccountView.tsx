import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { PageTitle, PrimaryText, SecondaryText } from '@/components/ui/text';
import { Spacing } from '@/components/ui/spacing';

type AccountViewProps = {
  localUserId: string | null;
  firebaseEmail: string | null;
  firebaseUserId: string | null;
  isSignedIn: boolean;
  onSignIn: () => void;
  onSignOut: () => void;
};

export function AccountView({
  localUserId,
  firebaseEmail,
  firebaseUserId,
  isSignedIn,
  onSignIn,
  onSignOut,
}: AccountViewProps) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <PageTitle>Account</PageTitle>
          <SecondaryText style={styles.subtitle}>
            Optional sign-in. Local data stays on this device.
          </SecondaryText>
        </View>
        <View style={styles.section}>
          <SecondaryText>Local user</SecondaryText>
          <PrimaryText>{localUserId ?? 'Loading...'}</PrimaryText>
        </View>
        <View style={styles.section}>
          <SecondaryText>Signed in email</SecondaryText>
          <PrimaryText>{firebaseEmail ?? 'Not signed in'}</PrimaryText>
        </View>
        <View style={styles.section}>
          <SecondaryText>Firebase user ID</SecondaryText>
          <PrimaryText>{firebaseUserId ?? '—'}</PrimaryText>
        </View>
        <View style={styles.actions}>
          {isSignedIn ? (
            <Button label="Sign out" variant="secondary" onPress={onSignOut} />
          ) : (
            <Button label="Sign in with email" onPress={onSignIn} />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: Spacing.md,
    gap: Spacing.md,
  },
  header: {
    gap: Spacing.xs,
  },
  subtitle: {
    textAlign: 'center',
  },
  section: {
    gap: Spacing.xs,
  },
  actions: {
    marginTop: 'auto',
  },
});
