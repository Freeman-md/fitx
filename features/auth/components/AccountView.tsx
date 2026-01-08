import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { PageTitle, PrimaryText, SecondaryText } from '@/components/ui/text';
import { Spacing } from '@/components/ui/spacing';

type AccountViewProps = {
  firebaseEmail: string | null;
  isSignedIn: boolean;
  onSignIn: () => void;
  onSignOut: () => void;
};

export function AccountView({
  firebaseEmail,
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
          <SecondaryText>Status</SecondaryText>
          <PrimaryText>{isSignedIn ? 'Signed in' : 'Not signed in'}</PrimaryText>
          {firebaseEmail ? (
            <SecondaryText style={styles.emailText}>{firebaseEmail}</SecondaryText>
          ) : null}
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
  emailText: {
    fontSize: 13,
  },
  actions: {
    marginTop: 'auto',
  },
});
